const STORAGE_KEY = 'myRegistrationGameState';
const timer = 30;
var messageStrings;
var dialogbox;
var currMessage;
var messageId;
var applytitlestyle = true;
var loadingComplete = true;
var skipNextPress = false;
let isMessageSkipped = false;
const playerData = JSON.parse(localStorage.getItem('contestants'))

const CLOUDINARY_IMAGE_URLS = [
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023753/RIPPLE_0000_CHAR-_0001_Capa-14_kqirac.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023753/RIPPLE_0001_CHAR-_0002_Capa-12_k4iunv.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0004_CHAR-_0005_Capa-6_mszms8.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0003_CHAR-_0004_Capa-7_rjeh5s.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0006_CHAR-_0007_Capa-10_v6tmdw.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0007_CHAR-_0008_Capa-9_mdfroc.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0005_CHAR-_0006_Capa-8_y10w3s.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0002_CHAR-_0003_Capa-11_l0bqce.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023757/RIPPLE_0026_CHAR-_0000_Capa-15_hwg0i1.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023997/human13_3_fawtvf.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024100/human10_3_u4bhhr.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024101/human11_3_worvg4.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024101/human12_3_ew26jd.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024101/human14_3_omdjsg.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024103/human15_3_ngsfyp.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024103/human16_3_awsji6.png',
];

var arrow = document.createElement("div");
arrow.id = "arrow";
var readyToStartRaffle = false;
var isRaffleStarted = false;
var raffleFinished = false;
// Ruta a la que redirigir cuando termine el sorteo. Cámbiala según necesites.
const POST_RAFFLE_REDIRECT = '../main/secondtrial.html';

arrow.addEventListener("click", function (e) {
    e.stopPropagation();
    if (readyToStartRaffle && loadingComplete && !isRaffleStarted) {
        isRaffleStarted = true;
        animateRaffle();
    } else if (loadingComplete && !isRaffleStarted) {
        nextMessage();
    }
});

function returnHome() {
    stopMusic();
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
}

function titleStyle() {
    dialogbox.classList.remove("normal-style");
    dialogbox.classList.add("title-style");
}

function normalStyle() {
    dialogbox.classList.remove("title-style");
    dialogbox.classList.add("normal-style");
}

function nextMessage() {
    if (!loadingComplete || skipNextPress) {
        skipNextPress = false;
        return;
    }

    // Si messageId está fuera de rango (por algún motivo), lo ajustamos
    if (messageId >= messageStrings.length) {
        messageId = messageStrings.length - 1;
    }

    currMessage = messageStrings[messageId];

    // Determinar si estamos en el último mensaje (preparado para sorteo)
    readyToStartRaffle = (messageId === messageStrings.length - 1);

    normalStyle();

    // Solo incrementamos si NO estamos en el último mensaje.
    // De esta forma, al llegar al último mensaje y activar el sorteo,
    // no volveremos a reiniciar el texto desde el principio.
    if (!readyToStartRaffle) {
        messageId++;
    }

    loadMessage(currMessage.split(""));
}

function loadMessage(dialog) {
    loadingComplete = false;
    dialogbox.innerHTML = "";
    for (let i = 0; i < dialog.length; i++) {
        setTimeout(function () {
            dialogbox.innerHTML += dialog[i];
            if (i === dialog.length - 1) {
                dialogbox.appendChild(arrow);
                loadingComplete = true;
                if (readyToStartRaffle) {
                    arrow.classList.add("raffle-ready");
                } else {
                    arrow.classList.remove("raffle-ready");
                }
            }
        }, timer * i);
    }
}

document.addEventListener("keydown", function (e) {
    if (
        (e.key === "Enter" || e.key === " ") &&
        !loadingComplete &&
        !isMessageSkipped
    ) {
        clearTimeouts();
        dialogbox.innerHTML = currMessage;
        if (!dialogbox.contains(arrow)) {
            dialogbox.appendChild(arrow);
        }
        loadingComplete = true;
        isMessageSkipped = true;
    }
});

document.addEventListener("keyup", function (e) {
    if ((e.key === "Enter" || e.key === " ") && loadingComplete) {
        if (!isMessageSkipped) {
            nextMessage();
        }
        isMessageSkipped = false;
    }
});

function clearTimeouts() {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
}

// ============================================
// SISTEMA DE SORTEO (usando módulo raffle.js)
// ============================================

// Inicializar el sistema de sorteo cuando el DOM esté listo
let raffleSystem = null;

