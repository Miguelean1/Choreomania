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
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417864/human1_cb8b7k.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417864/human2_xymp1q.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human3_snt7pj.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human4_sw23h1.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human5_u2tkyw.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human6_qqj6c0.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human7_wnbwzt.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417864/human8_cpb8ny.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human9_zhmccs.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human12_vmwigz.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human10_kxw3mj.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human11_fpndst.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human14_yawyal.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449704/human13_vxfblm.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human16_l27dtq.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human15_eyc0jx.png',
];

var arrow = document.createElement("div");
arrow.id = "arrow";
var readyToStartRaffle = false;
var isRaffleStarted = false;

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("charactersGrid");

    let storedData;

    try {
        storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)); // usa la misma key que STORAGE_KEY
    } catch (error) {
        console.error("Error leyendo localStorage:", error);
        storedData = null;
    }

    // Asegurarse de que existe y tiene contestants
    const players = storedData?.contestants ?? [];

    if (players.length === 0) {
        grid.innerHTML = "<p>No hay jugadores guardados.</p>";
        return;
    }

    players.forEach((player, index) => {
        const card = document.createElement("div");
        card.classList.add("character-card");

        card.innerHTML = `
      <div class="character-image"
           style="--bg-color: ${player.color}; --bg-color-dark: ${player.color};"
           id="playerBox${index + 1}">
        <img src="${player.imagePath || 'https://res.cloudinary.com/dhbjoltyy/image/upload/v1762157417/RIPPLE_0026_CHAR-_0000_Capa-15_nt6xrt.png'}"
             alt="${player.name}">
      </div>
      <div class="character-name">${player.name}</div>
    `;

        grid.appendChild(card);
    });
});


arrow.addEventListener("click", function (e) {
    e.stopPropagation();
    if (readyToStartRaffle && loadingComplete && !isRaffleStarted) {
        isRaffleStarted = true;
        animateRaffle();
    } else if (loadingComplete && !isRaffleStarted) {
        nextMessage();
    }
});

document.addEventListener(
    "DOMContentLoaded",
    function () {
        dialogbox = document.getElementById("dialogbox");
        var messageString = dialogbox.innerHTML.replace(/\s+/g, " ").trim();

        messageStrings = messageString.split("||").map((msg) => msg.trim());
        dialogbox.innerHTML = "";
        messageId = 0;
        currMessage = messageStrings[messageId];
        nextMessage();

        document.getElementById("dialogbox").addEventListener("click", function (e) {

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
    },
    false
);

function returnHome() {
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

function muteMusic() {
    const icon = document.querySelector("#muteBtn i");
    icon.classList.toggle("fa-volume-xmark");
    icon.classList.toggle("fa-volume-high");
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

    if (messageId >= messageStrings.length) {
        messageId = 0;
    }

    currMessage = messageStrings[messageId];


    readyToStartRaffle = (messageId === messageStrings.length - 1);


    normalStyle();

    messageId++;
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
        console.log('Sorteo completado. Índices seleccionados:', selectedIndices);
        // Aquí puedes agregar lógica adicional después del sorteo si es necesario
    });
}

