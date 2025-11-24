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
    
    test('createCharacterCard renders properly', () => {
    const character = {
        id: "1",
        name: "TEST",
        color: "#123456",
        imagePath: "test.png"
    };

    const { createCharacterCard } = require('../scripts/form.js');

    createCharacterCard(character);

    const card = document.querySelector('.character-card[data-id="1"]');
    expect(card).not.toBeNull();
    expect(card.querySelector('.character-name').textContent).toBe('TEST');
    expect(card.querySelector('img').src).toContain('test.png');
    });

    test('removeCharacter removes card from DOM', () => {
    jest.useFakeTimers();

    const character = {
        id: "1",
        name: "TEST",
        color: "#fff",
        imagePath: "avatar.png"
    };

    mockGameState.contestants.push(character);

    const { createCharacterCard, removeCharacter } = require('../scripts/form.js');

    createCharacterCard(character);

    expect(document.querySelector('.character-card')).not.toBeNull();

    removeCharacter("1");

    jest.runAllTimers();

    expect(document.querySelector('.character-card')).toBeNull();
    expect(mockGameState.removeContestant).toHaveBeenCalledWith("1");
    });

    test('updateUI enables input and button when below max', () => {
    const nameInput = document.getElementById('name');
    const addBtn = document.getElementById('addBtn');

    mockGameState.contestants = []; 
    updateUI();

    expect(addBtn.disabled).toBe(false);
    expect(nameInput.disabled).toBe(false);
    });

    test('add button and input disable when reaching max characters', () => {
    const nameInput = document.getElementById('name');
    const addBtn = document.getElementById('addBtn');

    mockGameState.addContestant.mockImplementation((name) => {
        const newId = String(mockGameState.contestants.length + 1);
        const newCharacter = {
            id: newId,
            name: name.toUpperCase(),
            color: '#fff',
            imagePath: 'avatar.png'
        };
        mockGameState.contestants.push(newCharacter);
        return newCharacter;
    });

    for (let i = 0; i < 16; i++) {
        nameInput.value = `Person ${i}`;
        addCharacter();
    }

    expect(addBtn.disabled).toBe(true);
    expect(nameInput.disabled).toBe(true);

    const counter = document.getElementById('counter');
    expect(counter.textContent).toBe('16/16 REGISTERED');
    });

});