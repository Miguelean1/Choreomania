const { returnHome } = require('../scripts/final-raffle-1.js');

global.Swal = {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
    showLoading: jest.fn() 
};

global.stopMusic = jest.fn();

global.Audio = jest.fn().mockImplementation(() => ({
    play: jest.fn().mockResolvedValue(),
    pause: jest.fn(),
    loop: false
}));

const originalConsoleError = console.error;
console.error = (...args) => {
    if (args[0] && args[0].toString().includes('Not implemented: navigation')) {
        return; 
    }
    originalConsoleError(...args);
};

describe('Final Raffle 1 Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks(); 
        
        document.body.innerHTML = `
            <div id="dialogbox"></div>
            <div id="arrow"></div>
        `;
    });

    test('When trying to return home, the music stops and the question appears.', async () => {
        await returnHome();
        
        expect(global.stopMusic).toHaveBeenCalled(); 
        expect(global.Swal.fire).toHaveBeenCalled(); 
    });

    test('If the user says YES, the second alert appears: “Returning...”"', async () => {
        await returnHome();
        
        await new Promise(r => setTimeout(r, 100));

        expect(global.Swal.fire).toHaveBeenCalledTimes(2);
    });
});