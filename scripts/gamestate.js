// gameState.js - Maneja el estado global del juego

import { availableSprites, Contestant } from './data.js';

class GameState {
  constructor() {
    this.contestants = [];
    this.usedSpriteIds = [];
    this.currentRound = 1;
  }

  // Añadir contestant (llamado cada vez que se pulsa el botón)
  addContestant(name) {
    if (this.contestants.length >= 16) {
      console.warn('Ya hay 16 contestants');
      return null;
    }

    // Obtener siguiente sprite disponible
    const availableSprite = availableSprites.find(
      sprite => !this.usedSpriteIds.includes(sprite.id)
    );

    if (!availableSprite) {
      console.error('No hay sprites disponibles');
      return null;
    }

    // Crear contestant
    const contestant = new Contestant(availableSprite, name);
    this.contestants.push(contestant);
    this.usedSpriteIds.push(availableSprite.id);

    return contestant;
  }

  // Eliminar contestant
  removeContestant(id) {
    const index = this.contestants.findIndex(c => c.id === id);
    if (index !== -1) {
      const removed = this.contestants.splice(index, 1)[0];
      this.usedSpriteIds = this.usedSpriteIds.filter(sid => sid !== removed.id);
      return true;
    }
    return false;
  }

  // Obtener activos
  getActive() {
    return this.contestants.filter(c => c.status === 'active');
  }

  // Obtener salvados
  getSaved() {
    return this.contestants.filter(c => c.status === 'saved');
  }

  // Obtener eliminados
  getEliminated() {
    return this.contestants.filter(c => c.status === 'eliminated');
  }

  // Selección aleatoria para rondas
  selectWinners(winnersCount) {
    const active = this.getActive();
    const shuffled = [...active].sort(() => Math.random() - 0.5);
    
    const winners = shuffled.slice(0, winnersCount);
    const losers = shuffled.slice(winnersCount);

    // No actualizamos el estado aquí, lo haremos después de las animaciones
    return { winners, losers };
  }

  // Aplicar resultados de selección
  applySelection(winners, losers) {
    winners.forEach(w => {
      const contestant = this.contestants.find(c => c.id === w.id);
      if (contestant) contestant.status = 'saved';
    });

    losers.forEach(l => {
      const contestant = this.contestants.find(c => c.id === l.id);
      if (contestant) contestant.status = 'eliminated';
    });
  }

  // Resetear estado de "saved" a "active" para nueva ronda
  resetSavedToActive() {
    this.contestants.forEach(c => {
      if (c.status === 'saved') {
        c.status = 'active';
      }
    });
  }

  // Obtener ganador final
  getWinner() {
    return this.contestants.find(c => c.status === 'saved');
  }

  // Persistencia
  save() {
    const data = {
      contestants: this.contestants,
      usedSpriteIds: this.usedSpriteIds,
      currentRound: this.currentRound
    };
    localStorage.setItem('choreomania', JSON.stringify(data));
  }

  load() {
    const saved = localStorage.getItem('choreomania');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.contestants = data.contestants || [];
        this.usedSpriteIds = data.usedSpriteIds || [];
        this.currentRound = data.currentRound || 1;
        return true;
      } catch (e) {
        console.error('Error loading state:', e);
        return false;
      }
    }
    return false;
  }

  reset() {
    this.contestants = [];
    this.usedSpriteIds = [];
    this.currentRound = 1;
    localStorage.removeItem('choreomania');
  }
}

// Exportar instancia única
export const gameState = new GameState();
