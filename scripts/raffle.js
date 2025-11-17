class RaffleSystem {
    constructor(config = {}) {

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

        getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

        init() {
        this.playerBoxes = [];
        

        const elements = document.querySelectorAll(this.config.playerBoxSelector);
        if (elements.length > 0) {
            this.playerBoxes = Array.from(elements);
        } 

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
            
            playRaffleSound(); 


            this.playerBoxes.forEach((box) => (box.style.boxShadow = ""));


            this.animationInterval = setInterval(() => {
                this.playerBoxes.forEach((box) => {
                    const color = this.config.shadowColors[
                        this.getRandomInt(0, this.config.shadowColors.length - 1)
                    ];
                    box.style.boxShadow = `0 0 25px 6px ${color}`;
                });
            }, this.config.blinkInterval);


            setTimeout(() => {
                clearInterval(this.animationInterval);
                this.animationInterval = null;


                this.playerBoxes.forEach((box) => (box.style.boxShadow = ""));


                const selectedIndices = this.selectRandomIndices(
                    this.playerBoxes.length,
                    this.config.winnersCount
                );


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


                if (typeof onComplete === 'function') {
                    onComplete(selectedIndices);
                }


                resolve(selectedIndices);
            }, this.config.animationDuration);
        });
    }

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

        getSelectedElements() {
        return this.playerBoxes.filter(box => 
            box.classList.contains(this.config.selectedClass)
        );
    }

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


if (typeof window !== 'undefined') {
    window.RaffleSystem = RaffleSystem;
}
