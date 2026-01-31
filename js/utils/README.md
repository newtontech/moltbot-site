# JS Utils

This directory contains reusable JavaScript utility modules for the Moltbot site.

## Available Utilities

### copy.js

Clipboard utility module for copying text to the clipboard with user feedback.

#### Features

- **Clipboard API Integration**: Uses the modern Navigator Clipboard API
- **User Feedback**: Provides visual feedback on buttons (success/error states)
- **Error Handling**: Gracefully handles errors and unsupported environments
- **Auto Reset**: Automatically resets button state after a timeout
- **Multiple Export Options**: Functions with and without button feedback

#### API Reference

##### `copyText(text, btn, timeout)`

Copy text to clipboard with button feedback.

**Parameters:**
- `text` (string): The text to copy to clipboard
- `btn` (HTMLElement): The button element to show feedback on
- `timeout` (number, optional): Timeout in ms before resetting button text (default: 2000)

**Returns:** `Promise<boolean>` - Resolves to true if successful, false if failed

**Example:**
```javascript
import { copyText } from './js/utils/copy.js';

// In your HTML
<button onclick="handleCopy(this)">📋 Copy</button>

// In your JavaScript
function handleCopy(btn) {
    copyText('molt install bear-notes', btn);
}
```

##### `copyToClipboard(text)`

Copy text to clipboard without button feedback.

**Parameters:**
- `text` (string): The text to copy to clipboard

**Returns:** `Promise<boolean>` - Resolves to true if successful, false if failed

**Example:**
```javascript
import { copyToClipboard } from './js/utils/copy.js';

await copyToClipboard('Hello, World!');
```

##### `isClipboardAvailable()`

Check if Clipboard API is available in the current environment.

**Returns:** `boolean` - True if available, false otherwise

**Example:**
```javascript
import { isClipboardAvailable } from './js/utils/copy.js';

if (isClipboardAvailable()) {
    // Clipboard API is available
} else {
    // Fallback to legacy method or show error
}
```

#### Visual Feedback States

The `copyText` function provides the following visual feedback:

1. **Success**: Button turns green with "✅ 已复制!" message
2. **Error**: Button turns red with "❌ 失败" message
3. **Reset**: After 2 seconds (default), button returns to original state

#### Browser Support

- Chrome/Edge 66+
- Firefox 63+
- Safari 13.1+
- Opera 53+

#### Security Considerations

The Clipboard API requires:

1. **Secure Context**: Must be served over HTTPS or localhost
2. **User Activation**: Must be triggered by a user gesture (click, tap, etc.)
3. **Permission**: Browser may request clipboard permission

#### Error Handling

The utility handles the following error scenarios:

- Clipboard API not available (older browsers)
- Permission denied
- User cancelled the operation
- Invalid text format

#### Testing

A test file is available at `/test-copy.html` to verify the functionality:

```bash
# Serve the site locally
cd /home/yhm/desktop/code/moltbot-site
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/test-copy.html
```

## Usage in Main Application

The copy utility is already integrated into the main `index.html`:

```html
<script type="module">
    import { copyText } from './js/utils/copy.js';

    // Used in skill cards
    <button class="copy-btn" onclick="copyText('${skill.install_cmd}', this)">
        📋 复制
    </button>
</script>
```

## Adding New Utilities

When adding new utility modules:

1. Create a new file in this directory (e.g., `new-util.js`)
2. Export functions using ES6 export syntax
3. Add documentation to this README
4. Import in `index.html` or other files as needed
5. Test thoroughly before deployment

## License

Part of the Moltbot site project.
