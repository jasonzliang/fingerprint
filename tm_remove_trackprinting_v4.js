// ==UserScript==
// @name         Reddit Privacy Enhancer with Fixed Fingerprint Display
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Block fingerprinting and tracking on Reddit with consistent fingerprint ID and display
// @author       You
// @match        https://*.reddit.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Debug flag - set to true to see detailed logs
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

    // Simple string hash function that creates a 32-character hex string
    function hashUsername(username) {
        try {
            // If no username, use a default string
            if (!username || username === '') {
                username = 'anonymous_user';
            }

            // Generate hash - using a simple implementation of djb2
            let hash = 5381;
            for (let i = 0; i < username.length; i++) {
                hash = ((hash << 5) + hash) + username.charCodeAt(i);
            }

            // Convert to positive number
            hash = Math.abs(hash);

            // Convert the number to a hex string
            let hexHash = hash.toString(16);

            // Ensure it's at least 8 characters
            while (hexHash.length < 8) {
                hexHash = '0' + hexHash;
            }

            // Repeat the hash to reach 32 characters
            while (hexHash.length < 32) {
                hexHash = hexHash + hexHash;
            }

            // Truncate to exactly 32 characters
            return hexHash.substring(0, 32);
        } catch (e) {
            errorLog('Error in hashUsername:', e);
            // Fallback to a random but consistent fingerprint
            return '1234567890abcdef1234567890abcdef';
        }
    }

    // Set fingerprint in localStorage - only call this when really needed
    function setFingerprint(username) {
        try {
            // Generate fingerprint
            const fingerprint = hashUsername(username || 'anonymous_user');

            // Check if we already have this fingerprint stored
            let currentFp = null;
            try {
                const storedFp = localStorage.getItem('fp');
                currentFp = storedFp ? JSON.parse(storedFp) : null;
            } catch (e) {
                // If parsing fails, treat as if it's not set
            }

            // Only set if it doesn't exist or doesn't match (avoid unnecessary writes)
            if (currentFp !== fingerprint) {
                debugLog('Setting fingerprint:', fingerprint, 'for username:', username);

                // Properly format the fingerprint as JSON string
                localStorage.setItem('fp', JSON.stringify(fingerprint));

                // Set or maintain timestamp
                if (!localStorage.getItem('fp_timestamp')) {
                    localStorage.setItem('fp_timestamp', JSON.stringify(Date.now()));
                }
            }

            return fingerprint;
        } catch (e) {
            errorLog('Failed to set fingerprint:', e);
            return null;
        }
    }

    // Initialize fingerprint just once at the beginning
    const initialFingerprint = setFingerprint('anonymous_user');
    debugLog('Initial fingerprint set:', initialFingerprint);

    // Get current fingerprint without setting it
    function getCurrentFingerprint() {
        try {
            // Try to get from localStorage first
            let storedFp;
            try {
                const rawStored = localStorage.getItem('fp');
                storedFp = rawStored ? JSON.parse(rawStored) : null;
            } catch (e) {
                // If parsing fails, use the raw value
                storedFp = localStorage.getItem('fp');
            }

            // If we have a stored fingerprint, use it
            if (storedFp) {
                return storedFp;
            }

            // Otherwise, calculate based on username (but don't store it yet)
            const username = window.r?.config?.logged || 'anonymous_user';
            return hashUsername(username);
        } catch (e) {
            errorLog('Error getting current fingerprint:', e);
            return initialFingerprint;
        }
    }

    // Create/update the display element
    function createFingerprintDisplay() {
        try {
            // Make sure body exists
            if (!document.body) {
                debugLog('Document body not ready, will try again...');
                return false;
            }

            // Get current fingerprint
            const fingerprint = getCurrentFingerprint();

            // Check if display already exists
            let displayEl = document.getElementById('fingerprint-display');

            if (displayEl) {
                // Update existing display
                displayEl.textContent = `FP: ${fingerprint.substring(0, 8)}...`;
                displayEl.setAttribute('data-fp', fingerprint);
                debugLog('Updated fingerprint display');
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
            debugLog('Created fingerprint display');

            // Add a debug button
            const debugBtn = document.createElement('button');
            debugBtn.textContent = 'LS';
            Object.assign(debugBtn.style, {
                marginLeft: '8px',
                padding: '2px 5px',
                fontSize: '10px',
                backgroundColor: '#444',
                border: 'none',
                borderRadius: '3px',
                color: '#fff',
                cursor: 'pointer'
            });

            // Debug button click handler
            debugBtn.addEventListener('click', function(e) {
                e.stopPropagation();

                // Log all localStorage to console
                console.group('Reddit Privacy - LocalStorage');
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    console.log(`${key}: ${localStorage.getItem(key)}`);
                }
                console.groupEnd();

                // Alert current fingerprint (parsed if needed)
                try {
                    const storedFp = localStorage.getItem('fp');
                    const parsedFp = storedFp ? JSON.parse(storedFp) : 'Not found!';
                    alert(`Fingerprint: ${parsedFp}`);
                } catch (e) {
                    alert(`Fingerprint (raw): ${localStorage.getItem('fp') || 'Not found!'}`);
                }
            });

            // Append debug button
            displayEl.appendChild(debugBtn);
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
                const username = window.r?.config?.logged || 'anonymous_user';

                // Call setFingerprint only when we have the real username
                // This is one of the few places where we actually need to call it
                const fingerprint = setFingerprint(username);

                // Override Reddit's getFingerprint method
                window.r.utils.getFingerprint = function() {
                    // Parse timestamp from localStorage properly
                    let timestamp;
                    try {
                        const storedTimestamp = localStorage.getItem('fp_timestamp');
                        timestamp = storedTimestamp ? JSON.parse(storedTimestamp) : Date.now();
                    } catch (e) {
                        timestamp = Date.now();
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

                debugLog('Reddit fingerprint function overridden');

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

    // Validate and fix the fingerprint if needed
    function validateFingerprint() {
        try {
            // Get stored fingerprint and parse it if needed
            let storedFp;
            try {
                const rawStored = localStorage.getItem('fp');
                storedFp = rawStored ? JSON.parse(rawStored) : null;
            } catch (e) {
                // If parsing fails, use the raw value
                storedFp = localStorage.getItem('fp');
            }

            const username = window.r?.config?.logged || 'anonymous_user';
            const expectedFp = hashUsername(username);

            // Check if fingerprint is missing or doesn't match what we expect
            if (!storedFp || storedFp !== expectedFp) {
                debugLog('Fingerprint validation failed, fixing...');
                debugLog('Current:', storedFp);
                debugLog('Expected:', expectedFp);

                // Fix the fingerprint in localStorage (as JSON string)
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
        } catch (e) {
            errorLog('Error in validateFingerprint:', e);
            return false;
        }
    }

    // Intercept localStorage.setItem
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // For fingerprint, check if it matches our expected value
        if (key === 'fp') {
            const username = window.r?.config?.logged || 'anonymous_user';
            const expectedFP = hashUsername(username);

            // Extract actual fingerprint if it's a JSON string
            let actualValue = value;
            try {
                if (value.startsWith('"') && value.endsWith('"')) {
                    actualValue = JSON.parse(value);
                }
            } catch (e) {}

            // If value doesn't match our expected fingerprint, use ours instead
            if (actualValue !== expectedFP) {
                debugLog('Intercepted fp change:', actualValue, '→', expectedFP);
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
    let lastCookieValue = '';

    Object.defineProperty(document, 'cookie', {
        get: function() {
            const cookies = originalDocumentCookieDescriptor.get.call(this);
            // Filter out tracking cookies without causing recursion
            return cookies.replace(/reddit_session=[^;]+;?/g, '')
                          .replace(/loid=[^;]+;?/g, '')
                          .replace(/rabt=[^;]+;?/g, '')
                          .replace(/user_tracking=[^;]+;?/g, ''); // Additional tracking cookie
        },
        set: function(val) {
            // Avoid recursion by checking if this is the same value
            if (val === lastCookieValue) return;
            lastCookieValue = val;

            if (val.includes('reddit_session') ||
                val.includes('loid') ||
                val.includes('rabt') ||
                val.includes('user_tracking')) {
                debugLog('Sanitized cookie:', val);
                return; // Don't set tracking cookies
            }

            return originalDocumentCookieDescriptor.set.call(this, val);
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

    // Spoof canvas fingerprinting carefully
    const spoofCanvasFingerprinting = function() {
        const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function() {
            if (this.width > 16 || this.height > 16) {
                // This is likely a visible canvas (not fingerprinting)
                return origToDataURL.apply(this, arguments);
            }

            // Small invisible canvases are likely for fingerprinting
            const ctx = this.getContext('2d');
            if (ctx) {
                const imgData = ctx.getImageData(0, 0, this.width, this.height);
                const pixels = imgData.data;

                // Add very subtle noise that won't be visually detectable
                for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i+3] > 0) { // Only modify non-transparent pixels
                        // Add ±1 to RGB channels
                        pixels[i] = Math.max(0, Math.min(255, pixels[i] + (Math.random() < 0.5 ? -1 : 1)));
                        pixels[i+1] = Math.max(0, Math.min(255, pixels[i+1] + (Math.random() < 0.5 ? -1 : 1)));
                        pixels[i+2] = Math.max(0, Math.min(255, pixels[i+2] + (Math.random() < 0.5 ? -1 : 1)));
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            }

            return origToDataURL.apply(this, arguments);
        };
    };

    // Safely spoof navigator properties without breaking functionality
    const spoofNavigatorProperties = function() {
        // Only modify properties commonly used for fingerprinting
        const propsToSpoof = {
            hardwareConcurrency: 4,
            deviceMemory: 8
        };

        for (const prop in propsToSpoof) {
            if (navigator[prop] !== undefined) {
                Object.defineProperty(navigator, prop, {
                    get: function() { return propsToSpoof[prop]; }
                });
            }
        }
    };

    // Handle GTM jail properly
    const handleGTM = function() {
        // Intercept iframe creation
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(document, tagName);

            if (tagName.toLowerCase() === 'iframe') {
                const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src').set;

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
                                userId: Math.floor(Math.random() * 1000000),
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
    const observeUrlChanges = function() {
        let lastUrl = location.href;

        // Create a new MutationObserver to watch for DOM changes
        const observer = new MutationObserver(function(mutations) {
            // Check if URL has changed
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                debugLog('URL changed, reapplying protections');

                // Use validateFingerprint instead of directly setting
                validateFingerprint();

                // Apply other protections
                performCleanup();

                // Make sure display is updated
                createFingerprintDisplay();
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document, { childList: true, subtree: true });

        // Also handle History API for SPA navigation
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            const result = originalPushState.apply(this, arguments);
            // After pushState, check if we need to reapply protections
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                debugLog('pushState navigation detected, reapplying protections');
                validateFingerprint();
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
                validateFingerprint();
                performCleanup();
                createFingerprintDisplay();
            }
            return result;
        };

        // Handle the popstate event for back/forward navigation
        window.addEventListener('popstate', function() {
            debugLog('popstate event detected, reapplying protections');
            validateFingerprint();
            performCleanup();
            createFingerprintDisplay();
        });
    };

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

    // Periodic validation of fingerprint
    function setupPeriodicValidation() {
        // Check fingerprint every second
        setInterval(function() {
            try {
                // Validate fingerprint
                validateFingerprint();

                // Also check if display exists and create if not
                if (!document.getElementById('fingerprint-display')) {
                    createFingerprintDisplay();
                }

                // Also check API overrides are still in place
                if (window.r && window.r.utils && typeof window.r.utils.getFingerprint === 'function') {
                    const username = window.r?.config?.logged || 'anonymous_user';
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
    window.dataLayer.push = function() {
        debugLog('Intercepted GTM dataLayer push');
        return arguments.length;
    };

    // Ensure the display is created after DOM is ready
    function ensureDisplay() {
        // If document is still loading, wait for DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                createFingerprintDisplay();
            });
        } else {
            // Otherwise create it now
            createFingerprintDisplay();
        }
    }

    // Check and override fingerprint when Reddit is ready
    function checkRedditReady() {
        if (window.r && window.r.utils) {
            overrideRedditFingerprint();
            return true;
        } else {
            setTimeout(checkRedditReady, 100);
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

        // Set up event listeners
        document.addEventListener('DOMContentLoaded', function() {
            debugLog('DOMContentLoaded event');
            ensureDisplay();
            checkRedditReady();
            observeUrlChanges();
            performCleanup();
        });

        // Also handle case where DOM is already loaded
        if (document.readyState !== 'loading') {
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
            if (window.r && window.r.analytics) {
                for (const key in window.r.analytics) {
                    if (typeof window.r.analytics[key] === 'function') {
                        window.r.analytics[key] = function() { return null; };
                    }
                }

                // Ensure breadcrumbs object exists to prevent errors
                if (!window.r.analytics.breadcrumbs) {
                    window.r.analytics.breadcrumbs = {};
                }
                window.r.analytics.breadcrumbs.lastClickFullname = function() { return null; };
            }

            // Check if we need to override fingerprint functions
            if (!window.r?.utils?.getFingerprint || typeof window.r.utils.getFingerprint !== 'function') {
                overrideRedditFingerprint();
            }

            setupPeriodicValidation();
        });
    }

    // Start the script
    initialize();
})();