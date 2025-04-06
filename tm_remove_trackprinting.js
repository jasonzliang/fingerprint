// ==UserScript==
// @name         Reddit Enhanced Fingerprint Protection
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Comprehensive protection against fingerprinting from GTM, OneTrust, and more on Reddit
// @author       You
// @match        https://*.reddit.com/*
// @grant        window.close
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Run at document-start to intercept as early as possible
    const runEarly = function() {
        // Block network requests for tracking resources
        const interceptNetworkRequests = function() {
            // Create a proxy for XMLHttpRequest
            const originalXHR = window.XMLHttpRequest;
            window.XMLHttpRequest = function() {
                const xhr = new originalXHR();
                const originalOpen = xhr.open;

                xhr.open = function(method, url) {
                    if (typeof url === 'string' && (
                        url.includes('hsts_pixel') ||
                        url.includes('pixel.png') ||
                        url.includes('share.json') ||
                        url.includes('events_collector') ||
                        url.includes('analytics') ||
                        url.includes('onetrust') ||
                        url.includes('gtm')
                    )) {
                        console.log('Blocked tracking XHR:', url);
                        // Redirect to empty response
                        return originalOpen.apply(this, [method, 'data:text/plain,']);
                    }
                    return originalOpen.apply(this, arguments);
                };

                return xhr;
            };

            // Create a proxy for fetch
            const originalFetch = window.fetch;
            window.fetch = function(resource, init) {
                if (typeof resource === 'string' && (
                    resource.includes('hsts_pixel') ||
                    resource.includes('pixel.png') ||
                    resource.includes('share.json') ||
                    resource.includes('events_collector') ||
                    resource.includes('analytics') ||
                    resource.includes('onetrust') ||
                    resource.includes('gtm')
                )) {
                    console.log('Blocked tracking fetch:', resource);
                    return Promise.resolve(new Response('', {status: 200}));
                }
                return originalFetch.apply(this, arguments);
            };

            // Intercept image loading for HSTS pixel and other tracking pixels
            const originalImage = window.Image;
            window.Image = function() {
                const img = new originalImage();
                const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;

                Object.defineProperty(img, 'src', {
                    set: function(value) {
                        if (typeof value === 'string' && (
                            value.includes('hsts_pixel') ||
                            value.includes('pixel.png') ||
                            value.includes('reddit.com/static') ||
                            value.includes('redditmedia.com')
                        )) {
                            console.log('Blocked tracking image:', value);
                            // Set to a transparent 1x1 data URL instead
                            originalSrcSetter.call(this, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
                            return;
                        }
                        originalSrcSetter.call(this, value);
                    }
                });

                return img;
            };
        };

        // Block JavaScript-based fingerprinting
        const blockJSFingerprinting = function() {
            // 1. Spoof navigator properties
            const navigatorProps = {
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: ['en-US', 'en'],
                platform: 'Win32',
                hardwareConcurrency: 4,
                deviceMemory: 8,
                appVersion: '5.0 (Windows)',
                vendor: 'Google Inc.',
                product: 'Gecko',
                productSub: '20030107',
                doNotTrack: null
            };

            for (const prop in navigatorProps) {
                if (navigator[prop] !== undefined) {
                    Object.defineProperty(navigator, prop, {
                        get: function() { return navigatorProps[prop]; }
                    });
                }
            }

            // 2. Spoof screen properties
            const screenProps = {
                width: 1920,
                height: 1080,
                availWidth: 1920,
                availHeight: 1040,
                colorDepth: 24,
                pixelDepth: 24
            };

            for (const prop in screenProps) {
                if (screen[prop] !== undefined) {
                    Object.defineProperty(screen, prop, {
                        get: function() { return screenProps[prop]; }
                    });
                }
            }

            // 3. Audio context fingerprinting prevention
            const originalAudioContext = window.AudioContext || window.webkitAudioContext;
            if (originalAudioContext) {
                window.AudioContext = window.webkitAudioContext = function() {
                    const context = new originalAudioContext();

                    // Add noise to audio fingerprinting
                    const originalGetFloatFrequencyData = context.getFloatFrequencyData;
                    if (context.getFloatFrequencyData) {
                        context.getFloatFrequencyData = function(array) {
                            originalGetFloatFrequencyData.call(this, array);
                            // Add subtle random noise to frequency data
                            for (let i = 0; i < array.length; i++) {
                                array[i] += (Math.random() * 0.1) - 0.05;
                            }
                            return array;
                        };
                    }

                    return context;
                };
            }
        };

        // Block storage-based tracking
        const blockStorageTracking = function() {
            // 1. Override localStorage
            const originalLocalStorage = window.localStorage;
            const fakeStorage = {};

            window.localStorage = {
                getItem: function(key) {
                    if (key.includes('_id') || key.includes('loid') || key.includes('session') ||
                        key.includes('tracker') || key.includes('onetrust') || key.includes('gtm')) {
                        console.log('Blocked localStorage get:', key);
                        return null;
                    }
                    return fakeStorage[key] || null;
                },
                setItem: function(key, value) {
                    if (key.includes('_id') || key.includes('loid') || key.includes('session') ||
                        key.includes('tracker') || key.includes('onetrust') || key.includes('gtm')) {
                        console.log('Blocked localStorage set:', key);
                        return;
                    }
                    fakeStorage[key] = value;
                },
                removeItem: function(key) {
                    delete fakeStorage[key];
                },
                clear: function() {
                    for (const key in fakeStorage) {
                        delete fakeStorage[key];
                    }
                },
                key: function(index) {
                    return Object.keys(fakeStorage)[index] || null;
                },
                get length() {
                    return Object.keys(fakeStorage).length;
                }
            };

            // 2. Override sessionStorage using similar approach
            const fakeSessionStorage = {};
            window.sessionStorage = {
                getItem: function(key) {
                    if (key.includes('_id') || key.includes('loid') || key.includes('session') ||
                        key.includes('tracker') || key.includes('onetrust') || key.includes('gtm')) {
                        return null;
                    }
                    return fakeSessionStorage[key] || null;
                },
                setItem: function(key, value) {
                    if (key.includes('_id') || key.includes('loid') || key.includes('session') ||
                        key.includes('tracker') || key.includes('onetrust') || key.includes('gtm')) {
                        return;
                    }
                    fakeSessionStorage[key] = value;
                },
                removeItem: function(key) {
                    delete fakeSessionStorage[key];
                },
                clear: function() {
                    for (const key in fakeSessionStorage) {
                        delete fakeSessionStorage[key];
                    }
                },
                key: function(index) {
                    return Object.keys(fakeSessionStorage)[index] || null;
                },
                get length() {
                    return Object.keys(fakeSessionStorage).length;
                }
            };

            // 3. Block or modify indexedDB functionality
            if (window.indexedDB) {
                const originalIndexedDB = window.indexedDB;
                window.indexedDB = {
                    open: function(name) {
                        if (name.includes('reddit') || name.includes('fingerprint') ||
                            name.includes('tracker') || name.includes('gtm') ||
                            name.includes('onetrust')) {
                            console.log('Blocked indexedDB access:', name);

                            // Return a fake request object that never succeeds
                            return {
                                result: null,
                                error: new Error('IndexedDB access blocked by privacy settings'),
                                addEventListener: function() {},
                                removeEventListener: function() {}
                            };
                        }
                        return originalIndexedDB.open.apply(originalIndexedDB, arguments);
                    }
                };

                // Copy remaining properties
                for (const prop in originalIndexedDB) {
                    if (!(prop in window.indexedDB)) {
                        window.indexedDB[prop] = originalIndexedDB[prop];
                    }
                }
            }
        };

        // Block or spoof GTM
        const spoofGTM = function() {
            // Create fake GTM object
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push = function(data) {
                console.log('Intercepted GTM dataLayer push:', data);
                // Don't actually push anything
                return data;
            };

            // Prevent GTM iframe from loading
            document.createElement = (function(original) {
                return function(tagName) {
                    const element = original.call(document, tagName);
                    if (tagName.toLowerCase() === 'iframe') {
                        const originalSetter = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src').set;
                        Object.defineProperty(element, 'src', {
                            set: function(value) {
                                if (value && value.includes('gtm')) {
                                    console.log('Blocked GTM iframe:', value);
                                    // Set a blank src instead
                                    originalSetter.call(this, 'about:blank');
                                    // Add expected properties so the page doesn't break
                                    this.id = 'gtm-jail';
                                    this.style.display = 'none';
                                    return;
                                }
                                originalSetter.call(this, value);
                            }
                        });
                    }
                    return element;
                };
            })(document.createElement);
        };

        // Execute all protective measures
        interceptNetworkRequests();
        blockJSFingerprinting();
        blockStorageTracking();
        spoofGTM();
    };

    // Spoof canvas fingerprinting
    const spoofCanvas = function() {
        if (!HTMLCanvasElement.prototype.toDataURL) return;

        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function() {
            const ctx = this.getContext('2d');
            if (ctx) {
                // Add subtle noise before generating the data URL
                const imageData = ctx.getImageData(0, 0, this.width, this.height);
                const data = imageData.data;

                // Add minimal noise to not disrupt visible content
                for (let i = 0; i < data.length; i += 4) {
                    // Only modify pixels that are not completely transparent
                    if (data[i+3] > 0) {
                        // Add very subtle noise (±1) to RGB channels
                        data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() < 0.5 ? -1 : 1)));  // R
                        data[i+1] = Math.max(0, Math.min(255, data[i+1] + (Math.random() < 0.5 ? -1 : 1))); // G
                        data[i+2] = Math.max(0, Math.min(255, data[i+2] + (Math.random() < 0.5 ? -1 : 1))); // B
                    }
                }

                ctx.putImageData(imageData, 0, 0);
            }

            return originalToDataURL.apply(this, arguments);
        };

        // Also override getImageData to add noise to any reading of canvas data
        if (CanvasRenderingContext2D.prototype.getImageData) {
            const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
            CanvasRenderingContext2D.prototype.getImageData = function() {
                const imageData = originalGetImageData.apply(this, arguments);

                // Add noise to the retrieved data
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i+3] > 0) {
                        data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() < 0.5 ? -1 : 1)));
                        data[i+1] = Math.max(0, Math.min(255, data[i+1] + (Math.random() < 0.5 ? -1 : 1)));
                        data[i+2] = Math.max(0, Math.min(255, data[i+2] + (Math.random() < 0.5 ? -1 : 1)));
                    }
                }

                return imageData;
            };
        }
    };

    // Spoof WebGL fingerprinting
    const spoofWebGL = function() {
        // Modify WebGL context to return consistent values
        if (window.WebGLRenderingContext) {
            const parameterMap = {
                37445: 'Generic Vendor', // UNMASKED_VENDOR_WEBGL
                37446: 'Generic Renderer' // UNMASKED_RENDERER_WEBGL
            };

            const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                // Return spoofed values for fingerprinting-sensitive parameters
                if (parameterMap[parameter]) {
                    return parameterMap[parameter];
                }

                // Slightly modify certain array returns to avoid fingerprinting
                const result = originalGetParameter.call(this, parameter);

                // Add noise to array-type returns (like MAX_VIEWPORT_DIMS)
                if (result instanceof Float32Array || result instanceof Int32Array) {
                    // Create a copy to avoid modifying shared objects
                    const copy = new (result.constructor)(result);
                    for (let i = 0; i < copy.length; i++) {
                        // Add very minor noise that won't affect functionality
                        if (typeof copy[i] === 'number') {
                            copy[i] = copy[i] + (Math.random() * 0.00001);
                        }
                    }
                    return copy;
                }

                return result;
            };

            // Also handle WebGL2 contexts if they exist
            if (window.WebGL2RenderingContext) {
                WebGL2RenderingContext.prototype.getParameter = WebGLRenderingContext.prototype.getParameter;
            }
        }
    };

    // Block Reddit tracking activities
    const blockRedditTracking = function() {
        // Override Reddit's tracking and analytics functions
        if (window.r) {
            // Create dummy functions for tracking methods
            const dummyFunction = function() { return; };

            // Replace all tracking functions
            if (window.r.analytics) {
                for (const method in window.r.analytics) {
                    window.r.analytics[method] = dummyFunction;
                }
            }

            // Disable the events collectors
            if (window.r.events) {
                window.r.events.buffer = [];
                window.r.events.push = dummyFunction;
                window.r.events.flush = dummyFunction;
            }

            // Override configuration to disable tracking
            if (window.r.config) {
                const safeConfig = {
                    logged: false,
                    user_id: Math.floor(Math.random() * 1000000),
                    loid: 'anonymous' + Math.random().toString(36).substring(2),
                    send_logs: false,
                    store_visits: false,
                    poisoning_canary: '',
                    stats_sample_rate: '0',
                    user_in_timeout: false,
                    email_verified: false
                };

                for (const key in safeConfig) {
                    if (window.r.config[key] !== undefined) {
                        window.r.config[key] = safeConfig[key];
                    }
                }
            }
        }

        // Intercept any attempt to use the "reddit_session" cookie
        document.__defineGetter__('cookie', function() {
            const cookies = document.__lookupGetter__('cookie').call(document);
            return cookies.replace(/reddit_session=[^;]+;?/g, '');
        });

        document.__defineSetter__('cookie', function(val) {
            if (val.includes('reddit_session') ||
                val.includes('loid') ||
                val.includes('token') ||
                val.includes('track')) {
                console.log('Blocked cookie set:', val);
                return;
            }
            document.__lookupSetter__('cookie').call(document, val);
        });
    };

    // Execute our script at document-start
    const script = document.createElement('script');
    script.textContent = `
        (${runEarly.toString()})();
        (${spoofCanvas.toString()})();
        (${spoofWebGL.toString()})();
        (${blockRedditTracking.toString()})();
    `;

    // Add script to page as early as possible
    document.documentElement.appendChild(script);
    document.documentElement.removeChild(script);

    // Also run additional protection when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Remove any tracking pixels that made it through
        const trackingElements = document.querySelectorAll('[id*="pixel"], [src*="pixel.png"], [id="hsts_pixel"]');
        trackingElements.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });

        // Clean up any GTM iframes
        const gtmFrames = document.querySelectorAll('iframe[id="gtm-jail"]');
        gtmFrames.forEach(frame => {
            if (frame && frame.parentNode) {
                // Replace with an empty iframe to avoid breaking page functionality
                const emptyFrame = document.createElement('iframe');
                emptyFrame.style.display = 'none';
                emptyFrame.id = 'gtm-jail';
                frame.parentNode.replaceChild(emptyFrame, frame);
            }
        });
    });
})();
