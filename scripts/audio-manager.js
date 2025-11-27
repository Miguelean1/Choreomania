let backgroundMusic = null;
let isMuted = true;

function initAudio(audioPath, shouldLoop = true) {
    if (backgroundMusic) return;

    backgroundMusic = new Audio(audioPath);
    backgroundMusic.loop = shouldLoop;
    backgroundMusic.volume = 0.3;
}

function playAudio() {
    if (!backgroundMusic) return;

    isMuted = false;
    const icon = document.querySelector("#muteBtn i");
    if (icon) {
        icon.classList.remove("fa-volume-xmark");
        icon.classList.add("fa-volume-high");
    }
    localStorage.setItem("musicEnabled", "true");
    console.log('UI en "ON". Guardado: true');

    const playPromise = backgroundMusic.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log("Audio correct");
            })
            .catch((error) => {
                console.warn('Autoplay blocked, UI on');
            });
    }
}

function pauseAudio() {
    if (!backgroundMusic) return;

    backgroundMusic.pause();

    isMuted = true;
    const icon = document.querySelector("#muteBtn i");
    if (icon) {
        icon.classList.add("fa-volume-xmark");
        icon.classList.remove("fa-volume-high");
    }

    localStorage.setItem("musicEnabled", "false");
}

function muteMusic() {
    console.log("Mute button active");
    if (isMuted) {
        playAudio();
    } else {
        pauseAudio();
    }
}

function stopMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}

let rafflePlayed = false;
function playRaffleSound() {
    try {
        const raffleAudio = new Audio("../assets/sounds/raffleSound.mp3");
        raffleAudio.play().catch((err) => {
            console.warn("Unable to reproduce raffle", err);
        });
    } catch (e) {
        console.warn("Error at creating raffle sound:", e);
    }
}
module.exports = {
    initAudio,
    playAudio,
    pauseAudio,
    muteMusic,
    stopMusic,
    playRaffleSound
};
