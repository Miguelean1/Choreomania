import { gameState } from "./gameState.js"; 

const form = document.getElementById('form'); 
const nameInput = document.getElementById('name'); 
const addBtn = document.getElementById('addBtn'); 
const beginBtn = document.querySelector('.begin'); 
const gridContainer = document.getElementById('charactersGrid'); 
const counterSpan = document.getElementById('counter'); 

const MAX_CHARACTERS = 16;

function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.dataset.id = character.id;
    
    card.innerHTML = `
        <button class="remove-btn" type="button" data-id="${character.id}">
            <i class="fa-solid fa-xmark" style="color:#000000"></i>
        </button>
        <div class="character-image" style="background-color: ${character.color};">
            <img src="${character.imagePath}" alt="${character.name}" class="character-avatar">
        </div>
        <div class="character-name">${character.name.toUpperCase()}</div>
    `;
    
    gridContainer.appendChild(card);
    
    card.querySelector('.remove-btn').addEventListener('click', (e) => {
        const idToRemove = e.currentTarget.dataset.id;
        removeCharacter(idToRemove);
    });
}

function addCharacter() {
    const name = nameInput.value.trim();
    

    if (!name) {
        Swal.fire({ title: 'Error', text: 'Please, enter a name!', icon: 'error', confirmButtonText: 'OK' });
        return;
    }
    
    const newCharacter = gameState.addContestant(name); 
    
    if (newCharacter) {
        createCharacterCard(newCharacter);
        nameInput.value = '';
        nameInput.focus();
        gameState.save(); 
        updateUI(); 
    }
}

function removeCharacter(id) {
    const card = document.querySelector(`.character-card[data-id="${id}"]`);
    
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            gameState.removeContestant(id);
            gameState.save();
            card.remove();
            updateUI(); 
        }, 300);
    }
}


function updateUI() {
    const count = gameState.contestants.length;
    
    counterSpan.textContent = `${count}/${MAX_CHARACTERS} REGISTERED`;
    
    if (count >= MAX_CHARACTERS) {
        addBtn.disabled = true;
        nameInput.disabled = true;
    } else {
        addBtn.disabled = false;
        nameInput.disabled = false;
    }
}

window.restartGame = function() { 
    Swal.fire({
        title: "Would you like to save your progress and go to the home page?",
        text: "If you exit without saving, you will lose your progress.",
        icon: "warning",
        showCancelButton: true,
        
        confirmButtonText: "Yes, save and exit", 
        cancelButtonText: "No, I'll stay and play.", 
        
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Saved progress!", "You will be redirected.", "success")
                .then(() => {
                    // window.location.href = '/'; 
                });
        }
        else {
            Swal.fire("Back to the game", "", "info");
        }
    });
}

window.toggleMute = function() { 
    const icon = document.querySelector('#muteBtn i');
    icon.classList.toggle('fa-volume-xmark');
    icon.classList.toggle('fa-volume-high');
}


function init() {
    gameState.contestants.forEach(contestant => {
        createCharacterCard(contestant);
    });
    
    updateUI();
    nameInput.focus();
}

addBtn.addEventListener('click', addCharacter);


nameInput.addEventListener('keypress', (e) => {
    
    if (e.key === 'Enter') {
        e.preventDefault(); 
        addCharacter();
    }
});

beginBtn.addEventListener('click', (e) => {
    if (gameState.contestants.length === MAX_CHARACTERS) {
        Swal.fire('All set!', 'The ascension ceremony is about to begin....', 'success');
        // window.location.href = './round.html'; 

    } else {
        Swal.fire({
            title: 'Wait!',
            text: `You need 16 participants to get started. You have ${gameState.contestants.length}.`,
            icon: 'info',
            toast: true, 
            position: 'bottom-end', 
            showConfirmButton: false, 
            timer: 3000, 
            timerProgressBar: true,
        });
    }
});

init();



























