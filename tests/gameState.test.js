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
    test('addContestant agregar un concursante correctamente', () => {
        const contestant = gameState.addContestant('Pepe');

        expect(contestant).toHaveProperty('id');
        expect(contestant.name).toBe('PEPE');
        expect(contestant.color).toMatch(/^hsl\(/);
        expect(contestant.imagePath).toMatch(/^https:\/\/res\.cloudinary/);

        expect(gameState.contestants.length).toBe(1);
    });

    test('no se puede agregar más de MAX_CONTESTANTS', () => {
        for(let i = 0; i < 16; i++) {
            gameState.addContestant(`Person ${i}`);
        }
        const extra = gameState.addContestant('Extra');

        expect(extra).toBeNull();
        expect(gameState.contestants.length).toBe(16);
    });





});