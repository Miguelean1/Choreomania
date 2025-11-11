const STORAGE_KEY = 'myRegistrationGameState';
const MAX_CONTESTANTS = 16;

//reemplaza estas URLs de ejemplo con 16 URLs de cloudinary.
const CLOUDINARY_IMAGE_URLS = [
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417864/human1_cb8b7k.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417864/human2_xymp1q.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human3_snt7pj.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human4_sw23h1.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human5_u2tkyw.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human6_qqj6c0.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human7_wnbwzt.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417864/human8_cpb8ny.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human9_zhmccs.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human12_vmwigz.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human10_kxw3mj.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human11_fpndst.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human14_yawyal.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449704/human13_vxfblm.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human16_l27dtq.png',
    'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762449703/human15_eyc0jx.png',
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

