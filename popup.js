// Popup script for Edge extension
// Handles UI interactions and API calls

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const selectedTextArea = document.getElementById('selectedText');
    const summarizeBtn = document.getElementById('summarizeBtn');
    const listenBtn = document.getElementById('listenBtn');
    const audioPlayer = document.getElementById('audioPlayer');
    const statusDiv = document.getElementById('status');

    // Load selected text from storage when popup opens
    loadSelectedText();

    // Add event listeners
    summarizeBtn.addEventListener('click', handleSummarize);
    listenBtn.addEventListener('click', handleListen);

    // Function to load selected text from chrome.storage.local
    async function loadSelectedText() {
        try {
            const result = await chrome.storage.local.get(['selectedText']);
            if (result.selectedText) {
                selectedTextArea.value = result.selectedText;
                showStatus('Text loaded from storage', 'success');
            } else {
                selectedTextArea.value = '';
                showStatus('No text selected yet', 'info');
            }
        } catch (error) {
            console.error('Error loading text from storage:', error);
            showStatus('Error loading text from storage', 'error');
        }
    }

    // Function to handle Summarize button click
    async function handleSummarize() {
        const text = selectedTextArea.value.trim();
        
        if (!text) {
            showStatus('Please select some text first', 'error');
            return;
        }

        try {
            showStatus('Summarizing text...', 'info');
            summarizeBtn.disabled = true;
            
            const summary = await summarizeText(text);
            
            // Display summary in textarea
            selectedTextArea.value = summary;
            showStatus('Text summarized successfully', 'success');
            
        } catch (error) {
            console.error('Error summarizing text:', error);
            showStatus('Error summarizing text: ' + error.message, 'error');
        } finally {
            summarizeBtn.disabled = false;
        }
    }

    // Function to handle Listen button click
    async function handleListen() {
        const text = selectedTextArea.value.trim();
        
        if (!text) {
            showStatus('Please select some text first', 'error');
            return;
        }

        try {
            showStatus('Generating speech...', 'info');
            listenBtn.disabled = true;
            
            // Clean the text for speech - remove summary formatting
            let cleanTextForSpeech = text;
            
            // Remove "Summary:" prefix if present
            if (cleanTextForSpeech.startsWith('Summary: ')) {
                cleanTextForSpeech = cleanTextForSpeech.substring(9);
            }
            
            // Remove character count suffix if present (old format)
            cleanTextForSpeech = cleanTextForSpeech.replace(/\.\.\. \(\d+ characters\)$/, '');
            
            // Trim any extra whitespace
            cleanTextForSpeech = cleanTextForSpeech.trim();
            
            const audioBlob = await getSpeechFromWebAPI(cleanTextForSpeech);
            
            // Create audio URL and play
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayer.src = audioUrl;
            
            // Play the audio
            await audioPlayer.play();
            
            showStatus('Speech generated successfully', 'success');
            
        } catch (error) {
            console.error('Error generating speech:', error);
            showStatus('Error generating speech: ' + error.message, 'error');
        } finally {
            listenBtn.disabled = false;
        }
    }


    async function summarizeText(text) {
        // Simulate API call delay for testing
        await new Promise(resolve => setTimeout(resolve, 1000));
        

        const cleanText = text.startsWith('Summary: ') ? text.substring(9) : text;
        
        // Create an intelligent summary for any type of text
        let summary = '';
        
        if (cleanText.length > 200) {
            // For longer text, create a comprehensive summary
            const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
            
            // Identify the most important sentences based on content analysis
            const sentenceScores = sentences.map((sentence, index) => {
                const words = sentence.toLowerCase().split(/\s+/);
                let score = 0;
                
                // Score based on position (first sentences are more important)
                score += Math.max(0, 10 - index);
                
                // Score based on length (medium length sentences are ideal)
                if (words.length >= 8 && words.length <= 25) score += 5;
                
                // Score based on content indicators
                const hasDefinition = /\b(is|are|means|refers to|defined as)\b/i.test(sentence);
                const hasExamples = /\b(for example|such as|including|like)\b/i.test(sentence);
                const hasNumbers = /\d+/.test(sentence);
                const hasNames = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(sentence);
                
                if (hasDefinition) score += 8;
                if (hasExamples) score += 3;
                if (hasNumbers) score += 2;
                if (hasNames) score += 4;
                
                return { sentence: sentence.trim(), score, index };
            });
            
            // Sort by score and take top sentences
            sentenceScores.sort((a, b) => b.score - a.score);
            const topSentences = sentenceScores.slice(0, Math.min(3, sentenceScores.length));
            
            // Sort back by original order for natural flow
            topSentences.sort((a, b) => a.index - b.index);
            
            if (topSentences.length > 0) {
                summary = topSentences.map(s => s.sentence).join('. ') + '.';
            } else {
                // Fallback: take first 2-3 sentences
                summary = sentences.slice(0, Math.min(3, sentences.length)).join('. ') + '.';
            }
            
            // If summary is still too long, make it more concise
            if (summary.length > 500) {
                const words = summary.split(' ');
                const truncatedWords = words.slice(0, Math.min(60, words.length));
                summary = truncatedWords.join(' ') + '...';
            }
            
            // Add context about what was summarized
            if (sentences.length > 4) {
                summary += ` (Summarized from ${sentences.length} sentences)`;
            }
            
        } else if (cleanText.length > 100) {
            // For medium text, create a concise summary
            const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
            
            if (sentences.length >= 2) {
                // Take first 2 sentences for medium text
                summary = sentences.slice(0, 2).join('. ') + '.';
            } else {
                // For single long sentence, use it as is
                summary = cleanText;
            }
        } else {
            // For shorter text, use as is
            summary = cleanText;
        }
        
        return `Summary: ${summary}`;
        

    }

    // Function to get speech using Web Speech API 
    async function getSpeechFromWebAPI(text) {
        // Simulate API call delay for testing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if Web Speech API is supported
        if (!window.speechSynthesis) {
            throw new Error('Web Speech API not supported in this browser');
        }
        
        try {
            // Create a speech utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configure speech settings
            utterance.lang = 'en-US';
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1.0; // Normal pitch
            utterance.volume = 0.8; // Good volume
            
            // Get available voices and select a good one
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Prefer English voices, especially female ones
                const preferredVoice = voices.find(voice => 
                    voice.lang.startsWith('en') && voice.name.includes('Female')
                ) || voices.find(voice => 
                    voice.lang.startsWith('en')
                ) || voices[0];
                
                utterance.voice = preferredVoice;
            }
            
            // Play the speech immediately
            speechSynthesis.speak(utterance);
            
            // Create a simple audio blob for the audio player (since we're playing directly)
            // This creates a minimal WAV file that the audio player can handle
            const sampleRate = 44100;
            const duration = Math.max(1.0, text.length * 0.1); // Estimate duration based on text length
            const samples = Math.floor(sampleRate * duration);
            
            // Create a silent audio buffer (no beep)
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioBuffer = audioContext.createBuffer(1, samples, sampleRate);
            const channelData = audioBuffer.getChannelData(0);
            
            // Fill with silence (no beep sound)
            for (let i = 0; i < samples; i++) {
                channelData[i] = 0; // Silent - no beep
            }
            
            // Convert to WAV format for the audio player
            const wavBuffer = new ArrayBuffer(44 + samples);
            const view = new DataView(wavBuffer);
            
            // WAV file header
            const writeString = (offset, string) => {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            };
            
            writeString(0, 'RIFF');
            view.setUint32(4, 36 + samples, true);
            writeString(8, 'WAVE');
            writeString(12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            view.setUint16(22, 1, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate, true);
            view.setUint16(32, 1, true);
            view.setUint16(34, 8, true);
            writeString(36, 'data');
            view.setUint32(40, samples, true);
            
            // Add the audio data
            for (let i = 0; i < samples; i++) {
                view.setUint8(44 + i, Math.floor((channelData[i] + 1) * 127.5));
            }
            
            return new Blob([wavBuffer], { type: 'audio/wav' });
            
        } catch (error) {
            console.error('Web Speech API error:', error);
            throw new Error(`Failed to generate speech: ${error.message}`);
        }
    }

    // Function to show status messages
    function showStatus(message, type = 'info') {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        
        // Auto-hide status after 3 seconds
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = 'status';
        }, 3000);
    }

    // Listen for storage changes to update text in real-time
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local' && changes.selectedText) {
            const newText = changes.selectedText.newValue;
            if (newText) {
                selectedTextArea.value = newText;
                showStatus('Text updated from page selection', 'info');
            }
        }
    });
});
