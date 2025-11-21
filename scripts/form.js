const MAX_CHARACTERS = 16;


function createCharacterCard(character) {
    const gridContainer = document.getElementById("charactersGrid");
    const card = document.createElement("div");
    card.className = "character-card";
    card.dataset.id = character.id;

    card.innerHTML = `
        <button class="remove-btn" type="button" data-id="${character.id}">
            <i class="fa-solid fa-xmark" style="color:#000000"></i>
        </button>
        <div class="character-image" style="background-color: ${character.color};">
            <img src="${character.imagePath}" alt="${character.name}" class="character-avatar">
        </div>
        <div class="character-name">${character.name}</div>
    `;

    gridContainer.appendChild(card);

    const removeBtn = card.querySelector(".remove-btn");
    if (removeBtn) {
        removeBtn.addEventListener("click", (e) => {
            const idToRemove = e.currentTarget.dataset.id;
            removeCharacter(idToRemove);
        });
    }
}

function addCharacter() {
    const nameInput = document.getElementById("name");
    if (!nameInput) return;

    const name = nameInput.value.trim();
    if (!name) {
        Swal.fire({
            title: "Error",
            text: "Please, enter a name!",
            icon: "error",
            confirmButtonText: "OK",
        });
        return;
    }

    const newCharacter = window.gameState.addContestant(name);

    if (newCharacter) {
        createCharacterCard(newCharacter);
        nameInput.value = "";
        nameInput.focus();
        window.gameState.save();
        updateUI();
    }
}

function removeCharacter(id) {
    const card = document.querySelector(`.character-card[data-id="${id}"]`);
    if (card) {
        card.style.opacity = "0";
        card.style.transform = "scale(0.8)";

        setTimeout(() => {
            window.gameState.removeContestant(id);
            window.gameState.save();
            card.remove();
            updateUI();
        }, 300);
    }
}

function updateUI() {
    const counterSpan = document.getElementById("counter");
    const addBtn = document.getElementById("addBtn");
    const nameInput = document.getElementById("name");

    const count = window.gameState.contestants.length;

    if (counterSpan)
        counterSpan.textContent = `${count}/${MAX_CHARACTERS} REGISTERED`;

    if (count >= MAX_CHARACTERS) {
        if (addBtn) addBtn.disabled = true;
        if (nameInput) nameInput.disabled = true;
    } else {
        if (addBtn) addBtn.disabled = false;
        if (nameInput) nameInput.disabled = false;
    }
}

function initForm() {
    const addBtn = document.getElementById("addBtn");
    const nameInput = document.getElementById("name");
    const beginBtn = document.querySelector(".begin");
    const muteBtn = document.getElementById("muteBtn");
    const restartBtn = document.querySelector(".controls button:nth-child(2)");

    if (addBtn) addBtn.addEventListener("click", addCharacter);

    if (nameInput) {
        nameInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addCharacter();
            }
        });
    }

    if (beginBtn) {
        beginBtn.addEventListener("click", (e) => {
            if (window.gameState.contestants.length === MAX_CHARACTERS) {
                stopMusic();
                Swal.fire(
                    "All set!",
                    "The ascension ceremony is about to begin....",
                    "success"
                );
                window.location.href = "../main/firsttrial.html";
            } else {
                Swal.fire({
                    title: "Wait!",
                    text: `You need 16 participants to get started. You have ${window.gameState.contestants.length}.`,
                    icon: "info",
                    toast: true,
                    position: "bottom-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        });
    }

    if (muteBtn) muteBtn.addEventListener("click", muteMusic);
    if (restartBtn) restartBtn.addEventListener("click", returnHome);

    window.gameState.contestants.forEach((contestant) =>
        createCharacterCard(contestant)
    );
    updateUI();

    if (nameInput) nameInput.focus();
}

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

window.addEventListener("load", () => {
    initForm();

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
});

if (typeof window !== "undefined") {
    window.addCharacter = addCharacter;
    window.removeCharacter = removeCharacter;
    window.updateUI = updateUI;
    window.createCharacterCard = createCharacterCard;
    window.initForm = initForm;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        addCharacter,
        removeCharacter,
        updateUI,
        createCharacterCard,
        initForm,
    };
}