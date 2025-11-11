// intro.js - Lógica de la pantalla de introducción

import { gameState } from './gameState.js';

const introText = [
  "The year is 2047, and Earth is no longer ours.",
  "Decades of climate catastrophes brought civilization to its knees, and in desperation, a bioengineering lab promised hope—but unleashed something far worse.",
  "The Lagomorph Sapiens: hyper-intelligent humanoid rabbits who escaped their containment and multiplied beyond control, sweeping across the globe.",
  "Within months, they had conquered cities, toppled governments, and established their dominion over humanity.",
  "Their regime is brutally simple: humans must dance endlessly for their entertainment, with no rest and no escape.",
  "But once a year, a glimmer of hope breaks through the despair—a global broadcast from the mysterious billionaire known only as The Benefactor.",
  "He offers one seat aboard the New Hope, his private spacecraft bound for Saturn, where the colony New Esperanza promises a fresh start far from Earth's nightmare.",
  "Sixteen candidates will be selected through four brutal elimination rounds, but only one will ascend to freedom.",
  "Tonight, as the world watches with bated breath, the Ceremony of Ascension begins.",
  "Will you claim your ticket to the stars... or remain on Earth, dancing forever for the rabbit overlords?"
];

// Elementos del DOM
const introTextContainer = document.getElementById('intro-text');
const startBtn = document.getElementById('start-btn');

// Renderizar texto
function renderIntroText() {
  introText.forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    introTextContainer.appendChild(p);
  });
}

// Inicializar
function init() {
  // Reset del estado del juego
  gameState.reset();
  
  // Renderizar texto
  renderIntroText();
  
  // Mostrar botón después de que termine la animación
  setTimeout(() => {
    startBtn.classList.remove('hidden');
  }, 2500);
}

// Event listeners
startBtn.addEventListener('click', () => {
  window.location.href = './register.html';
});

// Iniciar
init();
