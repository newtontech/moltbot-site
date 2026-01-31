/**
 * Copy utility module for clipboard operations
 * Provides functionality to copy text to clipboard with user feedback
 */

/**
 * Copy text to clipboard with button feedback
 * @param {string} text - The text to copy to clipboard
 * @param {HTMLElement} btn - The button element to show feedback on
 * @param {number} timeout - Timeout in ms before resetting button text (default: 2000)
 * @returns {Promise<boolean>} - Resolves to true if successful, false if failed
 */
export async function copyText(text, btn, timeout = 2000) {
    // Check if Clipboard API is available
    if (!navigator.clipboard) {
        console.error('Clipboard API not available');
        showFeedback(btn, '❌ 不支持', false);
        return false;
    }

    try {
        // Write text to clipboard
        await navigator.clipboard.writeText(text);

        // Show success feedback
        showFeedback(btn, '✅ 已复制!', true);

        // Reset button after timeout
        if (btn) {
            setTimeout(() => {
                resetButton(btn);
            }, timeout);
        }

        return true;
    } catch (error) {
        console.error('Failed to copy text:', error);

        // Show error feedback
        showFeedback(btn, '❌ 失败', false);

        // Reset button after timeout
        if (btn) {
            setTimeout(() => {
                resetButton(btn);
            }, timeout);
        }

        return false;
    }
}

/**
 * Show feedback on button
 * @param {HTMLElement} btn - The button element
 * @param {string} text - Feedback text to show
 * @param {boolean} isSuccess - Whether the operation was successful
 */
function showFeedback(btn, text, isSuccess) {
    if (!btn) return;

    // Store original content if not already stored
    if (!btn.dataset.originalContent) {
        btn.dataset.originalContent = btn.innerHTML;
    }

    // Update button text
    btn.innerHTML = text;

    // Add success/error styling
    if (isSuccess) {
        btn.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
    } else {
        btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    }
}

/**
 * Reset button to original state
 * @param {HTMLElement} btn - The button element
 */
function resetButton(btn) {
    if (!btn) return;

    // Restore original content
    if (btn.dataset.originalContent) {
        btn.innerHTML = btn.dataset.originalContent;
        delete btn.dataset.originalContent;
    }

    // Reset styling
    btn.style.background = '';
}

/**
 * Copy text to clipboard without button feedback
 * @param {string} text - The text to copy to clipboard
 * @returns {Promise<boolean>} - Resolves to true if successful, false if failed
 */
export async function copyToClipboard(text) {
    if (!navigator.clipboard) {
        console.error('Clipboard API not available');
        return false;
    }

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy text:', error);
        return false;
    }
}

/**
 * Check if Clipboard API is available
 * @returns {boolean} - True if available, false otherwise
 */
export function isClipboardAvailable() {
    return !!navigator.clipboard;
}