// Función wrapper para mantener compatibilidad con el código existente
function animateRaffle() {
    if (!raffleSystem) {
        // Inicializar el sistema de sorteo con la configuración actual
        raffleSystem = new RaffleSystem({
            playerBoxSelector: '.character-image', // Selector CSS de los elementos
            totalPlayers: 16,                      // Total de jugadores
            winnersCount: 8,                       // Cantidad a seleccionar
            animationDuration: 2000,               // Duración de la animación
            selectedClass: 'selected',             // Clase CSS para seleccionados
            glowColor: 'gold'                      // Color del brillo
        });
        raffleSystem.init();
    }

    // Ejecutar el sorteo
    raffleSystem.start((selectedIndices) => {
        console.log('Raffle completed. Selected indices:', selectedIndices);
        // Marcar el sorteo como finalizado y permitir que el usuario haga clic
        // en el dialogbox para continuar (redirigir al componente destino).
        raffleFinished = true;
        isRaffleStarted = false;
        // Actualizar `myRegistrationGameState` para conservar solo los ganadores
        try {
            // Leer el estado guardado bajo STORAGE_KEY
            const raw = localStorage.getItem(STORAGE_KEY);
            const state = raw ? JSON.parse(raw) : { contestants: [] };

            // Asegurarnos de que existe un array de contestants
            state.contestants = state.contestants || [];

            // Construir array de ganadores a partir de los índices seleccionados
            const winners = selectedIndices
                .map((idx) => state.contestants[idx])
                .filter(Boolean);

            // Marcar que han completado el primer sorteo (opcional)
            winners.forEach((w) => {
                if (w) w.firstTrialCompleted = true;
            });

            // Reemplazar el array de contestants por los ganadores
            state.contestants = winners;

            // Guardar de vuelta únicamente bajo STORAGE_KEY (no crear nuevas claves)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Error actualizando myRegistrationGameState tras el sorteo:', e);
        }
        try {
            if (dialogbox) {
                dialogbox.innerHTML = 'The competition moves forward. Only the determined will stay in the game.';
                if (!dialogbox.contains(arrow)) {
                    dialogbox.appendChild(arrow);
                }
                loadingComplete = true;
                arrow.classList.remove('raffle-ready');
            }
        } catch (err) {
            console.warn('Could not update the dialogbox after the raffle:', err);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Lógica de cargar jugadores (del primer bloque)
    const grid = document.getElementById("charactersGrid");
    let storedData;
    try {
        storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (error) {
        console.error("Error leyendo localStorage:", error);
        storedData = null;
    }
    const players = storedData?.contestants ?? [];
    if (players.length === 0) {
        grid.innerHTML = "<p>No hay jugadores guardados.</p>";
    } else {
        players.forEach((player, index) => {
            const card = document.createElement("div");
            card.classList.add("character-card");
            card.innerHTML = `
          <div class="character-image"
               style="--bg-color: ${player.color}; --bg-color-dark: ${player.color};"
               id="playerBox${index + 1}">
            <img class="principal-img" src="${player.imagePath || 'https://res.cloudinary.com/dhbjoltyy/image/upload/v1762157417/RIPPLE_0026_CHAR-_0000_Capa-15_nt6xrt.png'}"
                 alt="${player.name}">
          </div>
          <div class="character-name">${player.name}</div>
        `;
            grid.appendChild(card);
        });
    }

    // 2. Lógica de diálogo (del segundo bloque)
    dialogbox = document.getElementById("dialogbox");
    var messageString = dialogbox.innerHTML.replace(/\s+/g, " ").trim();

    messageStrings = messageString.split("||").map((msg) => msg.trim());
    dialogbox.innerHTML = "";
    messageId = 0;
    currMessage = messageStrings[messageId];
    nextMessage();

    document.getElementById("dialogbox").addEventListener("click", function (e) {
        if (isRaffleStarted) {
            e.stopPropagation();
            return;
        }
        if (raffleFinished) {
            stopMusic();
            window.location.href = POST_RAFFLE_REDIRECT;
            return;
        }
        if (!loadingComplete) {
            clearTimeouts();
            dialogbox.innerHTML = currMessage;
            if (!dialogbox.contains(arrow)) {
                dialogbox.appendChild(arrow);
            }
            loadingComplete = true;
        } else if (readyToStartRaffle && loadingComplete && !isRaffleStarted) {
            isRaffleStarted = true;
            e.stopPropagation();
            animateRaffle();
        } else if (!skipNextPress) {
            nextMessage();
        } else {
            skipNextPress = false;
        }
    });

    // 3. Lógica de audio (El Patrón)
    initAudio('../assets/sounds/WelcomeMusic.mp3'); 

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



