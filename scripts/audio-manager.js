let backgroundMusic = null;
let isMuted = true; 

function initAudio(audioPath) {
    if (backgroundMusic) return;
    
    backgroundMusic = new Audio(audioPath);
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    console.log('Audio inicializado para esta página.');
}

function playAudio() {
    if (!backgroundMusic) return;

    // --- ¡ESTA ES LA LÓGICA CORREGIDA! ---

    // 1. PRIMERO, actualizamos la UI y guardamos la elección (Optimista)
    isMuted = false;
    const icon = document.querySelector('#muteBtn i');
    if (icon) {
        icon.classList.remove('fa-volume-xmark');
        icon.classList.add('fa-volume-high');
    }
    localStorage.setItem('musicEnabled', 'true');
    console.log('UI en "ON". Guardado: true');

    // 2. SEGUNDO, intentamos reproducir el audio
    const playPromise = backgroundMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Éxito: El audio está sonando
            console.log('Audio reproduciéndose con éxito.');
        }).catch(error => {
            // Fallo (Autoplay bloqueado):
            // NO HACEMOS NADA. Dejamos el icono en "ON".
            console.warn('Autoplay bloqueado, pero la UI se mantiene en "ON".');
        });
    }
}

function pauseAudio() {
    if (!backgroundMusic) return;

    backgroundMusic.pause();
    
    isMuted = true;
    const icon = document.querySelector('#muteBtn i');
    if (icon) {
        icon.classList.add('fa-volume-xmark');
        icon.classList.remove('fa-volume-high');
    }
    
    localStorage.setItem('musicEnabled', 'false');
    console.log('Audio Pausado. Guardado: false');
}

function toggleMute() {
    console.log('Botón toggleMute pulsado.');
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