/**
 * RAFFLE SYSTEM - Sistema de sorteo reutilizable
 * ===============================================
 * 
 * Este módulo proporciona funcionalidad de sorteo animado que puede
 * ser utilizado en múltiples vistas/páginas del proyecto.
 * 
 * USO BÁSICO:
 * -----------
 * 1. Incluir este archivo antes del script principal:
 *    <script src="raffle.js"></script>
 *    <script src="tu-script.js"></script>
 * 
 * 2. Crear una instancia del sistema de sorteo:
 *    const miSorteo = new RaffleSystem({
 *        playerBoxSelector: '.character-image',  // Selector CSS de los elementos
 *        totalPlayers: 16,                       // Total de jugadores/elementos
 *        winnersCount: 8,                        // Cantidad a seleccionar
 *        animationDuration: 2000,                // Duración de la animación (ms)
 *        selectedClass: 'selected',              // Clase CSS para elementos seleccionados
 *        glowColor: 'gold'                       // Color del brillo para seleccionados
 *    });
 * 
 * 3. Inicializar (cargar los elementos del DOM):
 *    miSorteo.init();
 * 
 * 4. Ejecutar el sorteo:
 *    miSorteo.start();
 * 
 * 5. Opcional - Resetear:
 *    miSorteo.reset();
 * 
 * EJEMPLO COMPLETO:
 * -----------------
 * const raffle = new RaffleSystem();
 * raffle.init();
 * 
 * document.getElementById('startButton').addEventListener('click', () => {
 *     raffle.start();
 * });
 */

class RaffleSystem {
    constructor(config = {}) {
        // Configuración por defecto
        this.config = {
            playerBoxSelector: '.character-image',
            totalPlayers: 16,
            winnersCount: 8,
            animationDuration: 2000,
            selectedClass: 'selected',
            glowColor: 'gold',
            shadowColors: [
                "rgba(255, 107, 157, 0.7)",
                "rgba(254, 202, 87, 0.7)",
                "rgba(162, 155, 254, 0.7)",
                "rgba(95, 39, 205, 0.7)",
                "rgba(196, 69, 105, 0.7)",
                "rgba(238, 90, 111, 0.7)",
                "rgba(108, 92, 231, 0.7)",
                "rgba(76, 201, 240, 0.7)",
            ],
            blinkInterval: 150,
            ...config
        };

        this.playerBoxes = [];
        this.isRunning = false;
        this.animationInterval = null;
    }

    /**
     * Genera un número entero aleatorio entre min y max (inclusive)
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Inicializa el sistema cargando los elementos del DOM
     * Debe llamarse después de que el DOM esté listo
     */
    init() {
        this.playerBoxes = [];
        
        // Opción 1: Usar selector CSS directo
        const elements = document.querySelectorAll(this.config.playerBoxSelector);
        if (elements.length > 0) {
            this.playerBoxes = Array.from(elements);
        } 
        // Opción 2: Buscar por ID (playerBox1, playerBox2, etc.)
        else {
            for (let i = 1; i <= this.config.totalPlayers; i++) {
                const box = document.getElementById(`playerBox${i}`);
                if (box) {
                    this.playerBoxes.push(box);
                }
            }
        }

        if (this.playerBoxes.length === 0) {
            console.warn('RaffleSystem: No se encontraron elementos para el sorteo.');
        }

        return this;
    }

    /**
     * Limpia todos los efectos visuales de los elementos
     */
    reset() {
        this.playerBoxes.forEach((box) => {
            box.style.boxShadow = "";
            box.classList.remove(this.config.selectedClass);
        });
        this.isRunning = false;
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Inicia la animación del sorteo
     * @param {Function} onComplete - Callback opcional que se ejecuta al terminar
     * @returns {Promise} Promesa que se resuelve con los índices seleccionados
     */
    start(onComplete) {
        return new Promise((resolve) => {
            if (this.isRunning) {
                console.warn('RaffleSystem: El sorteo ya está en ejecución.');
                return;
            }

            if (this.playerBoxes.length === 0) {
                console.error('RaffleSystem: No hay elementos cargados. Llama a init() primero.');
                return;
            }

            this.isRunning = true;
            playRaffleSound(); //Linea de Mike

            // Limpiar efectos previos
            this.playerBoxes.forEach((box) => (box.style.boxShadow = ""));

            // Animación de brillos aleatorios
            this.animationInterval = setInterval(() => {
                this.playerBoxes.forEach((box) => {
                    const color = this.config.shadowColors[
                        this.getRandomInt(0, this.config.shadowColors.length - 1)
                    ];
                    box.style.boxShadow = `0 0 25px 6px ${color}`;
                });
            }, this.config.blinkInterval);

            // Tras la duración configurada, seleccionar ganadores
            setTimeout(() => {
                clearInterval(this.animationInterval);
                this.animationInterval = null;

                // Limpiar todos los brillos
                this.playerBoxes.forEach((box) => (box.style.boxShadow = ""));

                // Seleccionar índices únicos aleatorios
                const selectedIndices = this.selectRandomIndices(
                    this.playerBoxes.length,
                    this.config.winnersCount
                );

                // Aplicar estilos a los seleccionados
                this.playerBoxes.forEach((box, idx) => {
                    if (selectedIndices.includes(idx)) {
                        box.classList.add(this.config.selectedClass);
                        box.style.boxShadow = `0 0 10px 5px ${this.config.glowColor}`;
                    } else {
                        box.classList.remove(this.config.selectedClass);
                        box.style.boxShadow = "";
                    }
                });

                this.isRunning = false;

                // Ejecutar callback si existe
                if (typeof onComplete === 'function') {
                    onComplete(selectedIndices);
                }

                // Resolver la promesa con los índices seleccionados
                resolve(selectedIndices);
            }, this.config.animationDuration);
        });
    }

    /**
     * Selecciona N índices únicos aleatorios de un rango
     * @param {number} max - Número máximo de elementos
     * @param {number} count - Cantidad de elementos a seleccionar
     * @returns {Array} Array de índices seleccionados
     */
    selectRandomIndices(max, count) {
        const selectedIndices = [];
        while (selectedIndices.length < count && selectedIndices.length < max) {
            const idx = this.getRandomInt(0, max - 1);
            if (!selectedIndices.includes(idx)) {
                selectedIndices.push(idx);
            }
        }
        return selectedIndices;
    }

    /**
     * Obtiene los elementos del DOM que fueron seleccionados
     * @returns {Array} Array de elementos DOM seleccionados
     */
    getSelectedElements() {
        return this.playerBoxes.filter(box => 
            box.classList.contains(this.config.selectedClass)
        );
    }

    /**
     * Obtiene los índices de los elementos seleccionados
     * @returns {Array} Array de índices seleccionados
     */
    getSelectedIndices() {
        const indices = [];
        this.playerBoxes.forEach((box, idx) => {
            if (box.classList.contains(this.config.selectedClass)) {
                indices.push(idx);
            }
        });
        return indices;
    }
}

// Exportar para uso global (si no usas módulos ES6)
if (typeof window !== 'undefined') {
    window.RaffleSystem = RaffleSystem;
}
