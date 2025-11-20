jest.mock('../scripts/gameState', () => ({
    gameState: {
        contestans: [],
        addContestants: jest.fn((name) => ({ 
            id: '1', 
            name, 
            color: '#fff' , 
            imagePath: 'avatar.png'
        })),
        removeContestant: jest.fn(),
        save: jest.fn(),
    }
}));

const { gameState } = require('../scripts/gameState.js');
const { addCharacter, initForm } = require('../scripts/form.js');

const html = `
    <input id='name' />
    <button id='addBtn'></button>
    <div id='charactersGrid'></div>
    <span id='counter'></span>
`;

document.body.innerHTML = html;

initForm();

describe('simple charter tests', () => {
    
    beforeEach(() => {
        gameState.contestants = []
        document.getElementById('characterGrid').innerHTML = '';
        document.getElementById('name').vale = '';
        gameState.addContestant.mockClear();
        gameState.removeContestant.mockClear();
        gameState.save.mockClear();
    });

    test('add Character adds a new character', () => {
        const nameImput = document.getElementById('name');
        nameImput.value = 'Julia';
        
        addCharacter();

        expect(gameState.addContestant).toHaveBeenCalledWith('Julia');
        
        const grid = document.getElementById('charactersGrid');
        expect(grid.children.length).toBe(1);
        expect(grid.children[0].querySelector('.character-name').textContent.toBe('Julia'))
        
        expect(gameState.save).toHaveBeenCalledWith();
    });
});