const STORAGE_KEY = 'myRegistrationGameState';
const MAX_CONTESTANTS = 16;

//reemplaza estas URLs de ejemplo con 16 URLs de cloudinary.
const CLOUDINARY_IMAGE_URLS = [
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-01.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-02.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-03.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-04.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-05.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-06.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-07.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-08.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-09.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-10.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-11.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-12.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-13.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-14.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-15.png',
    'https://res.cloudinary.com/tu-nombre-de-cloud/image/upload/v1/imagen-16.png',
];

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateRandomColor() {
    const hue = Math.floor(Math.random() * 360); 
    const saturation = Math.floor(Math.random() * (70 - 30 + 1) + 30); 
    const lightness = Math.floor(Math.random() * (90 - 70 + 1) + 70); 
    const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    return hslColor;
}

export const gameState = {
    contestants: [],
    
    load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const loadedState = JSON.parse(data);
                this.contestants = loadedState.contestants || [];
                
                this.contestants.forEach((contestant, index) => {
                    contestant.imagePath = this.getNextImagePath(index);
                });
            }
        } catch (e) {
            console.error("Error loading status from localStorage", e);
        }
    },

    save() {
        try {
            // Guardamos solo los datos esenciales: id, name, color.
            // La propiedad imagePath se recalcula en load(), haciendo el guardado más ligero.
            const stateToSave = {
                contestants: this.contestants.map(({ id, name, color }) => ({ id, name, color })),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (e) {
            console.error("Error saving status to localStorage", e);
        }
    },

    addContestant(name) {
        const currentIndex = this.contestants.length;
        
        if (currentIndex >= MAX_CONTESTANTS) {
            return null; 
        }
        
        const newContestant = {
            id: generateUniqueId(),
            name: name.trim().toUpperCase(),
            color: generateRandomColor(),
            // ASIGNAR imagePath AL CREAR:
            imagePath: this.getNextImagePath(currentIndex), // <-- USAR getNextImagePath aquí
        };

        this.contestants.push(newContestant);
        return newContestant;
    },

    getNextImagePath(index) {
        const urlIndex = index % MAX_CONTESTANTS;
        
        return CLOUDINARY_IMAGE_URLS[urlIndex];
    },    

    removeContestant(id) {
        const initialLength = this.contestants.length;
        this.contestants = this.contestants.filter(c => c.id.toString() !== id.toString());

        return this.contestants.length < initialLength;
    }
};

gameState.load();

