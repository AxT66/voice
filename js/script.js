const speakButton = document.getElementById('speak-button');
const stopButton = document.getElementById('stop-button'); // Adding the stop button
const inputText = document.getElementById('input-text');
const voiceSelect = document.getElementById('voice-select');
let utterance = null; // Variable to hold the speech synthesis instance

let currentIndex = 0; // Variable to keep track of the current word index
let words = []; // Array to store words

speakButton.addEventListener('click', () => {
    const text = inputText.value.trim();
    if (text !== '') {
        words = text.split(/\s+/); // Split text into words
        currentIndex = 0; // Reset current index
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
        removeHighlight(); // Remove highlight when speech is stopped
    }
});

function speakText(text, voice) {
    utterance = new SpeechSynthesisUtterance(text);
    // Selecting a voice
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.name === voice);
    
    utterance.onend = () => { // Set an event listener for when the speech ends
        utterance = null; // Reset the utterance variable
        removeHighlight(); // Remove highlight when speech ends
    };

    utterance.onboundary = (event) => { // Set event listener for word boundary
        if (event.name === 'word') {
            highlightWord(currentIndex); // Highlight the current word
            currentIndex++; // Move to the next word
        }
    };

    speechSynthesis.speak(utterance);
}

// Highlight the word at the given index
function highlightWord(index) {
    removeHighlight(); // Remove previous highlight
    const word = words[index];
    const text = inputText.value;
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
