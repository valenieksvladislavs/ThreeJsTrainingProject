const audioContext = new window.AudioContext();
let audioBuffer: AudioBuffer;
const musicSource = audioContext.createBufferSource();

function loadMusic() {
  fetch('music/maxwell-the-cat-theme-made-with-Voicemod.mp3')
    .then((response) => response.arrayBuffer())
    .then((data) => {
      audioContext.decodeAudioData(data, (buffer) => {
        audioBuffer = buffer;
        startMusic();
      });
    })
    .catch((error) => console.error('Ошибка загрузки музыки', error));
}

function startMusic() {
  if (audioBuffer) {
    musicSource.buffer = audioBuffer;
    musicSource.loop = true;
    musicSource.connect(audioContext.destination);
    musicSource.start(0);
  }
}

loadMusic();
