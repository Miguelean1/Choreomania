global.Swal = {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true })
};

const mockGameState = {
    contestants: [],
    usedImageIndices: [],
    addContestant: jest.fn((name) => ({
        id: '1',
        name: name.toUpperCase(),
        color: '#fff',
        imagePath: 'avatar.png'
    })),
    removeContestant: jest.fn(),
    save: jest.fn(),
    load: jest.fn(),
    reset: jest.fn()
};

jest.mock('../scripts/gameState', () => ({
    gameState: mockGameState
}));

global.window.gameState = mockGameState;

const { gameState } = require('../scripts/gameState.js');
const { addCharacter, initForm, updateUI } = require('../scripts/form.js');

const html = `
    <input id="name" />
    <button id="addBtn"></button>
    <button class="begin"></button>
    <div id="charactersGrid"></div>
    <span id="counter"></span>
`;

describe('simple character tests', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
        
        mockGameState.contestants = [];
        mockGameState.usedImageIndices = [];
        
        mockGameState.addContestant.mockClear();
        mockGameState.removeContestant.mockClear();
        mockGameState.save.mockClear();
        
        initForm();
    });

    test('addCharacter adds a new character', () => {
        const nameInput = document.getElementById('name');
        nameInput.value = 'Julia';

        addCharacter();

        expect(mockGameState.addContestant).toHaveBeenCalledWith('Julia');

        const grid = document.getElementById('charactersGrid');
        expect(grid.children.length).toBe(1);
        expect(grid.children[0].querySelector('.character-name').textContent).toBe('JULIA');

        expect(mockGameState.save).toHaveBeenCalled();
    });

    test('addCharacter shows error when name is empty', () => {
        const nameInput = document.getElementById('name');
        nameInput.value = '';

        addCharacter();

        expect(Swal.fire).toHaveBeenCalledWith({
            title: 'Error',
            text: 'Please, enter a name!',
            icon: 'error',
            confirmButtonText: 'OK'
        });

        expect(mockGameState.addContestant).not.toHaveBeenCalled();
    });

    test('counter updates correctly', () => {
        const counter = document.getElementById('counter');
        expect(counter.textContent).toBe('0/16 REGISTERED');
    });
});