const playIcon = document.getElementById('btnPlay');
const audioPlayerContainer = document.getElementById('audioPlayer');
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const muteIcon = document.getElementById('btnMute');

let playState = 'play';
let muteState = 'unmute';

playIcon.addEventListener('click', () => {
    if(playState === 'play') {
        audio.play();
        requestAnimationFrame(whilePlaying);
        playIcon.innerHTML = '<i class="fas fa-pause"></i>';
        playState = 'pause';
    } else {
        audio.pause();
        cancelAnimationFrame(raf);
        playIcon.innerHTML = '<i class="fas fa-play"></i>';
        playState = 'play';
    }
});

muteIcon.addEventListener('click', () => {
    if(muteState === 'unmute') {
        audio.muted = true;
        muteIcon.innerHTML = '<i class="fas fa-volume-mute"></i>';
        muteState = 'mute';
    } else {
        audio.muted = false;
        muteIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
        muteState = 'unmute';
    }
});

const showRangeProgress = (rangeInput) => {
    if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}

seekSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});

volumeSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});

const audio = document.querySelector('audio');
const durationContainer = document.getElementById('duration');
const currentTimeContainer = document.getElementById('current-time');
const outputContainer = document.getElementById('volume-output');
let raf = null;

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

let audioSrc = "mp3/어떻게 지내.mp3";
const fileLength = audioSrc.length;
const firstSlash = audioSrc.indexOf('/');
const lastDot = audioSrc.lastIndexOf('.');
const fileName = audioSrc.substring(firstSlash+1,lastDot);
const currentFileName = document.querySelector('#currentFileName');

audio.src = audioSrc;
currentFileName.innerHTML = fileName;

const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio.duration);
}

const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration);
}

const displayBufferedAmount = () => {
    if(audio.buffered.length > 0){
        const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
        audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
    }
}

const whilePlaying = () => {
    seekSlider.value = Math.floor(audio.currentTime);
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
    raf = requestAnimationFrame(whilePlaying);
}

if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
} else {
    audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
    });
}

audio.addEventListener('progress', displayBufferedAmount);

seekSlider.addEventListener('input', () => {
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    if(!audio.paused) {
        cancelAnimationFrame(raf);
    }
});

seekSlider.addEventListener('change', () => {
    audio.currentTime = seekSlider.value;
    if(!audio.paused) {
        requestAnimationFrame(whilePlaying);
    }
});

volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    outputContainer.textContent = value;
    audio.volume = value / 100;
});

//console.log(audio)