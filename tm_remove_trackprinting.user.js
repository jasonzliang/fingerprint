// ==UserScript==
// @name         Reddit Privacy Enhancer with Fingerprint Display
// @namespace    http://tampermonkey.net/
// @version      1.7.5
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

(function () {
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
            // Method 1: From r.config.logged
            if (window.r?.config?.logged) {
                const username = window.r.config.logged;
                // Save the username for future use
                localStorage.setItem("current-user", username);
                return username;
            }

            // Method 2: From sessionStorage
            if (sessionStorage.getItem("current-user")) {
                const username = sessionStorage.getItem("current-user");
                localStorage.setItem("current-user", username);
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
                            const username = href.split('/user/')[1]?.split('/')?.[0];
                            if (username && username !== 'undefined' && username !== 'null') {
                                localStorage.setItem("current-user", username);
                                return username;
                            }
                        }

                        // Or try from text content if it looks like a username
                        const text = el?.textContent?.trim();
                        if (text && !text.includes(' ') && text.length > 1 && text.length < 30) {
                            localStorage.setItem("current-user", text);
                            return text;
                        }
                    }
                }
            }

            // Method 4: Last resort - check our cached username in localStorage
            const storedUsername = localStorage.getItem("current-user");
            if (storedUsername && storedUsername !== 'anonymous_user') {
                debugLog('Using cached username from localStorage:', storedUsername);
                return storedUsername;
            }

            // Fallback: Return default anonymous value
            debugLog('Cannot find username, using anonymous_user');
            return 'anonymous_user';
        } catch (e) {
            errorLog('Error in finding username:', e);
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

            // Convert state to hexadecimal string and ensure exactly 32 characters
            return state.map(num => (num < 16 ? '0' : '') + num.toString(16)).join('').substring(0, 32);
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
        return function () {
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

                    // Set timestamp if it doesn't exist
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
            if (!document.body) return false;

            // Get current fingerprint and handle null/undefined check
            const fingerprint = manageFingerprint('get');
            if (!fingerprint) return false;

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
                bottom: '0px',
                right: '0px',
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: '#fff',
                padding: '5px 8px',
                borderTopLeftRadius: '5px',
                fontSize: '11px',
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
            displayEl.addEventListener('click', function () {
                expanded = !expanded;
                this.textContent = expanded ?
                    `Fingerprint: ${this.getAttribute('data-fp')}` :
                    `FP: ${this.getAttribute('data-fp').substring(0, 8)}...`;
            });

            // Add to document
            document.body.appendChild(displayEl);
            debugLog("Current Reddit fingerprint:", fingerprint);
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
                const username = getCurrentUsername();
                const fingerprint = manageFingerprint('set', username);

                // Override Reddit's getFingerprint method
                window.r.utils.getFingerprint = function () {
                    // Simplified timestamp handling
                    let timestamp;
                    try {
                        const storedTimestamp = localStorage.getItem('fp_timestamp');
                        timestamp = storedTimestamp ? JSON.parse(storedTimestamp) : Date.now();
                    } catch (e) {
                        timestamp = Date.now();
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
                manageFingerprint('validate');
                createFingerprintDisplay();
                debugLog('Reddit fingerprint override applied');
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
            const fp = localStorage.getItem('fp');
            const fpTimestamp = localStorage.getItem('fp_timestamp');

            // Collect keys to remove
            const trackingKeyPatterns = ['_id', 'loid', 'token', 'track', 'session'];
            const keysToRemove = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key !== 'fp' && key !== 'fp_timestamp' &&
                    trackingKeyPatterns.some(pattern => key.includes(pattern))) {
                    keysToRemove.push(key);
                }
            }

            // Remove the collected keys
            keysToRemove.forEach(key => {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    debugLog('Error removing key:', key, e);
                }
            });

            // Restore fingerprint values if they were removed
            if (fp && !localStorage.getItem('fp')) localStorage.setItem('fp', fp);
            if (fpTimestamp && !localStorage.getItem('fp_timestamp')) localStorage.setItem('fp_timestamp', fpTimestamp);

            debugLog('localStorage cleanup completed, removed ' + keysToRemove.length + ' keys');
        } catch (e) {
            errorLog('Error cleaning localStorage:', e);
        }
    }

    // Intercept localStorage.setItem
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
        // For fingerprint, check if it matches our expected value
        if (key === 'fp') {
            const expectedFP = hashUsername(getCurrentUsername());

            // Extract actual fingerprint if it's a JSON string
            let actualValue = value;
            try {
                if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                    actualValue = JSON.parse(value);
                }
            } catch (e) {}

            // If value doesn't match our expected fingerprint, use ours instead
            if (actualValue !== expectedFP) {
                value = JSON.stringify(expectedFP);
            }
        }

        // Format timestamp as JSON if needed
        if (key === 'fp_timestamp' && value) {
            try {
                const timestamp = parseInt(value);
                if (!isNaN(timestamp)) {
                    value = JSON.stringify(timestamp);
                }
            } catch (e) {}
        }

        // Block known tracking keys
        const trackingKeyPatterns = ['_id', 'loid', 'token', 'track', 'session'];
        if (key !== 'fp' && key !== 'fp_timestamp' &&
            trackingKeyPatterns.some(pattern => key.includes(pattern))) {
            debugLog('Blocked tracking key:', key);
            return;
        }

        // Call original function
        return originalSetItem.call(this, key, value);
    };

    // Safe cookie handling without recursion
    const originalDocumentCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    let inCookieSetter = false;

    Object.defineProperty(document, 'cookie', {
        get: function () {
            const cookies = originalDocumentCookieDescriptor.get.call(this);
            // Filter out tracking cookies without causing recursion
            return cookies.replace(/reddit_session=[^;]+;?/g, '')
                .replace(/loid=[^;]+;?/g, '')
                .replace(/rabt=[^;]+;?/g, '')
                .replace(/user_tracking=[^;]+;?/g, '');
        },
        set: function (val) {
            // Avoid recursion by using a guard flag
            if (inCookieSetter) return;
            inCookieSetter = true;

            try {
                // Block tracking cookies
                const trackingCookies = ['reddit_session', 'loid', 'rabt', 'user_tracking'];
                if (val && trackingCookies.some(cookie => val.includes(cookie))) {
                    debugLog('Blocked tracking cookie:', val);
                    return;
                }

                return originalDocumentCookieDescriptor.set.call(this, val);
            } finally {
                inCookieSetter = false;
            }
        }
    });

    // Block HSTS pixel and tracking resources
    const blockTrackingResources = function () {
        // Override image creation to block tracking pixels
        const origImage = window.Image;
        window.Image = function () {
            const img = new origImage();
            const origSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');

            // Only override the src property on this instance
            Object.defineProperty(img, 'src', {
                get: function () {
                    return origSrc.get.call(this);
                },
                set: function (value) {
                    const trackingPixels = ['hsts_pixel', 'pixel.png', 'px.gif'];
                    if (typeof value === 'string' && trackingPixels.some(pixel => value.includes(pixel))) {
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
    const spoofCanvasFingerprinting = function () {
        // debugLog("Canvas seed:", localStorage.getItem('fp'));
        const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function () {
            if (this.width > 16 || this.height > 16) {
                // This is likely a visible canvas (not fingerprinting)
                return origToDataURL.apply(this, arguments);
            }

            // Small invisible canvases are likely for fingerprinting
            const ctx = this.getContext('2d');
            if (ctx) {
                const imgData = ctx.getImageData(0, 0, this.width, this.height);
                const pixels = imgData.data;
                const seededRandom = createSeededRandom(localStorage.getItem('fp'));

                // Add very subtle noise that won't be visually detectable
                for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i + 3] > 0) { // Only modify non-transparent pixels
                        // Add ±1 to RGB channels
                        pixels[i] = Math.max(0, Math.min(255, pixels[i] + (seededRandom() < 0.5 ? -1 : 1)));
                        pixels[i + 1] = Math.max(0, Math.min(255, pixels[i + 1] + (seededRandom() < 0.5 ? -1 : 1)));
                        pixels[i + 2] = Math.max(0, Math.min(255, pixels[i + 2] + (seededRandom() < 0.5 ? -1 : 1)));
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            }

            return origToDataURL.apply(this, arguments);
        };
    };

    // Modern hardware property spoofing with realistic independent values
    const spoofNavigatorProperties = function () {
        const seed = localStorage.getItem('fp');
        const getRandom = createSeededRandom(seed);
        debugLog('Hardware profile seed:', seed);

        // Helper function
        const pickFrom = arr => arr[Math.floor(getRandom() * arr.length)];

        // Modern hardware specs (2025 realistic values)
        const specs = {
            // Core hardware - simplified
            cores: [4, 6, 8, 10, 12, 16, 24, 32],
            memory: [0.25, 0.5, 1, 2, 4, 8],

            // Modern displays
            screens: [{
                    width: 1366,
                    height: 768,
                    colorDepth: 24,
                    pixelDepth: 24
                },
                {
                    width: 1440,
                    height: 900,
                    colorDepth: 24,
                    pixelDepth: 24
                },
                {
                    width: 1536,
                    height: 864,
                    colorDepth: 30,
                    pixelDepth: 30
                },
                {
                    width: 1920,
                    height: 1080,
                    colorDepth: 30,
                    pixelDepth: 30
                },
                {
                    width: 2560,
                    height: 1440,
                    colorDepth: 30,
                    pixelDepth: 30
                },
                {
                    width: 2880,
                    height: 1800,
                    colorDepth: 30,
                    pixelDepth: 30
                },
                {
                    width: 3440,
                    height: 1440,
                    colorDepth: 32,
                    pixelDepth: 32
                },
                {
                    width: 3840,
                    height: 2160,
                    colorDepth: 32,
                    pixelDepth: 32
                }
            ],

            // GPUs - modern options
            gpus: [
                // Nvidia
                {
                    renderer: 'NVIDIA GeForce RTX 3050',
                    vendor: 'NVIDIA Corporation'
                },
                {
                    renderer: 'NVIDIA GeForce RTX 3060',
                    vendor: 'NVIDIA Corporation'
                },
                {
                    renderer: 'NVIDIA GeForce RTX 3070',
                    vendor: 'NVIDIA Corporation'
                },
                {
                    renderer: 'NVIDIA GeForce RTX 3080',
                    vendor: 'NVIDIA Corporation'
                },
                {
                    renderer: 'NVIDIA GeForce RTX 3090',
                    vendor: 'NVIDIA Corporation'
                },

                {
                    renderer: 'NVIDIA GeForce RTX 4050',
                    vendor: 'NVIDIA Corporation'
                },
                {
                    renderer: 'NVIDIA GeForce RTX 4060',
                    vendor: 'NVIDIA Corporation'
                },
                {
                    renderer: 'NVIDIA GeForce RTX 4070',
                    vendor: 'NVIDIA Corporation'
                },
                {
                    renderer: 'NVIDIA GeForce RTX 4080',
                    vendor: 'NVIDIA Corporation'
                },
                {
                    renderer: 'NVIDIA GeForce RTX 4090',
                    vendor: 'NVIDIA Corporation'
                },
                // AMD
                {
                    renderer: 'AMD Radeon RX 7600',
                    vendor: 'AMD'
                },
                {
                    renderer: 'AMD Radeon RX 7700 XT',
                    vendor: 'AMD'
                },
                {
                    renderer: 'AMD Radeon RX 7800 XT',
                    vendor: 'AMD'
                },
                {
                    renderer: 'AMD Radeon RX 7900 XT',
                    vendor: 'AMD'
                },
                // Intel
                {
                    renderer: 'Intel Arc A580',
                    vendor: 'Intel Inc.'
                },
                {
                    renderer: 'Intel Arc A750',
                    vendor: 'Intel Inc.'
                },
                {
                    renderer: 'Intel Arc A770',
                    vendor: 'Intel Inc.'
                },
                // Integrated
                {
                    renderer: 'Intel Iris Xe Graphics',
                    vendor: 'Intel Inc.'
                },
                {
                    renderer: 'AMD Radeon Graphics',
                    vendor: 'AMD'
                },
                {
                    renderer: 'Apple M3 GPU',
                    vendor: 'Apple Inc.'
                }
            ],

            // WebGL capabilities - simplified
            webgl: {
                maxTextureSizes: [8192, 16384, 32768],
                vertexUniforms: [1024, 2048, 4096],
                fragmentUniforms: [512, 1024, 2048],
                maxAnisotropy: [8, 16],
                precisions: ['highp', 'mediump']
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
            gpu: pickFrom(specs.gpus),
            webgl: {
                maxTextureSize: pickFrom(specs.webgl.maxTextureSizes),
                vertexUniforms: pickFrom(specs.webgl.vertexUniforms),
                fragmentUniforms: pickFrom(specs.webgl.fragmentUniforms),
                maxAnisotropy: pickFrom(specs.webgl.maxAnisotropy),
                precision: pickFrom(specs.webgl.precisions)
            },
            battery: {
                level: pickFrom(specs.batteryLevels) + (getRandom() * 0.1 - 0.05),
                charging: getRandom() > 0.5,
                chargingTime: getRandom() > 0.5 ? Infinity : Math.floor(1800 + getRandom() * 3600),
                dischargingTime: getRandom() > 0.5 ? Math.floor(7200 + getRandom() * 10800) : Infinity
            }
        };

        debugLog('Hardware profile generated', profile);

        // Apply navigator properties
        Object.defineProperties(navigator, {
            hardwareConcurrency: {
                get: () => profile.hardwareConcurrency
            },
            deviceMemory: {
                get: () => profile.deviceMemory
            }
        });

        // Apply screen properties
        if (screen) {
            Object.entries(profile.screen).forEach(([key, val]) => {
                if (screen[key] !== undefined) {
                    Object.defineProperty(screen, key, {
                        get: () => val,
                        enumerable: true
                    });
                }
            });
        }

        // Apply battery API
        if (navigator.getBattery) {
            Object.defineProperty(navigator, 'getBattery', {
                value: () => Promise.resolve({
                    ...profile.battery,
                    addEventListener: () => {}
                })
            });
        }

        // Spoof WebGL information
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (contextType, contextAttributes) {
            const context = originalGetContext.call(this, contextType, contextAttributes);

            if (context && (contextType === 'webgl' || contextType === 'experimental-webgl' ||
                    contextType === 'webgl2' || contextType === 'experimental-webgl2')) {

                // Override getParameter for renderer and vendor strings
                const originalGetParameter = context.getParameter;
                context.getParameter = function (parameter) {
                    // WebGL constants - updated to use context where possible
                    const GL_RENDERER = context.UNMASKED_RENDERER_WEBGL || 0x1F01;
                    const GL_VENDOR = context.UNMASKED_VENDOR_WEBGL || 0x1F00;
                    const GL_MAX_TEXTURE_SIZE = context.MAX_TEXTURE_SIZE || 0x0D33;
                    const GL_MAX_VERTEX_UNIFORM_VECTORS = context.MAX_VERTEX_UNIFORM_VECTORS || 0x8DFB;
                    const GL_MAX_FRAGMENT_UNIFORM_VECTORS = context.MAX_FRAGMENT_UNIFORM_VECTORS || 0x8DFD;
                    const GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF; // Special case

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
                if (context.getShaderPrecisionFormat) {
                    const originalGetShaderPrecisionFormat = context.getShaderPrecisionFormat;
                    context.getShaderPrecisionFormat = function (shaderType, precisionType) {
                        const result = originalGetShaderPrecisionFormat.call(this, shaderType, precisionType);
                        if (result) {
                            result.precision = profile.webgl.precision === 'highp' ? 23 : 14;
                        }
                        return result;
                    };
                }
            }

            return context;
        };
    };

    // Handle GTM jail
    const handleGTM = function () {
        // Intercept iframe creation
        const originalCreateElement = document.createElement;
        document.createElement = function (tagName) {
            const element = originalCreateElement.call(document, tagName);

            if (tagName.toLowerCase() === 'iframe') {
                const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src').set;
                const fp = manageFingerprint('get');
                const seededRandom = createSeededRandom(fp);

                Object.defineProperty(element, 'src', {
                    set: function (value) {
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
    const observeUrlChanges = function () {
        let lastUrl = location.href;

        // Cleanup existing observer if any
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        // Create a new MutationObserver to watch for DOM changes
        observer = new MutationObserver(function () {
            // Check if URL has changed
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                debugLog('URL changed, reapplying protections');

                // Apply protections after URL change
                manageFingerprint('validate');
                performCleanup();
                createFingerprintDisplay();
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document, {
            childList: true,
            subtree: true
        });

        // Handle History API for SPA navigation
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        // Common function for handling state changes
        const handleStateChange = function () {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                debugLog('Navigation detected, reapplying protections');
                manageFingerprint('validate');
                performCleanup();
                createFingerprintDisplay();
            }
        };

        history.pushState = function () {
            const result = originalPushState.apply(this, arguments);
            handleStateChange();
            return result;
        };

        history.replaceState = function () {
            const result = originalReplaceState.apply(this, arguments);
            handleStateChange();
            return result;
        };

        // Handle the popstate event for back/forward navigation
        window.addEventListener('popstate', handleStateChange);

        // Clean up the observer when the page is unloaded
        window.addEventListener('unload', function () {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        }, {
            once: true
        });
    };

    // Periodic validation with reduced frequency (10 seconds)
    function setupPeriodicValidation() {
        setInterval(function () {
            try {
                // Validate fingerprint
                manageFingerprint('validate');

                // Check if display exists and create if not
                if (!document.getElementById('fingerprint-display')) {
                    createFingerprintDisplay();
                }

                // Check API overrides are still in place
                if (window.r?.utils?.getFingerprint) {
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
        }, 5000);

        debugLog('Periodic validation set up');
    }

    // Create a fake dataLayer for GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push = function () {
        debugLog('Intercepted GTM dataLayer push', arguments);

        // Ensure we return the proper result (length of the dataLayer after push)
        const origLength = window.dataLayer.length;
        for (let i = 0; i < arguments.length; i++) {
            Array.prototype.push.call(window.dataLayer, arguments[i]);
        }

        return origLength + arguments.length;
    };

    // DOM-ready safe function to ensure display is created
    function ensureDisplay() {
        // Validate fingerprint
        manageFingerprint('validate');

        if (document.body) {
            createFingerprintDisplay();
        } else {
            document.addEventListener('DOMContentLoaded', createFingerprintDisplay, {
                once: true
            });
        }
    }

    // Check and override fingerprint when Reddit is ready, with a retry limit
    function checkRedditReady(retryCount = 0) {
        if (window.r?.utils) {
            overrideRedditFingerprint();
            return true;
        } else if (retryCount < 50) {
            setTimeout(() => checkRedditReady(retryCount + 1), 200);
            return false;
        } else {
            debugLog('Gave up waiting for Reddit utils after 50 attempts');
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

        // Initial fingerprint setup
        const username = getCurrentUsername();
        manageFingerprint('set', username);

        // Set up initialization based on document ready state
        const onDocReady = function () {
            debugLog('DOM ready, setting up protections');
            ensureDisplay();
            checkRedditReady();
            observeUrlChanges();
            performCleanup();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDocReady, {
                once: true
            });
        } else {
            onDocReady();
        }

        // Setup final checks when everything is loaded
        window.addEventListener('load', function () {
            debugLog('Window load event');

            // Override Reddit's analytics functions
            if (window.r?.analytics) {
                for (const key in window.r.analytics) {
                    if (typeof window.r.analytics[key] === 'function') {
                        const originalFn = window.r.analytics[key];
                        window.r.analytics[key] = function () {
                            debugLog('Blocked analytics call:', key);
                            return typeof originalFn() === 'undefined' ? undefined : null;
                        };
                    }
                }

                // Ensure breadcrumbs object exists to prevent errors
                if (!window.r?.analytics?.breadcrumbs) {
                    window.r.analytics.breadcrumbs = {};
                }
                window.r.analytics.breadcrumbs.lastClickFullname = function () {
                    return null;
                };
            }

            // Check if we need to override fingerprint functions
            if (!window.r?.utils?.getFingerprint || typeof window.r.utils.getFingerprint !== 'function') {
                overrideRedditFingerprint();
            }

            setupPeriodicValidation();

            // Measure script execution time at this point
            const loadTimeEnd = performance.now();
            debugLog('🖥️ Page fully loaded: Script running for ' + (loadTimeEnd - scriptStartTime).toFixed(0) + ' ms');
        }, {
            once: true
        });
    }

    // Start the script
    initialize();

    // Measure setup time
    const setupEndTime = performance.now();
    debugLog('🚀 Script ready: Basic setup completed in ' + (setupEndTime - scriptStartTime).toFixed(0) + ' ms');

    // Add a final measurement for the complete script execution
    window.addEventListener('DOMContentLoaded', function () {
        const domContentLoadedTime = performance.now();
        debugLog('📄 DOMContentLoaded event finished: Script running for ' + (domContentLoadedTime - scriptStartTime).toFixed(0) + ' ms');
    }, {
        once: true
    });

})();