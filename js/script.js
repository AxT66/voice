const speakButton = document.getElementById('speak-button');
const stopButton = document.getElementById('stop-button'); // Adding the stop button
const inputText = document.getElementById('input-text');
const voiceSelect = document.getElementById('voice-select');
let utterance = null; // Variable to hold the speech synthesis instance

speakButton.addEventListener('click', () => {
    const text = inputText.value.trim();
    if (text !== '') {
        const selectedVoice = voiceSelect.value;
        speakText(text, selectedVoice);
    } else {
        alert('Please enter some text.');
    }
});

stopButton.addEventListener('click', () => {
    if (utterance !== null) {
        utterance.onend = null; // Remove the event listener
        speechSynthesis.cancel();
    }
});

function speakText(text, voice) {
    utterance = new SpeechSynthesisUtterance(text);
    // Selecting a voice
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.name === voice);

    utterance.onboundary = (event) => { // Set an event listener for word boundary
        const currentIndex = event.charIndex;
        highlightWord(currentIndex);
    };

    utterance.onend = () => { // Set an event listener for when the speech ends
        removeHighlight(); // Remove highlight when speech ends
        utterance = null; // Reset the utterance variable
    };

    speechSynthesis.speak(utterance);
}


// Highlight the word at the given index
// Highlight the word at the given index
function highlightWord(index) {
    removeHighlight(); // Remove previous highlight
    const text = inputText.value;
    const words = text.match(/\w+/g); // Extract all words from the text
    if (!words || index >= words.length) return; // Ensure index is within bounds
    const word = words[index];
    const startIndex = text.indexOf(word);
    const endIndex = startIndex + word.length;
    inputText.setSelectionRange(startIndex, endIndex);
    inputText.focus();
}


// Remove highlight
function removeHighlight() {
    inputText.setSelectionRange(0, 0);
}

// Populate the voice selection dropdown
function populateVoiceList() {
    const voices = window.speechSynthesis.getVoices();

    // Clear the existing options
    voiceSelect.innerHTML = '';

    // Select the first four voices
    for (let i = 0; i < 4 && i < voices.length; i++) {
        const option = document.createElement('option');
        option.textContent = voices[i].name;
        option.value = voices[i].name;
        voiceSelect.appendChild(option);
    }
}

populateVoiceList();

// Update the voice list when voices are loaded (Chrome only)
window.speechSynthesis.onvoiceschanged = populateVoiceList;
