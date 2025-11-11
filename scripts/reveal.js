// reveal.js - Lógica del reveal final

import { gameState } from './gameState.js';

// Elementos del DOM
const winnerAvatar = document.getElementById('winner-avatar');
const winnerName = document.getElementById('winner-name');
const revealText = document.getElementById('reveal-text');
const nextCeremony = document.getElementById('next-ceremony');
const restartBtn = document.getElementById('restart-btn');

// Cargar estado
gameState.load();

// Mostrar ganador
function displayWinner() {
  const winner = gameState.getWinner();
  
  if (!winner) {
    alert('No winner found. Redirecting...');
    window.location.href = './intro.html';
    return;
  }
  
  // Mostrar avatar y nombre
  winnerAvatar.style.backgroundColor = winner.color;
  winnerAvatar.textContent = winner.name.charAt(0).toUpperCase();
  winnerName.textContent = winner.name;
}

// Secuencia de reveal
function revealSequence() {
  // Esperar 1.5s y mostrar reveal text
  setTimeout(() => {
    revealText.classList.remove('hidden');
  }, 1500);
  
  // Esperar 4.5s y mostrar próxima ceremonia
  setTimeout(() => {
    nextCeremony.classList.remove('hidden');
  }, 4500);
  
  // Esperar 5s y mostrar botón restart
  setTimeout(() => {
    restartBtn.classList.remove('hidden');
  }, 5000);
}

// Reiniciar
function restart() {
  gameState.reset();
  window.location.href = './intro.html';
}

// Event listeners
restartBtn.addEventListener('click', restart);

// Inicializar
function init() {
  displayWinner();
  revealSequence();
}

init();
