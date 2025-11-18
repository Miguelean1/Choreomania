const timer = 30;
const STORAGE_KEY = 'myRegistrationGameState';
var messageStrings;
var dialogbox;
var currMessage;
var messageId;
var applytitlestyle = false;
var loadingComplete = true;
var activeTimeouts = [];

var arrow = document.createElement("div");
arrow.id = "arrow";
let thunderPlayed = false;

function playThunderOnce() {
    if (thunderPlayed) return;
    thunderPlayed = true;
    try {
        const thunderAudio = new Audio('../assets/sounds/thunder.mp3');
        thunderAudio.loop = false;
        thunderAudio.preload = 'auto';
        thunderAudio.play().catch(err => {
            console.warn('No se pudo reproducir thunder:', err);
        });
    } catch (e) {
        console.warn('Error creando audio de thunder:', e);
    }
}

function clearAllTimeouts() {
    activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeTimeouts = [];
}


function returnHome() {
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
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '2147483647',
        transition: 'opacity 80ms linear'
    });
    document.body.appendChild(overlay);


    const totalDuration = 2000;


    const sequence = [
        { delay: 0, opacity: '1' },
        { delay: 150, opacity: '0' },
        { delay: 300, opacity: '1' },
        { delay: 450, opacity: '0' },
        { delay: 600, opacity: '1' },
        { delay: 750, opacity: '0' },
        { delay: 900, opacity: '1' },
        { delay: 1050, opacity: '0' },
        { delay: 1200, opacity: '1' },
        { delay: 1350, opacity: '0' },
        { delay: 1500, opacity: '1' },
        { delay: 1650, opacity: '0' },
        { delay: 1800, opacity: '1' },
        { delay: 1950, opacity: '0' },
        { delay: 2000, opacity: '1' }
    ];


    playThunderOnce();

    sequence.forEach(step => {
        const id = setTimeout(() => {
            overlay.style.opacity = step.opacity;
        }, step.delay);
        activeTimeouts.push(id);
    });


    const navigateTimeout = setTimeout(() => {
        window.location.href = 'final-raffle-2.html';
    }, totalDuration + 200);
    activeTimeouts.push(navigateTimeout);
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
        nextScreen();
        return;
    }

    currMessage = messageStrings[messageId];
    messageId++;

    if (applytitlestyle) {
        if (messageId == 1 || messageId == messageStrings.length) {
            titleStyle();
        } else {
            normalStyle();
        }
    }

    loadMessage(currMessage);
}

document.addEventListener('keydown', function (e) {
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

document.addEventListener('keyup', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();

        if (loadingComplete) {
            nextMessage();
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {

    try {
        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
        const players = storedData?.contestants ?? [];

        if (players.length > 0) {
            const grid = document.getElementById("characters-stage");
            if (grid) {
                players.forEach((player, index) => {
                    const card = document.createElement('div');
                    card.className = 'character-card';
                    card.innerHTML = `
                    <div class="character-name">${player.name}</div>
                        <div class="character-image" style="--bg-color: ${player.color}; --bg-color-dark: ${player.color};" id="playerBox${index + 1}">
                            <img class="principal-img" src="${player.imagePath}" alt="${player.name}">
                        </div>
                        
                    `;
                    grid.appendChild(card);
                });
            }
        }
    } catch (e) {
        console.error('Error cargando personajes:', e);
    }



    dialogbox = document.getElementById("dialogbox");
    var messageString = dialogbox.innerHTML.replace(/\s+/g, ' ').trim();
    messageStrings = messageString.split('|');

    messageId = 0;
    currMessage = messageStrings[messageId];
    messageId++;

    dialogbox.innerHTML = "";
    loadMessage(currMessage);

    dialogbox.addEventListener("click", function () {
        if (!loadingComplete) {
            clearAllTimeouts();
            dialogbox.innerHTML = currMessage + "<br>";
            if (!dialogbox.contains(arrow)) {
                dialogbox.appendChild(arrow);
            }
            loadingComplete = true;
        } else {
            nextMessage();
        }
    });

    initAudio('../assets/sounds/MusicFormCheer.mp3');

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
}, false);



