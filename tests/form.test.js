const { gameState } = require('./gameState.js');
const { addCharacter } = require('./form.js');
import fs from 'fs';
import path from "path";

const html = `
    <input id='name' />
    <button id='addBtn'></button>
    <div id='charactersGrid'></div>
    <span id='counter'></span>
`;

document.body.innerHTML = html;

jest.mock('../scripts/gameState', () => ({
    gameState: {
        contestans: [],
        addContestants: jest.fn((name) => ({ id: '1', name, color: '#fff' , imagePath: 'avatar.png'})),
        removeContestant: jest.fn(),
        save: jest.fn(),
    }
}))


const addCharacter = require('../main/form.js');


describe('simple charter tests', () => {
    
    beforeEach(() => {
        gameState.contestants = []
        document.getElementById('characterGrid').innerHTML = '';
        document.getElementById('name').vale = '';
    })

    test('add Character adds a new character', () => {
        document.getElementById('name').value = 'Julia';
        addCharacter();

        expect(gameState.addContestant).toHaveBeenCalledWith('Julia');
        expect(document.getElementById('charactersGrid').children.length).toBe(1)
    })


})