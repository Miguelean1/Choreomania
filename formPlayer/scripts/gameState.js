const STORAGE_KEY = 'myRegistrationGameState';
const MAX_CONTESTANTS = 16;

//reemplaza estas URLs de ejemplo con 16 URLs de cloudinary.
const CLOUDINARY_IMAGE_URLS = [
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023753/RIPPLE_0000_CHAR-_0001_Capa-14_kqirac.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023753/RIPPLE_0001_CHAR-_0002_Capa-12_k4iunv.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0004_CHAR-_0005_Capa-6_mszms8.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0003_CHAR-_0004_Capa-7_rjeh5s.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0006_CHAR-_0007_Capa-10_v6tmdw.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0007_CHAR-_0008_Capa-9_mdfroc.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0005_CHAR-_0006_Capa-8_y10w3s.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023754/RIPPLE_0002_CHAR-_0003_Capa-11_l0bqce.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023757/RIPPLE_0026_CHAR-_0000_Capa-15_hwg0i1.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763023997/human13_3_fawtvf.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024100/human10_3_u4bhhr.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024101/human11_3_worvg4.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024101/human12_3_ew26jd.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024101/human14_3_omdjsg.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024103/human15_3_ngsfyp.png',
    'https://res.cloudinary.com/dhbjoltyy/image/upload/v1763024103/human16_3_awsji6.png',
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
    usedImageIndices: [],
    
    load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const loadedState = JSON.parse(data);
                this.contestants = loadedState.contestants || [];
                this.usedImageIndices = loadedState.usedImageIndices || [];
            }
        } catch (e) {
            console.error("Error loading status from localStorage", e);
        }
    },

    save() {
        try {
            const stateToSave = {
                contestants: this.contestants.map(({ id, name, color, imagePath }) => 
                    ({ id, name, color, imagePath })
                ),
                usedImageIndices: this.usedImageIndices,
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

