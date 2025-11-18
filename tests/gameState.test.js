const { gameState } = require('../scripts/gameState.js');

beforeEach(() =>{
    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: jest.fn((key) => store[key] || null),
            setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
            clear: jest.fn(() => { store = {}; }),
            removeItem: jest.fn((key) => {delete store[key]; })
        }
    })();
    global.localStorage = localStorageMock;

    gameState.reset();
});

describe('gameState tests', () => {
    test('addContestant add a contestant successfully', () => {
        const contestant = gameState.addContestant('Pepe');

        expect(contestant).toHaveProperty('id');
        expect(contestant.name).toBe('PEPE');
        expect(contestant.color).toMatch(/^hsl\(/);
        expect(contestant.imagePath).toMatch(/^https:\/\/res\.cloudinary/);

        expect(gameState.contestants.length).toBe(1);
    });

    test('you cannot add more than MAX_CONTESTANTS', () => {
        for(let i = 0; i < 16; i++) {
            gameState.addContestant(`Person ${i}`);
        }
        const extra = gameState.addContestant('Extra');

        expect(extra).toBeNull();
        expect(gameState.contestants.length).toBe(16);
    });

    test('removeContestant returns false if it does not exist', () => {
        const removed = gameState.removeContestant('nonexistent-id');
        expect(removed).toBe(false);
    });

    test('removeContestant removes contestant and releases image', () => {
        const c = gameState.addContestant('Pepe');
        const usedBefore = gameState.usedImageIndices.length;
        const removed = gameState.removeContestant(c.id);

        expect(removed).toBe(true);
        expect(gameState.contestants.find(x => x.id === c.id)).toBeUndefined();
        expect(gameState.usedImageIndices.length).toBe(usedBefore - 1);
    });


});