// round.js - Lógica de las rondas de selección

import { gameState } from './gameState.js';

// Elementos del DOM
const roundTitle = document.getElementById('round-title');
const roundInfo = document.getElementById('round-info');
const savedZone = document.getElementById('saved-zone');
const savedContainer = document.getElementById('saved-container');
const selectionContainer = document.getElementById('selection-container');
const eliminatedZone = document.getElementById('eliminated-zone');
const eliminatedContainer = document.getElementById('eliminated-container');
const selectBtn = document.getElementById('select-btn');
const nextBtn = document.getElementById('next-btn');

let isSelecting = false;

// Configuración por ronda
const roundConfig = {
  1: { from: 16, to: 8, title: 'ROUND 1' },
  2: { from: 8, to: 4, title: 'ROUND 2' },
  3: { from: 4, to: 2, title: 'ROUND 3' },
  4: { from: 2, to: 1, title: 'FINAL ROUND' }
};

// Cargar estado
gameState.load();

// Crear card pequeña (para saved/eliminated)
function createSmallCard(contestant) {
  const card = document.createElement('div');
  card.className = 'contestant-card';
  card.dataset.id = contestant.id;
  
  card.innerHTML = `
    <div class="contestant-avatar" style="background-color: ${contestant.color}">
      ${contestant.name.charAt(0).toUpperCase()}
    </div>
    <div class="contestant-name">${contestant.name}</div>
  `;
  
  return card;
}

// Crear card grande (para selección)
function createSelectionCard(contestant) {
  const card = document.createElement('div');
  card.className = 'contestant-card';
  card.dataset.id = contestant.id;
  
  card.innerHTML = `
    <div class="contestant-avatar" style="background-color: ${contestant.color}">
      ${contestant.name.charAt(0).toUpperCase()}
    </div>
    <div class="contestant-name">${contestant.name}</div>
  `;
  
  return card;
}

// Renderizar la ronda actual
function renderRound() {
  const currentRound = gameState.currentRound;
  const config = roundConfig[currentRound];
  
  // Actualizar título
  roundTitle.textContent = config.title;
  
  // Obtener contestants
  const active = gameState.getActive();
  const saved = gameState.getSaved();
  const eliminated = gameState.getEliminated();
  
  // Actualizar info
  roundInfo.textContent = `${active.length} CONTESTANTS REMAINING`;
  
  // Renderizar zona de salvados (si hay)
  if (saved.length > 0) {
    savedZone.classList.remove('hidden');
    savedContainer.innerHTML = '';
    saved.forEach(c => {
      savedContainer.appendChild(createSmallCard(c));
    });
  }
  
  // Renderizar zona de selección
  selectionContainer.innerHTML = '';
  
  // Ajustar grid según cantidad
  if (active.length <= 2) {
    selectionContainer.className = 'contestants-grid contestants-grid-2';
  } else if (active.length <= 4) {
    selectionContainer.className = 'contestants-grid contestants-grid-4';
  } else {
    selectionContainer.className = 'contestants-grid contestants-grid-8';
  }
  
  active.forEach(c => {
    selectionContainer.appendChild(createSelectionCard(c));
  });
  
  // Renderizar zona de eliminados (si hay)
  if (eliminated.length > 0) {
    eliminatedZone.classList.remove('hidden');
    eliminatedContainer.innerHTML = '';
    eliminated.forEach(c => {
      eliminatedContainer.appendChild(createSmallCard(c));
    });
  }
}

// Animación de selección
function animateSelection(winners, losers) {
  return new Promise((resolve) => {
    // Fase 1: Todos parpadean (2 segundos)
    const allCards = selectionContainer.querySelectorAll('.contestant-card');
    allCards.forEach(card => card.classList.add('selecting'));
    
    setTimeout(() => {
      // Fase 2: Remover parpadeo y marcar winners/losers
      allCards.forEach(card => card.classList.remove('selecting'));
      
      winners.forEach(w => {
        const card = selectionContainer.querySelector(`[data-id="${w.id}"]`);
        if (card) card.classList.add('winner');
      });
      
      losers.forEach(l => {
        const card = selectionContainer.querySelector(`[data-id="${l.id}"]`);
        if (card) card.classList.add('loser');
      });
      
      // Fase 3: Esperar y resolver
      setTimeout(resolve, 2000);
    }, 2000);
  });
}

// Proceso de selección
async function startSelection() {
  if (isSelecting) return;
  
  isSelecting = true;
  selectBtn.disabled = true;
  
  const currentRound = gameState.currentRound;
  const config = roundConfig[currentRound];
  
  // Obtener winners/losers
  const { winners, losers } = gameState.selectWinners(config.to);
  
  // Animar
  await animateSelection(winners, losers);
  
  // Aplicar cambios al estado
  gameState.applySelection(winners, losers);
  gameState.save();
  
  // Mostrar botón de siguiente
  selectBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
  
  isSelecting = false;
}

// Siguiente ronda
function nextRound() {
  const currentRound = gameState.currentRound;
  
  if (currentRound === 4) {
    // Ir a reveal
    window.location.href = './reveal.html';
  } else {
    // Preparar siguiente ronda
    gameState.resetSavedToActive();
    gameState.currentRound++;
    gameState.save();
    
    // Recargar página
    window.location.reload();
  }
}

// Event listeners
selectBtn.addEventListener('click', startSelection);
nextBtn.addEventListener('click', nextRound);

// Inicializar
function init() {
  // Verificar si hay datos
  if (gameState.contestants.length === 0) {
    alert('No contestants found. Redirecting to registration...');
    window.location.href = './register.html';
    return;
  }
  
  renderRound();
}

init();
