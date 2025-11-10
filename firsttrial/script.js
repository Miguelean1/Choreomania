const timer = 30;
var messageStrings;
var dialogbox;
var currMessage;
var messageId;
var applytitlestyle = true;
var loadingComplete = true;
var skipNextPress = false;
let isMessageSkipped = false;

var arrow = document.createElement("div");
arrow.id = "arrow";

document.addEventListener(
    "DOMContentLoaded",
    function () {
        dialogbox = document.getElementById("dialogbox");
        var messageString = dialogbox.innerHTML.replace(/\s+/g, " ").trim();
        // Dividir por || para separar mensajes
        messageStrings = messageString.split("||").map((msg) => msg.trim());
        dialogbox.innerHTML = "";
        messageId = 0;
        currMessage = messageStrings[messageId];
        nextMessage();

        document.getElementById("dialogbox").addEventListener("click", function () {
            if (!loadingComplete) {
                clearTimeouts();
                dialogbox.innerHTML = currMessage;
                if (!dialogbox.contains(arrow)) {
                    dialogbox.appendChild(arrow);
                }
                loadingComplete = true;
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

    // Si llegamos al final, volver al principio
    if (messageId >= messageStrings.length) {
        messageId = 0;
    }

    currMessage = messageStrings[messageId];

    // Siempre aplicar normal-style (que tiene negrita)
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

// Utils para aleatorio
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Obtén todos los playerBox (del 1 al 16)
const playerBoxes = [];
for (let i = 1; i <= 16; i++) {
    playerBoxes.push(document.getElementById(`playerBox${i}`));
}

const shadowColors = [
    "rgba(255, 107, 157, 0.7)",
    "rgba(254, 202, 87, 0.7)",
    "rgba(162, 155, 254, 0.7)",
    "rgba(95, 39, 205, 0.7)",
    "rgba(196, 69, 105, 0.7)",
    "rgba(238, 90, 111, 0.7)",
    "rgba(108, 92, 231, 0.7)",
    "rgba(76, 201, 240, 0.7)",
];

// Efecto "raffle"
function animateRaffle() {
    // Limpia shadows previas
    playerBoxes.forEach((box) => (box.style.boxShadow = ""));

    // Animación de brillos random
    let interval = setInterval(() => {
        playerBoxes.forEach((box) => {
            const color = shadowColors[getRandomInt(0, shadowColors.length - 1)];
            box.style.boxShadow = `0 0 25px 6px ${color}`;
        });
    }, 150);

    // Tras tiempo, selecciona 8 aleatorios y detiene animación
    setTimeout(() => {
        clearInterval(interval);
        playerBoxes.forEach((box) => (box.style.boxShadow = "")); // Limpia todos

        // Elige 8 únicos aleatorios
        let selectedIndices = [];
        while (selectedIndices.length < 8) {
            let idx = getRandomInt(0, playerBoxes.length - 1);
            if (!selectedIndices.includes(idx)) selectedIndices.push(idx);
        }

        playerBoxes.forEach((box, idx) => {
            if (selectedIndices.includes(idx)) {
                box.classList.add("selected");
                box.style.boxShadow = "0 0 10px 5px gold";
            } else {
                box.classList.remove("selected");
                box.style.boxShadow = "";
            }
        });
    }, 2000);
}

document.querySelector(".raffle-btn").addEventListener("click", animateRaffle);
