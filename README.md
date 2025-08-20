# Edge Accessibility Helper

A Chrome/Edge extension I built to help with reading and understanding text on websites. It can summarize long articles and read text out loud.

## What it does

- **Gets text from websites**: Just select any text and it saves it
- **Summarizes stuff**: Makes long articles shorter and easier to understand
- **Reads text aloud**: Uses your browser's built-in speech feature
- **Works everywhere**: Any website, any type of content
- **Simple to use**: Clean popup with just a few buttons

## Installation

### Method 1: Load Unpacked (Developer Mode)

1. **Download or Clone** this repository to your computer
2. **Open your browser** (Chrome or Edge)
3. **Go to Extensions**:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
4. **Enable Developer Mode** (toggle in top right)
5. **Click "Load unpacked"**
6. **Select the extension folder** from this repository
7. **The extension is now installed!**



## How to Use

1. **Select Text**: Highlight any text on a webpage
2. **Open Extension**: Click the extension icon in your browser toolbar
3. **Summarize**: Click "Summarize" to create an intelligent summary
4. **Listen**: Click "Listen" to hear the text read aloud

## How the summarization works

The extension looks at your text and picks out the most important sentences. It checks for:
- Sentences that define things (like "X is..." or "X means...")
- Sentences with names or numbers
- Sentences that give examples
- The first few sentences (usually the most important)

## How the speech works

- Uses your browser's built-in speech feature (no extra downloads needed)
- Picks the best voice available on your computer
- You can control how fast/slow it reads
- Works completely offline

## Technical stuff

- Uses the latest extension format (Manifest V3)
- Only asks for minimal permissions (just to read selected text)
- Works on all websites
- Built with vanilla JavaScript (no frameworks)

## Browser Compatibility

-  Google Chrome (version 88+)
-  Microsoft Edge (version 88+)
-  Other Chromium-based browsers

## Privacy

- Doesn't collect any of your data
- Everything happens on your computer (no internet needed)
- Doesn't track what you do

## Contributing

Feel free to help improve this! Just submit a pull request.

## License

This is open source under the [MIT License](LICENSE).

## Support

If something's not working or you have ideas to make it better:
1. Check the [Issues](https://github.com/yourusername/text-assistant-extension/issues) page
2. Create a new issue and tell me what's wrong
3. Let me know what browser you're using

## Future ideas

- [ ] Add more voice options
- [ ] Let you save summaries to files
- [ ] Add keyboard shortcuts
- [ ] Support for other languages
- [ ] Let you choose how long summaries should be

---

**Built to help make reading easier! 📚**
