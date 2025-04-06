// ==UserScript==
// @name         Reddit Privacy Enhancer with Fixed Fingerprint
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Block fingerprinting on Reddit with consistent fingerprint ID
// @author       You
// @match        https://*.reddit.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Simple string hash function that creates a 32-character hex string
    function hashUsername(username) {
        // If no username, use a default string
        if (!username || username === '') {
            username = 'anonymous_user';
        }
        // Generate hash - using a simple implementation of djb2
        let hash = 5381;
        for (let i = 0; i < username.length; i++) {
            hash = ((hash << 5) + hash) + username.charCodeAt(i);
        }
        // Convert the number to a 32-character hex string (padding with zeros if needed)
        let hexHash = Math.abs(hash).toString(16);
        while (hexHash.length < 32) {
            hexHash = hexHash + hexHash;
        }
        // Ensure it's exactly 32 characters
        return hexHash.substring(0, 32);
    }

    // Set our fingerprint in localStorage directly (early, before Reddit initializes)
    function setFingerprintEarly() {
        try {
            // Use a consistent fingerprint for anonymous users
            const fixed_fingerprint = hashUsername('anonymous_user');

            // Set fingerprint directly in localStorage
            localStorage.setItem('fp', fixed_fingerprint);

            // Set or maintain timestamp
            if (!localStorage.getItem('fp_timestamp')) {
                localStorage.setItem('fp_timestamp', Date.now().toString());
            }

            console.log("Fingerprint set early in localStorage:", fixed_fingerprint);
            return fixed_fingerprint;
        } catch (e) {
            console.error("Failed to set early fingerprint in localStorage:", e);
            return null;
        }
    }

    // Set fingerprint immediately
    const earlyFingerprint = setFingerprintEarly();

    // Function to override the fingerprint - this runs after Reddit initializes
    function overrideFingerprint() {
        if (window.r && window.r.utils) {
            // Get username for hash generation (if user is logged in)
            const username = window.r?.config?.logged || 'anonymous_user';
            const fixed_fingerprint = hashUsername(username);

            // Override the getFingerprint method
            window.r.utils.getFingerprint = function() {
                // Return our fixed fingerprint with the timestamp
                const timestamp = localStorage.getItem('fp_timestamp') || Date.now().toString();

                return {
                    fp: fixed_fingerprint,
                    timestamp: timestamp
                };
            };

            console.log("Reddit fingerprint function successfully overridden");

            // Also override any stored fingerprint in r.config if it exists
            if (window.r.config && window.r.config.user_hash) {
                window.r.config.user_hash = fixed_fingerprint;
            }
        } else {
            // If r.utils isn't ready yet, try again after a short delay
            setTimeout(overrideFingerprint, 100);
        }
    }

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
                console.log('Sanitized cookie:', val);
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
                        console.log('Blocked tracking pixel:', value);
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
                            console.log('Intercepted GTM iframe:', value);
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
                console.log('URL changed, reapplying protections');
                overrideFingerprint();
                performCleanup();
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document, { childList: true, subtree: true });
    };

    // Clean tracking data while preserving our fingerprint
    function performCleanup() {
        try {
            // Save our fingerprint values
            const fp = localStorage.getItem('fp');
            const fpTimestamp = localStorage.getItem('fp_timestamp');

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

            keysToRemove.forEach(key => localStorage.removeItem(key));

            // Restore our fingerprint values
            if (fp) localStorage.setItem('fp', fp);
            if (fpTimestamp) localStorage.setItem('fp_timestamp', fpTimestamp);
        } catch (e) {
            console.log('Error cleaning localStorage:', e);
        }
    }

    // Intercept early Reddit initialization
    const interceptRedditInit = function() {
        // Define a getter for window.store to intercept it early
        let storeObj = null;
        Object.defineProperty(window, 'store', {
            get: function() {
                return storeObj;
            },
            set: function(newStore) {
                storeObj = newStore;

                // If store methods are available, override them
                if (storeObj && typeof storeObj.safeSet === 'function') {
                    const originalSafeSet = storeObj.safeSet;
                    storeObj.safeSet = function(key, value) {
                        // For fingerprint-related keys, use our fixed values
                        if (key === 'fp') {
                            return originalSafeSet.call(this, key, earlyFingerprint);
                        }

                        // Block storage of tracking values
                        if (key.includes('_id') || key.includes('loid') ||
                            key.includes('token') || key.includes('track') ||
                            key.includes('session')) {
                            console.log('Blocked storage of tracking key:', key);
                            return;
                        }

                        return originalSafeSet.apply(this, arguments);
                    };
                }

                return true; // Return success for the original setter
            },
            configurable: true
        });
    };

    // Run these functions at document-start
    interceptRedditInit();
    blockTrackingResources();
    spoofCanvasFingerprinting();
    spoofNavigatorProperties();
    handleGTM();

    // Create a fake dataLayer for GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push = function() {
        console.log('Intercepted GTM dataLayer push');
        return arguments.length;
    };

    // Run these after the document has loaded
    document.addEventListener('DOMContentLoaded', function() {
        overrideFingerprint();
        observeUrlChanges();
        performCleanup();
    });

    // Final check after all resources have loaded
    window.addEventListener('load', function() {
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

        // Final fingerprint check
        overrideFingerprint();
    });
})();