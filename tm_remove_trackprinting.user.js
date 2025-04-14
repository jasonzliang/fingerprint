// ==UserScript==
// @name         Reddit Privacy Enhancer with Fixed Fingerprint Display and Execution Time
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  Block fingerprinting and tracking on Reddit with consistent fingerprint ID and display, and measure script execution time
// @author       Jason Liang
// @match        https://*.reddit.com/*
// @match        https://*.browserscan.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @run-at       document-start
// @updateURL    https://github.com/jasonzliang/fingerprint/raw/refs/heads/main/tm_remove_trackprinting.user.js
// @downloadURL  https://github.com/jasonzliang/fingerprint/raw/refs/heads/main/tm_remove_trackprinting.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Record start time at the very beginning
    const scriptStartTime = performance.now();

    // Debug flag - set to false in production
    const DEBUG = true;

    // Log only when debug is enabled
    function debugLog(...args) {
        if (DEBUG) {
            console.log('[RedditPrivacy]', ...args);
        }
    }

    // Error logging
    function errorLog(...args) {
        console.error('[RedditPrivacy]', ...args);
    }

    // Get username from various possible Reddit sources
    function getCurrentUsername() {
        try {
            // Try different paths to find the username
            let username = null;

            // Method 1: From r.config.logged
            if (window.r?.config?.logged) {
                username = window.r.config.logged;
                return username;
            }

            // Method 2: From session storage
            if (sessionStorage.getItem("current-user")) {
                username = sessionStorage.getItem("current-user");
                return username;
            }

            // Method 3: From DOM elements (when DOM is ready)
            if (document.body) {
                // Try different selectors that might contain username
                const usernameSelectors = [
                    'span.user a', // Old Reddit
                    'a[href^="/user/"]', // Various Reddit designs
                    'header a[href^="/user/"]', // New Reddit header
                    '[data-testid="username"]', // Potential test ID
                ];

                for (const selector of usernameSelectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const el of elements) {
                        // Extract username from href or text content
                        const href = el?.getAttribute('href');
                        if (href && href.startsWith('/user/')) {
                            username = href.split('/user/')[1]?.split('/')?.[0];
                            if (username && username !== 'undefined' && username !== 'null') {
                                return username;
                            }
                        }

                        // Or try from text content if it looks like a username
                        const text = el?.textContent?.trim();
                        if (text && !text.includes(' ') && text.length > 1 && text.length < 30) {
                            username = text;
                            return username;
                        }
                    }
                }
            }

            // Fallback: Return default anonymous value
            return 'anonymous_user';
        } catch (e) {
            errorLog('Error in getCurrentUsername:', e);
            return 'anonymous_user';
        }
    }

    // Simple string hash function that creates a 32-character hex string
    function hashUsername(username) {
        try {
            // If no username, use a default string
            if (!username || username === '') {
                username = 'anonymous_user';
            }

            // Initial state - use prime numbers for better distribution
            const primes = [
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
                31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
                73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
                127, 131
            ];

            // Create state array initialized with prime numbers
            const state = [...primes];

            // Process each character of the input string
            for (let i = 0; i < username.length; i++) {
                const charCode = username.charCodeAt(i);

                // Update each element in the state array
                for (let j = 0; j < 32; j++) {
                    // Different mixing function for each state element
                    state[j] = Math.abs(
                        (state[j] * 33 + charCode + i) ^
                        (state[(j + i) % 32] >>> (i % 8)) ^
                        ((j * charCode) & 0xFF)
                    ) % 256;
                }
            }

            // Convert state to hexadecimal string
            let hexString = state.map(num => {
                // Ensure two hex digits per byte
                const hex = num.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');

            // Guarantee exactly 32 characters
            if (hexString.length > 32) {
                // Truncate if longer than 32
                hexString = hexString.substring(0, 32);
            } else if (hexString.length < 32) {
                // Pad with zeros if shorter than 32
                hexString = hexString.padEnd(32, '0');
            }

            return hexString;
        } catch (e) {
            errorLog('Error in hashUsername:', e);
            // Fallback to a random but consistent fingerprint
            return '531ff50310f6fb45cdf08bf1f1f8ece4';
        }
    }

    // Simplified seeded random number generator
    function createSeededRandom(seed) {
        // Handle corner cases for seed
        if (!seed) {
            seed = '00000000';
        }

        // Parse the seed if it's a JSON string
        if (typeof seed === 'string' && seed.startsWith('"') && seed.endsWith('"')) {
            try {
                seed = JSON.parse(seed);
            } catch (e) {
                seed = '00000000';
            }
        }

        // Convert the first 8 characters of the hex string to a number for the initial state
        let state = 0;
        for (let i = 0; i < Math.min(8, seed.length); i++) {
            state = (state * 16) + parseInt(seed.charAt(i), 16);
        }

        // Return a function that generates random numbers
        return function() {
            // Simple xorshift algorithm for pseudorandom numbers
            state ^= state << 13;
            state ^= state >>> 17;
            state ^= state << 5;

            // Return a value between 0 and 1
            return (state >>> 0) / 4294967296;
        };
    }

    // Unified fingerprint management: get, set, validate
    function manageFingerprint(action, username) {
        try {
            // Default to getting the current username if none provided
            if (!username && (action === 'set' || action === 'validate')) {
                username = getCurrentUsername();
            }

            // Generate the expected fingerprint hash
            const expectedFp = username ? hashUsername(username) : null;

            // Get stored fingerprint
            let storedFp;
            try {
                const rawStored = localStorage.getItem('fp');
                storedFp = rawStored ? (rawStored.startsWith('"') ? JSON.parse(rawStored) : rawStored) : null;
            } catch (e) {
                debugLog('Error parsing stored fingerprint:', e);
                storedFp = null;
            }

            // Handle different actions
            switch (action) {
                case 'get':
                    return storedFp || (username ? hashUsername(username) : null);

                case 'set':
                    // Only set if it doesn't exist or doesn't match expected
                    if (!storedFp || storedFp !== expectedFp) {
                        debugLog('Setting fingerprint:', expectedFp);
                        localStorage.setItem('fp', JSON.stringify(expectedFp));

                        // Set or maintain timestamp
                        if (!localStorage.getItem('fp_timestamp')) {
                            localStorage.setItem('fp_timestamp', JSON.stringify(Date.now()));
                        }
                    }
                    return expectedFp;

                case 'validate':
                    // Check if fingerprint is missing or doesn't match what we expect
                    if (!storedFp || storedFp !== expectedFp) {
                        debugLog('Fingerprint validation failed, fixing...');
                        localStorage.setItem('fp', JSON.stringify(expectedFp));

                        // Update the display if it exists
                        const displayEl = document.getElementById('fingerprint-display');
                        if (displayEl) {
                            displayEl.textContent = displayEl.textContent.includes('Fingerprint:') ?
                                `Fingerprint: ${expectedFp}` :
                                `FP: ${expectedFp.substring(0, 8)}...`;
                            displayEl.setAttribute('data-fp', expectedFp);
                        }
                        return false;
                    }
                    return true;

                default:
                    errorLog('Unknown fingerprint action:', action);
                    return null;
            }
        } catch (e) {
            errorLog('Error in manageFingerprint:', e);
            return action === 'validate' ? false : null;
        }
    }

    // Create/update the display element
    function createFingerprintDisplay() {
        try {
            // Make sure body exists
            if (!document.body) {
                return false;
            }

            // Get current fingerprint
            const fingerprint = manageFingerprint('get');

            // Add null/undefined check
            if (!fingerprint) {
                return false;
            }

            // Check if display already exists
            let displayEl = document.getElementById('fingerprint-display');

            if (displayEl) {
                // Update existing display
                displayEl.textContent = `FP: ${fingerprint.substring(0, 8)}...`;
                displayEl.setAttribute('data-fp', fingerprint);
                return true;
            }

            // Create new display element
            displayEl = document.createElement('div');
            displayEl.id = 'fingerprint-display';
            Object.assign(displayEl.style, {
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '5px',
                fontSize: '12px',
                fontFamily: 'monospace',
                zIndex: '99999',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                userSelect: 'none',
                pointerEvents: 'auto'
            });

            // Set text content with shortened display
            displayEl.textContent = `FP: ${fingerprint.substring(0, 8)}...`;
            displayEl.setAttribute('data-fp', fingerprint);
            displayEl.title = 'Your fixed Reddit fingerprint - Click to expand';

            // Add click behavior to toggle between short/long display
            let expanded = false;
            displayEl.addEventListener('click', function() {
                expanded = !expanded;
                const fp = this.getAttribute('data-fp');
                this.textContent = expanded ?
                    `Fingerprint: ${fp}` :
                    `FP: ${fp.substring(0, 8)}...`;
            });

            // Add to document
            document.body.appendChild(displayEl);

            return true;
        } catch (e) {
            errorLog('Error creating fingerprint display:', e);
            return false;
        }
    }

    // Override Reddit's fingerprint function
    function overrideRedditFingerprint() {
        try {
            if (window.r && window.r.utils) {
                // Get username if logged in
                const username = getCurrentUsername();

                // Set the fingerprint
                const fingerprint = manageFingerprint('set', username);

                // Override Reddit's getFingerprint method
                window.r.utils.getFingerprint = function() {
                    // Parse timestamp from localStorage properly
                    let timestamp;
                    const storedTimestamp = localStorage.getItem('fp_timestamp');

                    try {
                        timestamp = storedTimestamp ? JSON.parse(storedTimestamp) : Date.now();
                    } catch (e) {
                        timestamp = Date.now();
                    }

                    // Update timestamp in storage if new timestamp created
                    if (timestamp != storedTimestamp) {
                        localStorage.setItem('fp_timestamp', JSON.stringify(timestamp));
                    }

                    return {
                        fp: fingerprint,
                        timestamp: timestamp
                    };
                };

                // Also override user_hash if it exists
                if (window.r.config && window.r.config.user_hash) {
                    window.r.config.user_hash = fingerprint;
                }

                // Update display with current fingerprint
                createFingerprintDisplay();
                return true;
            }
            return false;
        } catch (e) {
            errorLog('Failed to override Reddit fingerprint:', e);
            return false;
        }
    }

    // Clean tracking data while preserving our fingerprint
    function performCleanup() {
        try {
            // Save our fingerprint values
            let fp, fpTimestamp;

            try {
                fp = localStorage.getItem('fp');
                fpTimestamp = localStorage.getItem('fp_timestamp');
            } catch (e) {
                debugLog('Error reading localStorage during cleanup:', e);
            }

            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key !== 'fp' && key !== 'fp_timestamp' && (
                    key.includes('_id') || key.includes('loid') ||
                    key.includes('token') || key.includes('track') ||
                    key.includes('session'))) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    debugLog('Error removing key:', key, e);
                }
            });

            // Restore our fingerprint values
            if (fp) localStorage.setItem('fp', fp);
            if (fpTimestamp) localStorage.setItem('fp_timestamp', fpTimestamp);

        } catch (e) {
            errorLog('Error cleaning localStorage:', e);
        }
    }

    // Intercept localStorage.setItem
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // For fingerprint, check if it matches our expected value
        if (key === 'fp') {
            const username = getCurrentUsername();
            const expectedFP = hashUsername(username);

            // Extract actual fingerprint if it's a JSON string
            let actualValue = value;
            try {
                if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                    actualValue = JSON.parse(value);
                }
            } catch (e) {}

            // If value doesn't match our expected fingerprint, use ours instead
            if (actualValue !== expectedFP) {
                // Make sure to store it as a JSON string
                value = JSON.stringify(expectedFP);
            }
        }

        // Similarly for timestamp, ensure it's stored as JSON
        if (key === 'fp_timestamp') {
            try {
                // Make sure it's a properly formatted JSON number
                const timestamp = parseInt(value);
                if (!isNaN(timestamp)) {
                    value = JSON.stringify(timestamp);
                }
            } catch (e) {}
        }

        // Block known tracking keys
        if (key !== 'fp' && key !== 'fp_timestamp' && (
            key.includes('_id') || key.includes('loid') ||
            key.includes('token') || key.includes('track') ||
            key.includes('session'))) {
            debugLog('Blocked tracking key:', key);
            return;
        }

        // Call original function
        return originalSetItem.call(this, key, value);
    };

    // Safe cookie handling without recursion
    const originalDocumentCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');

    // Fix potential cookie setting issue by adding a proper guard against infinite recursion
    let inCookieSetter = false;

    Object.defineProperty(document, 'cookie', {
        get: function() {
            const cookies = originalDocumentCookieDescriptor.get.call(this);
            // Filter out tracking cookies without causing recursion
            return cookies.replace(/reddit_session=[^;]+;?/g, '')
                          .replace(/loid=[^;]+;?/g, '')
                          .replace(/rabt=[^;]+;?/g, '')
                          .replace(/user_tracking=[^;]+;?/g, '');
        },
        set: function(val) {
            // Avoid recursion by using a guard flag
            if (inCookieSetter) return;
            inCookieSetter = true;

            try {
                // Add null check before calling includes
                if (val && (val.includes('reddit_session') ||
                    val.includes('loid') ||
                    val.includes('rabt') ||
                    val.includes('user_tracking'))) {
                    debugLog('Sanitized cookie:', val);
                    return; // Don't set tracking cookies
                }

                return originalDocumentCookieDescriptor.set.call(this, val);
            } finally {
                inCookieSetter = false;
            }
        }
    });

    // Block HSTS pixel and tracking resources
    const blockTrackingResources = function() {
        // Override image creation to block tracking pixels
        const origImage = window.Image;
        window.Image = function() {
            const img = new origImage();
            const origSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');

            // Only override the src property on this instance
            Object.defineProperty(img, 'src', {
                get: function() {
                    return origSrc.get.call(this);
                },
                set: function(value) {
                    if (typeof value === 'string' && (
                        value.includes('hsts_pixel') ||
                        value.includes('pixel.png') ||
                        value.includes('px.gif'))) {
                        debugLog('Blocked tracking pixel:', value);
                        // Use empty GIF instead
                        return origSrc.set.call(this, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
                    }
                    return origSrc.set.call(this, value);
                }
            });

            return img;
        };
    };

    // Spoof canvas fingerprinting
    const spoofCanvasFingerprinting = function() {
        const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function() {
            // Only modify small canvases likely used for fingerprinting
            if (this.width > 16 || this.height > 16) {
                return origToDataURL.apply(this, arguments);
            }

            // Add subtle noise to small canvases
            const ctx = this.getContext('2d');
            if (ctx) {
                const fp = manageFingerprint('get');
                const seededRandom = createSeededRandom(fp);
                const imgData = ctx.getImageData(0, 0, this.width, this.height);
                const pixels = imgData.data;

                // Add very subtle noise to non-transparent pixels
                for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i+3] > 0) {
                        // Add ±1 to RGB channels
                        pixels[i] = Math.max(0, Math.min(255, pixels[i] + (seededRandom() < 0.5 ? -1 : 1)));
                        pixels[i+1] = Math.max(0, Math.min(255, pixels[i+1] + (seededRandom() < 0.5 ? -1 : 1)));
                        pixels[i+2] = Math.max(0, Math.min(255, pixels[i+2] + (seededRandom() < 0.5 ? -1 : 1)));
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            }

            return origToDataURL.apply(this, arguments);
        };
    };

    // Modern hardware property spoofing with realistic independent values
    const spoofNavigatorProperties = function() {
        const seed = localStorage.getItem('fp');
        const getRandom = createSeededRandom(seed);
        // debugLog('Hardware profile seed:', seed);

        // Helper functions - just one clean function
        const pickFrom = arr => arr[Math.floor(getRandom() * arr.length)];

        // Modern hardware specs (2025 realistic values)
        const specs = {
            // Core hardware
            cores: [4, 6, 8, 10, 12, 16, 24, 32],
            memory: [0.25, 0.5, 1, 2, 4, 8],

            // Modern displays
            screens: [
                {width: 1366, height: 768, colorDepth: 24, pixelDepth: 24},
                {width: 1440, height: 900, colorDepth: 24, pixelDepth: 24},
                {width: 1536, height: 864, colorDepth: 30, pixelDepth: 30},
                {width: 1920, height: 1080, colorDepth: 30, pixelDepth: 30},
                {width: 2560, height: 1440, colorDepth: 30, pixelDepth: 30},
                {width: 2880, height: 1800, colorDepth: 30, pixelDepth: 30},
                {width: 3440, height: 1440, colorDepth: 32, pixelDepth: 32},
                {width: 3840, height: 2160, colorDepth: 32, pixelDepth: 32}
            ],

            // GPUs - modern options
            gpus: [
                // Nvidia
                {renderer: 'NVIDIA GeForce RTX 3050', vendor: 'NVIDIA Corporation'},
                {renderer: 'NVIDIA GeForce RTX 3060', vendor: 'NVIDIA Corporation'},
                {renderer: 'NVIDIA GeForce RTX 3070', vendor: 'NVIDIA Corporation'},
                {renderer: 'NVIDIA GeForce RTX 3080', vendor: 'NVIDIA Corporation'},
                {renderer: 'NVIDIA GeForce RTX 3090', vendor: 'NVIDIA Corporation'},

                {renderer: 'NVIDIA GeForce RTX 4050', vendor: 'NVIDIA Corporation'},
                {renderer: 'NVIDIA GeForce RTX 4060', vendor: 'NVIDIA Corporation'},
                {renderer: 'NVIDIA GeForce RTX 4070', vendor: 'NVIDIA Corporation'},
                {renderer: 'NVIDIA GeForce RTX 4080', vendor: 'NVIDIA Corporation'},
                {renderer: 'NVIDIA GeForce RTX 4090', vendor: 'NVIDIA Corporation'},
                // AMD
                {renderer: 'AMD Radeon RX 7600', vendor: 'AMD'},
                {renderer: 'AMD Radeon RX 7700 XT', vendor: 'AMD'},
                {renderer: 'AMD Radeon RX 7800 XT', vendor: 'AMD'},
                {renderer: 'AMD Radeon RX 7900 XT', vendor: 'AMD'},
                // Intel
                {renderer: 'Intel Arc A580', vendor: 'Intel Inc.'},
                {renderer: 'Intel Arc A750', vendor: 'Intel Inc.'},
                {renderer: 'Intel Arc A770', vendor: 'Intel Inc.'},
                // Integrated
                {renderer: 'Intel Iris Xe Graphics', vendor: 'Intel Inc.'},
                {renderer: 'AMD Radeon Graphics', vendor: 'AMD'},
                {renderer: 'Apple M3 GPU', vendor: 'Apple Inc.'}
            ],

            // WebGL capabilities
            webgl: {
                maxTextureSizes: [8192, 16384, 32768],
                vertexUniforms: [512, 1024, 2048, 4096],
                fragmentUniforms: [256, 512, 1024, 2048],
                maxAnisotropy: [8, 16],
                precisions: ['highp', 'mediump']
            },

            // Audio capabilities
            audio: {
                sampleRates: [44100, 48000, 96000],
                channelCounts: [2, 4, 6, 8],
                fftSizes: [1024, 2048, 4096, 8192]
            },

            // Video capabilities
            video: {
                codecSets: [
                    ['h264', 'vp8', 'vp9'],
                    ['h264', 'vp8', 'vp9', 'av1'],
                    ['h264', 'vp8', 'vp9', 'av1', 'hevc']
                ]
            },

            // Performance characteristics
            performance: {
                jsHeapSizeLimits: [2, 4, 8, 16, 32].map(gb => gb * 1024 * 1024 * 1024),
                timingPrecisions: [10, 5, 1, 0.1]
            },

            // CPU feature sets
            cpu: {
                architectures: ['x86_64', 'arm64']
            },

            // Font capabilities
            fonts: {
                smoothing: ['grayscale', 'subpixel-antialiased']
            },

            // Battery levels
            batteryLevels: [0.25, 0.4, 0.55, 0.7, 0.85, 0.95]
        };

        // Create the profile
        const profile = {
            // Core hardware
            hardwareConcurrency: pickFrom(specs.cores),
            deviceMemory: pickFrom(specs.memory),
            screen: pickFrom(specs.screens),

            // WebGL
            gpu: pickFrom(specs.gpus),
            webgl: {
                maxTextureSize: pickFrom(specs.webgl.maxTextureSizes),
                vertexUniforms: pickFrom(specs.webgl.vertexUniforms),
                fragmentUniforms: pickFrom(specs.webgl.fragmentUniforms),
                maxAnisotropy: pickFrom(specs.webgl.maxAnisotropy),
                precision: pickFrom(specs.webgl.precisions)
            },

            // Audio
            audio: {
                sampleRate: pickFrom(specs.audio.sampleRates),
                channelCount: pickFrom(specs.audio.channelCounts),
                fftSize: pickFrom(specs.audio.fftSizes)
            },

            // Video
            video: {
                supportedCodecs: pickFrom(specs.video.codecSets)
            },

            // Performance
            performance: {
                jsHeapSizeLimit: pickFrom(specs.performance.jsHeapSizeLimits),
                timingPrecision: pickFrom(specs.performance.timingPrecisions)
            },

            // CPU
            cpu: {
                architecture: pickFrom(specs.cpu.architectures)
            },

            // Font
            fonts: {
                smoothing: pickFrom(specs.fonts.smoothing)
            },

            // Battery
            battery: {
                level: pickFrom(specs.batteryLevels) + (getRandom() * 0.1 - 0.05),
                charging: getRandom() > 0.5,
                chargingTime: getRandom() > 0.5 ? Infinity : Math.floor(1800 + getRandom() * 3600),
                dischargingTime: getRandom() > 0.5 ? Math.floor(7200 + getRandom() * 10800) : Infinity
            }
        };

        debugLog('Hardware profile:', profile);

        // Apply navigator properties
        Object.defineProperties(navigator, {
            hardwareConcurrency: { get: () => profile.hardwareConcurrency },
            deviceMemory: { get: () => profile.deviceMemory }
        });

        // Apply screen properties
        if (screen) {
            Object.entries(profile.screen).forEach(([key, val]) => {
                if (screen[key] !== undefined) {
                    // Use enumerable: true to ensure properties are properly recognized
                    Object.defineProperty(screen, key, { get: () => val, enumerable: true });
                }
            });
        }

        // Apply battery API
        if (navigator.getBattery) {
            Object.defineProperty(navigator, 'getBattery', {
                value: () => Promise.resolve({
                    ...profile.battery,
                    addEventListener: () => {}  // Add missing event listener method
                })
            });
        }

        // Spoof WebGL information
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
            const context = originalGetContext.call(this, contextType, contextAttributes);

            if (context && (contextType === 'webgl' || contextType === 'experimental-webgl' ||
                            contextType === 'webgl2' || contextType === 'experimental-webgl2')) {

                // Override getParameter for renderer and vendor strings
                const originalGetParameter = context.getParameter;
                context.getParameter = function(parameter) {
                    // WebGL constants - updated to use context where possible
                    const GL_RENDERER = context.UNMASKED_RENDERER_WEBGL || 0x1F01;
                    const GL_VENDOR = context.UNMASKED_VENDOR_WEBGL || 0x1F00;
                    const GL_MAX_TEXTURE_SIZE = context.MAX_TEXTURE_SIZE || 0x0D33;
                    const GL_MAX_VERTEX_UNIFORM_VECTORS = context.MAX_VERTEX_UNIFORM_VECTORS || 0x8DFB;
                    const GL_MAX_FRAGMENT_UNIFORM_VECTORS = context.MAX_FRAGMENT_UNIFORM_VECTORS || 0x8DFD;
                    const GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF; // Special case, often not on context

                    // Intercept parameters
                    if (parameter === GL_RENDERER) return profile.gpu.renderer;
                    if (parameter === GL_VENDOR) return profile.gpu.vendor;
                    if (parameter === GL_MAX_TEXTURE_SIZE) return profile.webgl.maxTextureSize;
                    if (parameter === GL_MAX_VERTEX_UNIFORM_VECTORS) return profile.webgl.vertexUniforms;
                    if (parameter === GL_MAX_FRAGMENT_UNIFORM_VECTORS) return profile.webgl.fragmentUniforms;
                    if (parameter === GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT) return profile.webgl.maxAnisotropy;

                    return originalGetParameter.call(this, parameter);
                };

                // Override getShaderPrecisionFormat if it exists
                const originalGetShaderPrecisionFormat = context.getShaderPrecisionFormat;
                if (originalGetShaderPrecisionFormat) {
                    context.getShaderPrecisionFormat = function(shaderType, precisionType) {
                        const result = originalGetShaderPrecisionFormat.call(this, shaderType, precisionType);
                        // Save original result if it's null before trying to modify
                        if (!result) return result;
                        if (result) {
                            result.precision = profile.webgl.precision === 'highp' ? 23 : 14;
                        }
                        return result;
                    };
                }
            }

            // Handle font measurement via 2d context
            if (context && contextType === '2d') {
                const origMeasureText = context.measureText;
                if (origMeasureText) {
                    context.measureText = function(text) {
                        const result = origMeasureText.call(this, text);
                        // Add subtle random variations
                        if (result.width) {
                            const variation = getRandom() * 0.01; // 1% max variation
                            result.width *= (1 + variation);
                        }
                        return result;
                    };
                }
            }

            return context;
        };

        // Media capabilities
        if (navigator.mediaCapabilities) {
            const originalDecodingInfo = navigator.mediaCapabilities.decodingInfo;
            navigator.mediaCapabilities.decodingInfo = function(config) {
                // Fix missing video config case
                if (!config || !config.video || !config.video.contentType) {
                    return Promise.resolve({ supported: false, smooth: false, powerEfficient: false });
                }
                const videoType = config.video?.contentType?.split(';')[0]?.split('/')[1]?.split('.')[0];
                return Promise.resolve({
                    supported: profile.video.supportedCodecs.includes(videoType),
                    smooth: getRandom() > 0.2,
                    powerEfficient: getRandom() > 0.3
                });
            };
        }

        debugLog('Hardware spoofing complete');
    };

    // Handle GTM jail
    const handleGTM = function() {
        // Intercept iframe creation
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(document, tagName);

            if (tagName.toLowerCase() === 'iframe') {
                const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src').set;
                const fp = manageFingerprint('get');
                const seededRandom = createSeededRandom(fp);

                Object.defineProperty(element, 'src', {
                    set: function(value) {
                        if (value && value.includes('gtm')) {
                            debugLog('Intercepted GTM iframe:', value);
                            this.id = 'gtm-jail';
                            this.style.display = 'none';
                            this.name = JSON.stringify({
                                subreddit: 'generic',
                                origin: location.origin,
                                url: location.href,
                                userMatching: false,
                                userId: String(Math.floor(seededRandom() * 1000000)),
                                advertiserCategory: null,
                                adsStatus: 'generic',
                            });
                            // Set a blank page instead
                            return originalSrcSetter.call(this, 'about:blank');
                        }
                        return originalSrcSetter.call(this, value);
                    }
                });
            }

            return element;
        };
    };

    // Monitor for navigation events that might happen in a SPA
    let observer = null;
    const observeUrlChanges = function() {
        let lastUrl = location.href;

        // Cleanup existing observer if any
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        // Create a new MutationObserver to watch for DOM changes
        observer = new MutationObserver(function() {
            // Check if URL has changed
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                debugLog('URL changed, reapplying protections');

                // Validate fingerprint
                manageFingerprint('validate');

                // Apply other protections
                performCleanup();

                // Make sure display is updated
                createFingerprintDisplay();
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document, { childList: true, subtree: true });

        // Handle History API for SPA navigation
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            const result = originalPushState.apply(this, arguments);
            // After pushState, check if we need to reapply protections
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                debugLog('pushState navigation detected, reapplying protections');
                manageFingerprint('validate');
                performCleanup();
                createFingerprintDisplay();
            }
            return result;
        };

        history.replaceState = function() {
            const result = originalReplaceState.apply(this, arguments);
            // After replaceState, check if we need to reapply protections
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                debugLog('replaceState navigation detected, reapplying protections');
                manageFingerprint('validate');
                performCleanup();
                createFingerprintDisplay();
            }
            return result;
        };

        // Handle the popstate event for back/forward navigation
        window.addEventListener('popstate', function() {
            debugLog('popstate event detected, reapplying protections');
            manageFingerprint('validate');
            performCleanup();
            createFingerprintDisplay();
        });

        // Clean up the observer when the page is unloaded
        window.addEventListener('unload', function() {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        }, { once: true });
    };

    // Periodic validation with reduced frequency (10 seconds)
    function setupPeriodicValidation() {
        setInterval(function() {
            try {
                // Validate fingerprint
                manageFingerprint('validate');

                // Check if display exists and create if not
                if (!document.getElementById('fingerprint-display')) {
                    createFingerprintDisplay();
                }

                // Check API overrides are still in place
                if (window.r && window.r.utils && typeof window.r.utils.getFingerprint === 'function') {
                    const username = getCurrentUsername();
                    const expectedFP = hashUsername(username);
                    const result = window.r.utils.getFingerprint();

                    if (!result || result.fp !== expectedFP) {
                        debugLog('Fingerprint function override lost, reapplying...');
                        overrideRedditFingerprint();
                    }
                }
            } catch (e) {
                errorLog('Error in periodic validation:', e);
            }
        }, 10000); // Reduced from 5000ms to 10000ms

        debugLog('Periodic validation set up');
    }

    // Create a fake dataLayer for GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push = function() {
        debugLog('Intercepted GTM dataLayer push', arguments);

        // Ensure we return the proper result (length of the dataLayer after push)
        const origLength = window.dataLayer.length;
        for (let i = 0; i < arguments.length; i++) {
            Array.prototype.push.call(window.dataLayer, arguments[i]);
        }

        return arguments.length;
    };

    // DOM-ready safe function to ensure display is created
    function ensureDisplay() {
        function createDisplay() {
            if (document.body) {
                createFingerprintDisplay();
            } else {
                setTimeout(createDisplay, 50);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createDisplay, { once: true });
        } else {
            createDisplay();
        }
    }

    // Check and override fingerprint when Reddit is ready, with a retry limit
    function checkRedditReady(retryCount = 0) {
        if (window.r?.utils) {
            overrideRedditFingerprint();
            return true;
        } else {
            // Limit retries to prevent infinite recursion (50 retries = 5 seconds)
            if (retryCount < 50) {
                setTimeout(() => checkRedditReady(retryCount + 1), 100);
            } else {
                debugLog('Gave up waiting for Reddit utils after 50 attempts');
            }
            return false;
        }
    }

    // Initialize on load
    function initialize() {
        debugLog('Initializing Reddit Privacy Enhancer');

        // Setup all tracking protection features
        blockTrackingResources();
        spoofCanvasFingerprinting();
        spoofNavigatorProperties();
        handleGTM();

        // Set up event listeners with proper DOM-ready checks
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                debugLog('DOMContentLoaded event started');
                ensureDisplay();
                checkRedditReady();
                observeUrlChanges();
                performCleanup();
            }, { once: true });
        } else {
            // Handle case where DOM is already loaded
            debugLog('Document already loaded');
            ensureDisplay();
            checkRedditReady();
            observeUrlChanges();
            performCleanup();
        }

        // Setup final checks when everything is loaded
        window.addEventListener('load', function() {
            debugLog('Window load event');

            // Override Reddit's analytics functions
            if (window.r?.analytics) {
                for (const key in window.r.analytics) {
                    if (typeof window.r.analytics[key] === 'function') {
                        const originalFn = window.r.analytics[key];
                        window.r.analytics[key] = function() {
                            debugLog('Blocked analytics call:', key);
                            // Return appropriate value based on original function
                            return typeof originalFn() === 'undefined' ? undefined : null;
                        };
                    }
                }

                // Ensure breadcrumbs object exists to prevent errors
                if (!window.r?.analytics?.breadcrumbs) {
                    window.r.analytics.breadcrumbs = {};
                }
                window.r.analytics.breadcrumbs.lastClickFullname = function() { return null; };
            }

            // Check if we need to override fingerprint functions
            if (!window.r?.utils?.getFingerprint || typeof window.r.utils.getFingerprint !== 'function') {
                overrideRedditFingerprint();
            }

            setupPeriodicValidation();

            // Measure script execution time at this point
            const loadTimeEnd = performance.now();
            debugLog('🖥️ Page fully loaded: Script running for ' + (loadTimeEnd - scriptStartTime).toFixed(0) + ' ms');
        }, { once: true });
    }

    // Start the script
    initialize();

    // Measure setup time
    const setupEndTime = performance.now();
    debugLog('🚀 Script ready: Basic setup completed in ' + (setupEndTime - scriptStartTime).toFixed(0) + ' ms');

    // Add a final measurement for the complete script execution
    window.addEventListener('DOMContentLoaded', function() {
        const domContentLoadedTime = performance.now();
        debugLog('📄 DOMContentLoaded event finished: Script running for ' + (domContentLoadedTime - scriptStartTime).toFixed(0) + ' ms');
    }, { once: true });

})();