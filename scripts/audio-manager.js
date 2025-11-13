let backgroundMusic = null;
let isMuted = false; 

function initMusic(audioPath) {   
    if (backgroundMusic) return; 

    backgroundMusic = new Audio(audioPath);
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    const playPromise = backgroundMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
        }).catch(error => {
            console.warn('El autoplay fue bloqueado por el navegador.');
        });
    }
}

function muteMusic() {
    if (!backgroundMusic) {
        console.error('El objeto de audio no se ha inicializado.');
        return; 
    }

    const icon = document.querySelector('#muteBtn i');
    isMuted = !isMuted; 

    if (isMuted) {   
        backgroundMusic.pause();
        icon.classList.remove('fa-volume-high');
        icon.classList.add('fa-volume-xmark');
    } else {
        backgroundMusic.play().catch(error => {
            console.error('Error al reproducir el audio:', error);
            isMuted = true; 
        });
        
        icon.classList.remove('fa-volume-xmark');
        icon.classList.add('fa-volume-high');
    }
}       

function stopMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}