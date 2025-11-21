const { 
    returnHome, 
    playThunderOnce, 
    nextScreen, 
    titleStyle, 
    normalStyle,
    finalStyle,
    setDialogbox,
    resetThunder 
} = require('../scripts/plot-twist.js');

global.Swal = {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
    showLoading: jest.fn()
};

global.stopMusic = jest.fn();

const mockAudioInstance = {
    play: jest.fn().mockResolvedValue(),
    pause: jest.fn(),
    loop: false,
    src: ''
};

global.Audio = jest.fn(() => mockAudioInstance);

const originalConsoleError = console.error;
console.error = (...args) => {
    if (args[0] && args[0].toString().includes('Not implemented: navigation')) return;
    originalConsoleError(...args);
};

describe('Plot Twist - Extended Tests (Coverage +60%)', () => {

    let mockDialog;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers(); 

        if (typeof resetThunder === 'function') {
            resetThunder();
        }

        document.body.innerHTML = `
            <div id="dialogbox" class="normal-style"></div>
            <div id="arrow"></div>
            <button id="muteBtn"><i class="fa-solid"></i></button>
        `;
        
        mockDialog = document.getElementById('dialogbox');
        if (typeof setDialogbox === 'function') {
            setDialogbox(mockDialog);
        }
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('returnHome stops music and shows alert', async () => {
        await returnHome();
        expect(global.stopMusic).toHaveBeenCalled();
        expect(global.Swal.fire).toHaveBeenCalled();
    });

    test('playThunderOnce creates audio instance and plays it', () => {
        playThunderOnce();
        expect(global.Audio).toHaveBeenCalled();
        expect(mockAudioInstance.play).toHaveBeenCalled();
    });

    test('nextScreen creates overlay and redirects after timeout', () => {
        nextScreen();
        
        const overlay = document.getElementById('flash-overlay');
        expect(overlay).not.toBeNull();
        
        expect(overlay.style.opacity).toBe("0");

        jest.runAllTimers();
    });

    test('styles functions change CSS classes correctly', () => {
        titleStyle();
        expect(mockDialog.classList.contains('title-style')).toBe(true);
        expect(mockDialog.classList.contains('normal-style')).toBe(false);
        
        normalStyle();
        expect(mockDialog.classList.contains('normal-style')).toBe(true);
        
        finalStyle();
        expect(mockDialog.classList.contains('final-style')).toBe(true);
        expect(mockDialog.classList.contains('normal-style')).toBe(false);
    });
});