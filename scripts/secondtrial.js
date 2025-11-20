const timer = 30;
let messageStrings;
let dialogbox;
let currMessage;
let messageId;
let applytitlestyle = true;
let loadingComplete = true;
let skipNextPress = false;
let isMessageSkipped = false;
const STORAGE_KEY = "myRegistrationGameState";
const playerData = JSON.parse(localStorage.getItem("contestants"));

const CLOUDINARY_IMAGE_URLS = [
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023753/RIPPLE_0000_CHAR-_0001_Capa-14_kqirac.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023753/RIPPLE_0001_CHAR-_0002_Capa-12_k4iunv.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0004_CHAR-_0005_Capa-6_mszms8.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0003_CHAR-_0004_Capa-7_rjeh5s.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0006_CHAR-_0007_Capa-10_v6tmdw.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0007_CHAR-_0008_Capa-9_mdfroc.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0005_CHAR-_0006_Capa-8_y10w3s.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0002_CHAR-_0003_Capa-11_l0bqce.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023757/RIPPLE_0026_CHAR-_0000_Capa-15_hwg0i1.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023997/human13_3_fawtvf.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024100/human10_3_u4bhhr.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024101/human11_3_worvg4.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024101/human12_3_ew26jd.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024101/human14_3_omdjsg.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024103/human15_3_ngsfyp.png",
    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024103/human16_3_awsji6.png",
];

let arrow = document.createElement("div");
arrow.id = "arrow";
let readyToStartRaffle = false;
let isRaffleStarted = false;
let raffleFinished = false;
const POST_RAFFLE_REDIRECT = "../main/thirdtrial.html";

function returnHome() {
    stopMusic();
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Returning to the homepage",
                timer: 1000,
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            }).then(() => {
                window.location.href = "welcome.html";
            });
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
    if (messageId >= messageStrings.length) {
        messageId = messageStrings.length - 1;
    }

    currMessage = messageStrings[messageId];
    readyToStartRaffle = messageId === messageStrings.length - 1;
    normalStyle();
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
    let highestTimeoutId = setTimeout(";");
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
}
let raffleSystem = null;
function animateRaffle() {
    if (!raffleSystem) {
        raffleSystem = new RaffleSystem({
            playerBoxSelector: ".character-image", // Selector CSS de los elementos
            totalPlayers: 8, // Total de jugadores
            winnersCount: 4, // Cantidad a seleccionar
            animationDuration: 2000, // Duración de la animación
            selectedClass: "selected", // Clase CSS para seleccionados
            glowColor: "gold", // Color del brillo
        });
        raffleSystem.init();
    }
    raffleSystem.start((selectedIndices) => {
        console.log("Sorteo completado. Índices seleccionados:", selectedIndices);
        raffleFinished = true;
        isRaffleStarted = false;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const state = raw ? JSON.parse(raw) : { contestants: [] };
            state.contestants = state.contestants || [];
            const winners = selectedIndices
                .map((idx) => state.contestants[idx])
                .filter(Boolean);
            winners.forEach((w) => {
                if (w) w.secondTrialCompleted = true;
            });
            state.contestants = winners;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("Error actualizando myRegistrationGameState:", e);
        }
        try {
            if (dialogbox) {
                dialogbox.innerHTML = "The final four. Only the strongest will reign.";
                if (!dialogbox.contains(arrow)) {
                    dialogbox.appendChild(arrow);
                }
                loadingComplete = true;
                arrow.classList.remove("raffle-ready");
            }
        } catch (err) {
            console.warn("Could not update dialogbox after raffle:", err);
        }
    });
}

document.addEventListener(
    "DOMContentLoaded",
    function () {
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
                   style="--bg-color: ${player.color}; --bg-color-dark: ${player.color
                    };"
                   id="playerBox${index + 1}">
                <img class="principal-img" src="${player.imagePath ||
                    "https://res.cloudinary.com/dhbjoltyy/image/upload/v1762157417/RIPPLE_0026_CHAR-_0000_Capa-15_nt6xrt.png"
                    }"
                     alt="${player.name}">
            </div>
            <div class="character-name">${player.name}</div>
            `;
                grid.appendChild(card);
            });
        }

        dialogbox = document.getElementById("dialogbox");
        let messageString = dialogbox.innerHTML.replace(/\s+/g, " ").trim();

        messageStrings = messageString.split("||").map((msg) => msg.trim());
        dialogbox.innerHTML = "";
        messageId = 0;
        currMessage = messageStrings[messageId];
        nextMessage();

        document
            .getElementById("dialogbox")
            .addEventListener("click", function (e) {
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

        initAudio("../assets/sounds/MusicForm.mp3");

        const musicChoice = localStorage.getItem("musicEnabled");
        const icon = document.querySelector("#muteBtn i");

        if (musicChoice === "true") {
            isMuted = false;
            if (icon) {
                icon.classList.remove("fa-volume-xmark");
                icon.classList.add("fa-volume-high");
            }
            playAudio();
        } else if (musicChoice === "false") {
            isMuted = true;
            if (icon) {
                icon.classList.add("fa-volume-xmark");
                icon.classList.remove("fa-volume-high");
            }
        } else {
            isMuted = true;
            if (icon) {
                icon.classList.add("fa-volume-xmark");
            }
        }
    },
    false
);
