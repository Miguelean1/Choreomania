const timer = 30;
var messageStrings;
var dialogbox;
var currMessage;
var messageId;
var applytitlestyle = false;
var loadingComplete = true;
var activeTimeouts = [];
let thunderPlayed = false;

var arrow = document.createElement("div");
arrow.id = "arrow";

function clearAllTimeouts() {
    activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeTimeouts = [];
}

function playThunderOnce() {
    if (thunderPlayed) return;
    thunderPlayed = true;
    try {
        const thunderAudio = new Audio('../assets/sounds/laugh.mp3');
        thunderAudio.loop = false;
        thunderAudio.preload = 'auto';
        thunderAudio.play().catch(err => {
            console.warn('No se pudo reproducir thunder:', err);
        });
    } catch (e) {
        console.warn('Error creando audio de thunder:', e);
    }
}

function nextScreen() {
    stopMusic();
    clearAllTimeouts();


    const overlay = document.createElement('div');
    overlay.id = 'flash-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: '#ffffff',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '2147483647',
        transition: 'opacity 80ms linear'
    });
    document.body.appendChild(overlay);

    const sequence = [
        { delay: 0,    opacity: '1' },
        { delay: 100,  opacity: '0' },
        { delay: 200,  opacity: '1' },
        { delay: 300,  opacity: '0' },
        { delay: 380,  opacity: '1' },
        { delay: 480,  opacity: '0' },
        { delay: 580,  opacity: '1' },
        { delay: 680,  opacity: '0' },
        { delay: 780,  opacity: '1' },
        { delay: 880,  opacity: '0' },
        { delay: 980,  opacity: '1' },
        { delay: 1080,  opacity: '0' },
        { delay: 1180,  opacity: '1' },
        { delay: 1280,  opacity: '0' },
        { delay: 1380,  opacity: '1' },
        { delay: 1480,  opacity: '0' },
        { delay: 1580,  opacity: '1' },
        { delay: 1680,  opacity: '0' },
        { delay: 1780,  opacity: '1' },
        { delay: 1880,  opacity: '0' },
        { delay: 1980,  opacity: '1' },

    ];

    const flashImageUrl = 'https://res.cloudinary.com/dsy30p7gf/image/upload/v1763033689/Two_faced_Benefactor_aqmvq8.png';

    const forcedPattern = [true, false];
    sequence.forEach((step, idx) => {
        const patternValue = forcedPattern[idx % forcedPattern.length];
        step.showImage = (step.opacity === '1') && (!!patternValue);
    });

    playThunderOnce();

    sequence.forEach(step => {
        const id = setTimeout(() => {
            overlay.style.opacity = step.opacity;

            if (step.showImage && step.opacity === '1') {
                overlay.style.backgroundImage = `url('${flashImageUrl}')`;
                overlay.style.backgroundColor = 'transparent';
            } else {

                overlay.style.backgroundImage = 'none';
                overlay.style.backgroundColor = '#000000ff';
            }
        }, step.delay);
        activeTimeouts.push(id);
    });


    const navigateTimeout = setTimeout(() => {
        window.location.href = '../main/credits.html';
    }, 2000);
    activeTimeouts.push(navigateTimeout);
}

function returnHome() {ç
    stopMusic();
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: '#ffffff',
        color: '#000000'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: "Saved!", icon: "success", background: '#ffffff', color: '#000000' });
        } else if (result.isDenied) {
            Swal.fire({ title: "Changes are not saved", icon: "info", background: '#ffffff', color: '#000000' });
        }
    });
}



function titleStyle() {
    dialogbox.classList.remove('normal-style');
    dialogbox.classList.add('title-style');
}

function normalStyle() {
    dialogbox.classList.remove('title-style');
    dialogbox.classList.add('normal-style');
}

function finalStyle() {
    dialogbox.classList.remove('title-style', 'normal-style');
    dialogbox.classList.add('final-style');
}

function loadMessage(dialog) {
    loadingComplete = false;
    dialogbox.innerHTML = "";
    
    let i = 0;
    function animateChar() {
        if (i < dialog.length) {
            dialogbox.innerHTML += dialog.charAt(i);
            i++;
            let timeoutId = setTimeout(animateChar, timer);
            activeTimeouts.push(timeoutId);
        } else {
            dialogbox.innerHTML += "<br>";
            if (!dialogbox.contains(arrow)) {
                dialogbox.appendChild(arrow);
            }
            loadingComplete = true;
            activeTimeouts = [];
        }
    }
    animateChar();
}

function nextMessage() {
    if (!loadingComplete) {
        return;
    }
    
    if (messageId >= messageStrings.length) {
        messageId = 0;
    }

    const selectedIndex = messageId;
    currMessage = messageStrings[selectedIndex];
    messageId++;

    if (selectedIndex === messageStrings.length - 1) {
        finalStyle();
    } else if (applytitlestyle) {
        if (selectedIndex === 0 || selectedIndex === messageStrings.length - 1) {
            titleStyle();
        } else {
            normalStyle();
        }
    } else {
        normalStyle();
    }

    loadMessage(currMessage);
}

document.addEventListener("DOMContentLoaded", function() {
    dialogbox = document.getElementById("dialogbox");
    var messageString = dialogbox.innerHTML.replace(/\s+/g, ' ').trim();
    messageStrings = messageString.split('|');
    
    messageId = 0;
    currMessage = messageStrings[messageId];
    messageId++;
    
    dialogbox.innerHTML = "";
    loadMessage(currMessage);
    
    dialogbox.addEventListener("click", function() {
        if (!loadingComplete) {
            clearAllTimeouts();
            dialogbox.innerHTML = currMessage + "<br>";
            if (!dialogbox.contains(arrow)) {
                dialogbox.appendChild(arrow);
            }
            loadingComplete = true;
        } else {
            if (messageId >= messageStrings.length) {
                nextScreen();
            } else {
                nextMessage();
            }
        }
    });

    initAudio('../assets/sounds/PLOT_TWIST_STATIC.mp3', false); 

    const musicChoice = localStorage.getItem('musicEnabled');
    const icon = document.querySelector('#muteBtn i');

    if (musicChoice === 'true') {
        isMuted = false;
        if (icon) {
            icon.classList.remove('fa-volume-xmark');
            icon.classList.add('fa-volume-high');
        }
        playAudio(); 
    } else if (musicChoice === 'false') {
        isMuted = true;
        if (icon) {
            icon.classList.add('fa-volume-xmark');
            icon.classList.remove('fa-volume-high');
        }
    } else {
        isMuted = true;
        if (icon) {
            icon.classList.add('fa-volume-xmark');
        }
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        
        if (!loadingComplete) {
            clearAllTimeouts();
            dialogbox.innerHTML = currMessage + "<br>";
            if (!dialogbox.contains(arrow)) {
                dialogbox.appendChild(arrow);
            }
            loadingComplete = true;
        }
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        
        if (loadingComplete) {
            if (messageId >= messageStrings.length) {
                nextScreen();
            } else {
                nextMessage();
            }
        }
    }
});

