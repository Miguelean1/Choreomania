global.Audio = jest.fn().mockImplementation((src) => ({
    src,
    loop: false,
    volume: 1,
    currentTime: 0,
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn()
}));

global.document = {
    querySelector: jest.fn().mockReturnValue({
        classList: {
            remove: jest.fn(),
            add: jest.fn()
        }
    })
};

global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn()
};

global.console = {
    log: jest.fn(),
    warn: jest.fn()
};

const { 
    initAudio, 
    playAudio, 
    pauseAudio, 
    muteMusic, 
    stopMusic, 
    playRaffleSound 
} = require('../scripts/audio-manager.js');

describe('audio manager tests', () => {
    beforeEach(() => {
        backgroundMusic = null;
        isMuted = true;
        rafflePlayed = false;
        
        jest.clearAllMocks();
        
        global.Audio.mockClear();
        global.document.querySelector.mockReturnValue({
            classList: {
                remove: jest.fn(),
                add: jest.fn()
            }
        });
    });

    test('initAudio creates Audio object with correct config', () => {
        initAudio('test.mp3');
        
        expect(Audio).toHaveBeenCalledWith('test.mp3');
        expect(backgroundMusic).not.toBeNull();
        expect(backgroundMusic.loop).toBe(true);
        expect(backgroundMusic.volume).toBe(0.3);
    });


    test('playAudio changes isMuted to false and saves to localStorage', () => {
        initAudio('test.mp3');
        
        playAudio();
        
        expect(isMuted).toBe(false);
        expect(localStorage.setItem).toHaveBeenCalledWith('musicEnabled', 'true');
    });

    test('playAudio does nothing when backgroundMusic is null', () => {
        playAudio();
        
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(document.querySelector).not.toHaveBeenCalled();
    });

    test('pauseAudio changes isMuted to true and pauses audio', () => {
        initAudio('test.mp3');
        isMuted = false;
        
        pauseAudio();
        
        expect(isMuted).toBe(true);
        expect(backgroundMusic.pause).toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalledWith('musicEnabled', 'false');
    });

    test('pauseAudio does nothing when backgroundMusic is null', () => {
        pauseAudio();
        
        expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('muteMusic toggles from muted to playing', () => {
        initAudio('test.mp3');
        isMuted = true;
        
        muteMusic();
        
        expect(isMuted).toBe(false);
        expect(localStorage.setItem).toHaveBeenCalledWith('musicEnabled', 'true');
    });

    test('muteMusic toggles from playing to muted', () => {
        initAudio('test.mp3');
        isMuted = false;
        
        muteMusic();
        
        expect(isMuted).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith('musicEnabled', 'false');
    });

    test('stopMusic pauses and resets currentTime', () => {
        initAudio('test.mp3');
        backgroundMusic.currentTime = 50;
        
        stopMusic();
        
        expect(backgroundMusic.pause).toHaveBeenCalled();
        expect(backgroundMusic.currentTime).toBe(0);
    });

    test('playRaffleSound creates new Audio instance', () => {
        playRaffleSound();
        
        expect(Audio).toHaveBeenCalledWith('../assets/sounds/raffleSound.mp3');
    });
});