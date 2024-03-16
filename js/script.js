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
    
    utterance.onend = () => { // Set an event listener for when the speech ends
        utterance = null; // Reset the utterance variable
    };

    speechSynthesis.speak(utterance);
}

// Populate the voice selection dropdown
function populateVoiceList() {
    const voices = window.speechSynthesis.getVoices();

    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = voice.name;
        option.value = voice.name;
        voiceSelect.appendChild(option);
    });
}

populateVoiceList();

// Update the voice list when voices are loaded (Chrome only)
window.speechSynthesis.onvoiceschanged = populateVoiceList;
