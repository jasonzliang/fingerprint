// ==UserScript==
// @name         Reddit Fixed Fingerprint
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Replace Reddit's fingerprint with a fixed 32-character hash and update localStorage
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

    // Function to override the fingerprint
    function overrideFingerprint() {
        if (window.r && window.r.utils) {
            // Get username for hash generation
            const username = window.r?.config?.logged || 'anonymous_user';
            const fixed_fingerprint = hashUsername(username);

            // Override the getFingerprint method
            window.r.utils.getFingerprint = function() {
                // Store our fixed fingerprint in localStorage
                try {
                    store.safeSet('fp', fixed_fingerprint);

                    // Maintain the timestamp if it exists, otherwise create a new one
                    if (!store.safeGet("fp_timestamp")) {
                        store.safeSet('fp_timestamp', Date.now().toString());
                    }
                } catch (e) {
                    console.error("Failed to update localStorage with fixed fingerprint:", e);
                }
                // Return our fixed fingerprint with the timestamp
                return {
                    fp: fixed_fingerprint,
                    timestamp: store.safeGet("fp_timestamp")
                };
            };

            console.log("Reddit fingerprint function successfully overridden");
        } else {
            // If r.utils isn't ready yet, try again after a short delay
            setTimeout(overrideFingerprint, 100);
        }
    }

    // Start the override process immediately
    overrideFingerprint();

    // Monitor for navigation events that might happen in a SPA
    const observeUrlChanges = function() {
        let lastUrl = location.href;

        // Create a new MutationObserver to watch for DOM changes
        const observer = new MutationObserver(function(mutations) {
            // Check if URL has changed
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                console.log('URL changed, reapplying fingerprint override');
                overrideFingerprint();
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document, { childList: true, subtree: true });
    };

    // Start observing URL changes
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeUrlChanges);
    } else {
        observeUrlChanges();
    }
})();
