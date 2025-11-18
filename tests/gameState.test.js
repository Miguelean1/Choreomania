const { gameState } = requere('../scripts/gameState.js');

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

