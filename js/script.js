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
    const chunkLength = 200; // Adjust the chunk length as needed
    const chunks = text.match(new RegExp('.{1,' + chunkLength + '}', 'g'));
    let index = 0;

    function speakNextChunk() {
        if (index < chunks.length) {
            const chunk = chunks[index];
            utterance = new SpeechSynthesisUtterance(chunk);
            const voices = window.speechSynthesis.getVoices();
            utterance.voice = voices.find(v => v.name === voice);
            utterance.onend = () => {
                index++;
                speakNextChunk(); // Continue to the next chunk when the current one ends
            };
            speechSynthesis.speak(utterance);
        }
    }

    speakNextChunk(); // Start speaking the first chunk
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

// Update the voice list when voices are loaded (Chrome only)
window.speechSynthesis.onvoiceschanged = populateVoiceList;
