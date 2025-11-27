const paragraphs = [
    "Year 2047. Earth no longer belongs to us. From the ruins of a dying world came the Lagomorph Sapiens: humanoid rabbits born from a failed experiment. They spread fast, too fast, and within months they ruled everything.",
    "Obsessed with disco music and flashy attires, cities became their stages. Humans were forced to dance for them, day and night, trapped in an endless rhythm under their glowing eyes. Those who stopped… disappeared.",
    "But once a year, the music pauses. The mysterious Benefactor interrupts every broadcast, offering a single escape: one ticket aboard the New Esperanza, a ship bound for Saturn and freedom from the rabbits' reign.",
    "Sixteen are chosen. Four deadly trials await. Only one will earn the right to ascend.",
    "Now, the world watches. The Ceremony of Ascension begins. Will you rise to the stars… or keep dancing for their pleasure?",
];

const textBox = document.getElementById("textBox");
const buttonContainer = document.getElementById("buttonContainer");
const progressDots = document.querySelectorAll(".dot");
const backgrounds = document.querySelectorAll(".background");
const arrow = document.getElementById("arrow");


if (arrow) arrow.style.display = "none";

let currentParagraphIndex = 0;
let currentText = "";
let charIndex = 0;
let speed = 50;
let isTyping = false;
let autoTimers = [];

function updateProgressDots() {
    progressDots.forEach((dot, index) => {
        if (index === currentParagraphIndex) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

function updateBackground() {
    backgrounds.forEach((bg, index) => {
        if (index === currentParagraphIndex) {
            bg.classList.add("active");
        } else {
            bg.classList.remove("active");
        }
    });
}

function typeText() {
    if (charIndex < currentText.length) {
        isTyping = true;
        arrow.classList.remove("show");
        const p = textBox.querySelector("p") || document.createElement("p");
        if (!textBox.querySelector("p")) {
            textBox.appendChild(p);
        }

        p.textContent = currentText.substring(0, charIndex + 1);

        const cursor = document.createElement("span");
        cursor.className = "cursor";
        p.appendChild(cursor);

        charIndex++;

        setTimeout(() => {
            cursor.remove();
            typeText();
        }, speed);
    } else {
        isTyping = false;
        if (currentParagraphIndex < paragraphs.length - 1) {

        }
        if (currentParagraphIndex === paragraphs.length - 1) {
            setTimeout(() => {
                buttonContainer.classList.add("show");
            }, 500);
        }
    }
}

function nextParagraph() {
    if (isTyping) {
        const p = textBox.querySelector("p");
        if (p) {
            p.textContent = currentText;
        }
        isTyping = false;
        charIndex = currentText.length;

        if (currentParagraphIndex < paragraphs.length - 1) {

        }
        if (currentParagraphIndex === paragraphs.length - 1) {
            setTimeout(() => {
                buttonContainer.classList.add("show");
            }, 300);
        }
    } else if (currentParagraphIndex < paragraphs.length - 1) {
        arrow.classList.remove("show");
        currentParagraphIndex++;
        currentText = paragraphs[currentParagraphIndex];
        charIndex = 0;
        textBox.innerHTML = "";
        updateProgressDots();
        updateBackground();
        typeText();
    }
}

function clearAutoTimers() {
    autoTimers.forEach((t) => clearTimeout(t));
    autoTimers = [];
}

function startIntro() {

    speed = 80;
    currentText = paragraphs[0];
    updateProgressDots();
    updateBackground();
    typeText();
}

function showParagraph(index, durationMs = 2500) {

    currentParagraphIndex = index;
    currentText = paragraphs[index];
    charIndex = 0;
    textBox.innerHTML = "";

    speed = index === 0 ? 80 : 50;


    try {
        const bg = backgrounds[index];
        if (bg) {
            const transformDur = Math.max(300, Math.round(durationMs));
            const opacityDur = Math.min(800, transformDur);
            bg.style.transition = `opacity ${opacityDur}ms ease-in-out, transform ${transformDur}ms ease-out`;
        }
    } catch (e) {
        console.warn("Error applying background transition:", e);
    }

    updateProgressDots();
    updateBackground();
    typeText();
}

function returnHome() {
    stopMusic();

    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
        background: "#ffffff",
        color: "#000000",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Returning to the homepage",
                timer: 1000,
                showConfirmButton: false,
                allowOutsideClick: false,
                background: "#ffffff",
                color: "#000000",
                didOpen: () => {
                    Swal.showLoading();
                },
            }).then(() => {
                window.location.href = "welcome.html";
            });
        }
    });
}

function skipScene() {
    Swal.fire({
        title: "Are you sure you want to skip the intro?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: "#ffffffff",
        color: "#000000ff",
    }).then((result) => {
        if (result.isConfirmed) {
            nextScreen();
        }
    });
}

function nextScreen() {
    stopMusic();

    document.body.style.transition = "opacity 0.8s";
    document.body.style.opacity = "0";

    setTimeout(() => {
        window.location.href = "form.html";
    }, 800);
}

window.addEventListener("load", () => {
    setTimeout(startIntro, 1000);

    initAudio("../assets/sounds/INTRO_SPEECH.mp3", false);

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
});


function scheduleAutoProgression() {
    if (!backgroundMusic) {

        const per = 2500;
        let acc = 0;
        for (let i = 0; i < paragraphs.length; i++) {
            const t = setTimeout(() => showParagraph(i, per), acc);
            autoTimers.push(t);
            acc += per;
        }

        autoTimers.push(setTimeout(() => buttonContainer.classList.add("show"), acc + 300));
        return;
    }

    function startScheduling() {
        const duration = backgroundMusic.duration * 1000; // ms
        if (!isFinite(duration) || duration <= 0) {

            scheduleAutoProgression();
            return;
        }

        const lengths = paragraphs.map((p) => p.length);
        const total = lengths.reduce((a, b) => a + b, 0) || paragraphs.length;

        let acc = 0;
        for (let i = 0; i < paragraphs.length; i++) {
            const weight = lengths[i] || 1;
            const part = (weight / total) * duration;

            const t = setTimeout(() => showParagraph(i, part), acc);
            autoTimers.push(t);

            acc += part;
        }


        autoTimers.push(setTimeout(() => {
            buttonContainer.classList.add("show");
        }, duration + 300));
    }

    if (backgroundMusic.readyState >= 1 && isFinite(backgroundMusic.duration)) {
        startScheduling();
    } else {

        backgroundMusic.addEventListener("loadedmetadata", startScheduling, { once: true });
    }
}


setTimeout(() => {
    scheduleAutoProgression();
}, 1200);


function stopIntroAndCleanup() {
    clearAutoTimers();
    stopMusic();
}

const originalSkip = skipScene;
skipScene = function () {
    clearAutoTimers();
    originalSkip();
};

const originalReturn = returnHome;
returnHome = function () {
    clearAutoTimers();
    originalReturn();
};


const originalNextScreen = nextScreen;
nextScreen = function () {
    clearAutoTimers();
    originalNextScreen();
};
