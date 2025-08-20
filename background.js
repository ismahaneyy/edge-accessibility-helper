// Background service worker for Edge extension
// Handles extension lifecycle and background tasks

console.log('Background service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(function(details) {
    console.log('Extension installed:', details.reason);
});

// Listen for extension startup
chrome.runtime.onStartup.addListener(function() {
    console.log('Extension started');
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Message received in background:', request);
    
    // Handle different message types
    switch (request.action) {
        case 'getExtensionInfo':
            sendResponse({ 
                version: chrome.runtime.getManifest().version,
                name: chrome.runtime.getManifest().name
            });
            break;
            
        default:
            sendResponse({ status: 'unknown action' });
    }
    
    // Return true to indicate async response
    return true;
});

