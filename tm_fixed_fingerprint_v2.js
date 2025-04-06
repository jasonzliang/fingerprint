// ==UserScript==
// @name         Reddit Privacy Enhancer with Fixed Fingerprint Display
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Block fingerprinting on Reddit with consistent fingerprint ID and display it on page
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

    // Set fingerprint in localStorage
    function setFingerprint(username) {
        try {
            // Generate fingerprint
            const fingerprint = hashUsername(username || 'anonymous_user');

            // Properly format the fingerprint as JSON string
            // This fixes the "JSON parse error" in Reddit's code
            localStorage.setItem('fp', JSON.stringify(fingerprint));

            // Set or maintain timestamp
            if (!localStorage.getItem('fp_timestamp')) {
                localStorage.setItem('fp_timestamp', JSON.stringify(Date.now()));
            }

            debugLog('Fingerprint set:', fingerprint);
            return fingerprint;
        } catch (e) {
            errorLog('Failed to set fingerprint:', e);
            return null;
        }
    }

    // Initialize fingerprint immediately
    const initialFingerprint = setFingerprint('anonymous_user');
    debugLog('Initial fingerprint set:', initialFingerprint);

    // Create/update the display element
    function createFingerprintDisplay() {
        try {
            // Make sure body exists
            if (!document.body) {
                debugLog('Document body not ready, will try again...');
                return false;
            }

            // Get current fingerprint from localStorage and parse it if needed
            let fingerprint;
            try {
                const storedFp = localStorage.getItem('fp');
                fingerprint = storedFp ? JSON.parse(storedFp) : initialFingerprint;
            } catch (e) {
                // If parsing fails, use the raw value
                fingerprint = localStorage.getItem('fp') || initialFingerprint;
            }

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

                // Set fingerprint with current username
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

    // Handle navigation via History API
    function setupNavigationHandlers() {
        try {
            let lastUrl = location.href;

            // Monitor URL changes
            function checkUrlChange() {
                if (location.href !== lastUrl) {
                    debugLog('URL changed:', lastUrl, '→', location.href);
                    lastUrl = location.href;

                    // Re-apply protections
                    overrideRedditFingerprint();
                    ensureDisplay();
                }

                // Continue checking
                setTimeout(checkUrlChange, 1000);
            }

            // Start checking
            checkUrlChange();

            // Handle History API
            const originalPushState = history.pushState;
            history.pushState = function() {
                const result = originalPushState.apply(this, arguments);
                debugLog('pushState called');

                // Check if URL changed
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    overrideRedditFingerprint();
                    ensureDisplay();
                }

                return result;
            };

            // Handle popstate (back/forward)
            window.addEventListener('popstate', function() {
                debugLog('popstate event');

                // Check if URL changed
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    overrideRedditFingerprint();
                    ensureDisplay();
                }
            });

            debugLog('Navigation handlers set up');
        } catch (e) {
            errorLog('Error setting up navigation handlers:', e);
        }
    }

    // Periodic validation of fingerprint
    function setupPeriodicValidation() {
        // Check fingerprint every second
        setInterval(function() {
            try {
                // Get stored fingerprint and parse it if needed
                let storedFP;
                try {
                    const rawStored = localStorage.getItem('fp');
                    storedFP = rawStored ? JSON.parse(rawStored) : null;
                } catch (e) {
                    // If parsing fails, use the raw value
                    storedFP = localStorage.getItem('fp');
                }

                const username = window.r?.config?.logged || 'anonymous_user';
                const expectedFP = hashUsername(username);

                // If fingerprint doesn't match expected value, fix it
                if (!storedFP || storedFP !== expectedFP) {
                    debugLog('Fixing fingerprint:', storedFP, '→', expectedFP);
                    localStorage.setItem('fp', JSON.stringify(expectedFP));

                    // Update display
                    const displayEl = document.getElementById('fingerprint-display');
                    if (displayEl) {
                        displayEl.textContent = displayEl.textContent.includes('Fingerprint:') ?
                            `Fingerprint: ${expectedFP}` :
                            `FP: ${expectedFP.substring(0, 8)}...`;
                        displayEl.setAttribute('data-fp', expectedFP);
                    }
                }

                // Also check if display exists and create if not
                if (!document.getElementById('fingerprint-display')) {
                    createFingerprintDisplay();
                }

                // Also check API overrides are still in place
                if (window.r && window.r.utils && typeof window.r.utils.getFingerprint === 'function') {
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

    // Initialize on load
    function initialize() {
        debugLog('Initializing Reddit Privacy Enhancer');

        // Set initial fingerprint
        setFingerprint('anonymous_user');

        // Set up event listeners
        document.addEventListener('DOMContentLoaded', function() {
            debugLog('DOMContentLoaded event');
            ensureDisplay();
            checkRedditReady();
            setupNavigationHandlers();
        });

        // Also handle case where DOM is already loaded
        if (document.readyState !== 'loading') {
            debugLog('Document already loaded');
            ensureDisplay();
            checkRedditReady();
            setupNavigationHandlers();
        }

        // Setup final checks when everything is loaded
        window.addEventListener('load', function() {
            debugLog('Window load event');
            overrideRedditFingerprint();
            setupPeriodicValidation();
        });
    }

    // Start the script
    initialize();
})();