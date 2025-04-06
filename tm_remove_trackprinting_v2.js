// ==UserScript==
// @name         Reddit Privacy Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Block fingerprinting on Reddit while maintaining functionality
// @author       You
// @match        https://*.reddit.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Safe cookie handling without recursion
    const originalDocumentCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    let lastCookieValue = '';

    Object.defineProperty(document, 'cookie', {
        get: function() {
            const cookies = originalDocumentCookieDescriptor.get.call(this);
            // Filter out tracking cookies without causing recursion
            return cookies.replace(/reddit_session=[^;]+;?/g, '')
                          .replace(/loid=[^;]+;?/g, '')
                          .replace(/rabt=[^;]+;?/g, '');
        },
        set: function(val) {
            // Avoid recursion by checking if this is the same value
            if (val === lastCookieValue) return;
            lastCookieValue = val;

            if (val.includes('reddit_session') ||
                val.includes('loid') ||
                val.includes('rabt')) {
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
        // Wait for the page to start loading
        window.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                // Find and replace GTM iframe
                const gtmFrame = document.getElementById('gtm-jail');
                if (gtmFrame) {
                    // Instead of removing it, replace its functionality
                    const blankFrame = document.createElement('iframe');
                    blankFrame.style.display = 'none';
                    blankFrame.id = 'gtm-jail';
                    blankFrame.name = JSON.stringify({
                        subreddit: 'generic',
                        origin: location.origin,
                        url: location.href,
                        userMatching: false,
                        userId: Math.floor(Math.random() * 1000000),
                        advertiserCategory: null,
                        adsStatus: 'generic',
                    });
                    blankFrame.src = 'about:blank';

                    if (gtmFrame.parentNode) {
                        gtmFrame.parentNode.replaceChild(blankFrame, gtmFrame);
                    }
                }
            }, 500); // Small delay to ensure the page has started loading
        });
    };

    // Run these functions early
    blockTrackingResources();
    spoofCanvasFingerprinting();
    spoofNavigatorProperties();
    handleGTM();

    // Create a fake dataLayer for GTM
    window.dataLayer = window.dataLayer || [];
    const origPush = Array.prototype.push;
    window.dataLayer.push = function() {
        console.log('Intercepted GTM dataLayer push');
        return arguments.length;
    };

    // Handle Reddit's analytics
    window.addEventListener('load', function() {
        if (window.r && window.r.analytics) {
            // Replace tracking functions with no-ops
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
    });

    // Clean local storage
    window.addEventListener('load', function() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('_id') || key.includes('loid') ||
                    key.includes('token') || key.includes('track') ||
                    key.includes('session'))) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (e) {
            console.log('Error cleaning localStorage:', e);
        }
    });
})();