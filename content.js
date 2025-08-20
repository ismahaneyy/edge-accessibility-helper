let selectedText = '';

// Function to get selected text from the page
function getSelectedText() {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
        return selection.toString().trim();
    }
    return '';
}


// Function to store selected text in chrome.storage.local
function storeSelectedText(text) {
    if (text && text.length > 0) {
        chrome.storage.local.set({ 'selectedText': text }, function() {
            console.log('Selected text stored:', text);
        });
    }
}


// Function to handle text selection
function handleTextSelection() {
    const currentSelection = getSelectedText();
    
    // Only store if there's actually selected text and it's different from previous
    if (currentSelection && currentSelection !== selectedText) {
        selectedText = currentSelection;
        storeSelectedText(selectedText);
    }
}

// Function to handle mouse up events (when text selection is completed)
function handleMouseUp(event) {
    // Small delay to ensure selection is complete
    setTimeout(() => {
        handleTextSelection();
    }, 100);
}

// Function to handle keyboard selection (Shift + Arrow keys, Ctrl+A, etc.)
function handleKeyUp(event) {
    // Check for common selection keys
    if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Meta') {
        return;
    }
    
    // Small delay to ensure selection is complete
    setTimeout(() => {
        handleTextSelection();
    }, 100);
}

// Function to handle copy events (Ctrl+C or right-click copy)
function handleCopy(event) {
    const currentSelection = getSelectedText();
    if (currentSelection) {
        storeSelectedText(currentSelection);
    }
}

// Initialize the content script
function init() {
    console.log('Content script loaded - listening for text selection');
    
    // Add event listeners for text selection
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('copy', handleCopy);
    
    // Also listen for selection changes (more reliable for some cases)
    document.addEventListener('selectionchange', handleTextSelection);
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'getSelectedText') {
            const currentText = getSelectedText();
            sendResponse({ text: currentText });
        }
    });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
