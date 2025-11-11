// register.js - Lógica de registro de participantes

import { gameState } from './gameState.js';

// Elementos del DOM
const nameInput = document.getElementById('name-input');
const addBtn = document.getElementById('add-btn');
const cardsContainer = document.getElementById('cards-container');
const startCeremonyBtn = document.getElementById('start-ceremony-btn');
const counter = document.getElementById('counter');

// Cargar estado si existe
gameState.load();

// Crear card visual
function createCard(contestant) {
  const card = document.createElement('div');
  card.className = 'contestant-card';
  card.dataset.id = contestant.id;
  
  card.innerHTML = `
    <div class="contestant-avatar" style="background-color: ${contestant.color}">
      ${contestant.name.charAt(0).toUpperCase()}
    </div>
    <div class="contestant-name">${contestant.name}</div>
    <button class="btn-danger remove-btn" data-id="${contestant.id}">✕</button>
  `;
  
  cardsContainer.appendChild(card);
  
  // Event listener para eliminar
  card.querySelector('.remove-btn').addEventListener('click', () => {
    removeContestant(contestant.id);
  });
}

// Renderizar cards existentes (si recargamos)
function renderExistingCards() {
  gameState.contestants.forEach(contestant => {
    createCard(contestant);
  });
}

// Añadir contestant
function addContestant() {
  const name = nameInput.value.trim();
  
  if (!name) {
    alert('Please enter a name');
    return;
  }
  
  if (gameState.contestants.length >= 16) {
    alert('Maximum 16 contestants reached');
    return;
  }
  
  const contestant = gameState.addContestant(name);
  
  if (contestant) {
    createCard(contestant);
    nameInput.value = '';
    nameInput.focus();
    gameState.save();
    updateUI();
  }
}

// Eliminar contestant
function removeContestant(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.classList.add('contestant-card-removing');
    setTimeout(() => {
      gameState.removeContestant(id);
      card.remove();
      gameState.save();
      updateUI();
    }, 300);
  }
}

// Actualizar UI
function updateUI() {
  const count = gameState.contestants.length;
  counter.textContent = `${count}/16 REGISTERED`;
  
  // Habilitar/deshabilitar botón de añadir
  if (count >= 16) {
    addBtn.disabled = true;
    nameInput.disabled = true;
  } else {
    addBtn.disabled = false;
    nameInput.disabled = false;
  }
  
  // Habilitar botón de inicio
  if (count === 16) {
    startCeremonyBtn.disabled = false;
  } else {
    startCeremonyBtn.disabled = true;
  }
}

// Event listeners
addBtn.addEventListener('click', addContestant);

nameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addContestant();
  }
});

startCeremonyBtn.addEventListener('click', () => {
  if (gameState.contestants.length === 16) {
    gameState.currentRound = 1;
    gameState.save();
    window.location.href = './round.html';
  }
});

// Inicializar
function init() {
  renderExistingCards();
  updateUI();
  nameInput.focus();
}

init();
