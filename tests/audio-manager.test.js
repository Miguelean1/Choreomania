const mockAudio = jest.fn().mockImplementation((src) => ({
    src,
    loop: false,
    volume: 1,
    currentTime: 0,
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn()
}));

const mockSetItem = jest.fn();
const mockGetItem = jest.fn();
const mockRemoveItem = jest.fn();
const mockClear = jest.fn();
const mockClassListRemove = jest.fn();
const mockClassListAdd = jest.fn();

const mockQuerySelector = jest.fn(selector => {
  if (selector === '#muteBtn i') {
    return {
      classList: {
        remove: mockClassListRemove,
        add: mockClassListAdd
      }
    };
  }
  return null;
});

const mockConsoleLog = jest.fn();
const mockConsoleWarn = jest.fn();


global.Audio = mockAudio;
global.localStorage = {
    setItem: mockSetItem,
    getItem: mockGetItem,
    removeItem: mockRemoveItem,
    clear: mockClear
};
global.document = {
    querySelector: mockQuerySelector
};
global.console = {
    log: mockConsoleLog,
    warn: mockConsoleWarn
};

describe('audio manager tests', () => {
    let audioModule;
    
    beforeEach(() => {
        
        mockAudio.mockClear();
        mockSetItem.mockClear();
        mockGetItem.mockClear();
        mockRemoveItem.mockClear();
        mockClear.mockClear();
        mockQuerySelector.mockClear();
        mockClassListRemove.mockClear();
        mockClassListAdd.mockClear();
        mockConsoleLog.mockClear();
        mockConsoleWarn.mockClear();
        jest.spyOn(Storage.prototype, 'setItem');
        
        window.Audio = mockAudio;
        window.localStorage = {
        setItem: mockSetItem,
        getItem: mockGetItem,
        removeItem: mockRemoveItem,
        clear: mockClear
        };
        window.document.querySelector = mockQuerySelector;
        window.console = {
            log: mockConsoleLog,
            warn: mockConsoleWarn
        };

        
        jest.resetModules();
        audioModule = require('../scripts/audio-manager.js');
            });
   
    
    test('initAudio creates Audio object with correct config', () => {
        audioModule.initAudio('test.mp3');
        
        expect(mockAudio).toHaveBeenCalledWith('test.mp3');
        const audioInstance = mockAudio.mock.results[0].value;
        expect(audioInstance.loop).toBe(true);
        expect(audioInstance.volume).toBe(0.3);
    });
    
    test('playAudio changes isMuted to false and saves to localStorage', () => {
        audioModule.initAudio('test.mp3');
        audioModule.playAudio();
        
        expect(localStorage.setItem).toHaveBeenCalledWith('musicEnabled', 'true');
        expect(mockQuerySelector).toHaveBeenCalledWith('#muteBtn i');
    });
    
    test('playAudio does nothing when backgroundMusic is null', () => {
        audioModule.playAudio();
        
        expect(mockSetItem).not.toHaveBeenCalled();
        expect(mockQuerySelector).not.toHaveBeenCalled();
    });
    
    test('pauseAudio changes isMuted to true and pauses audio', () => {
        audioModule.initAudio('test.mp3');
        const audioInstance = mockAudio.mock.results[0].value;
        
        audioModule.pauseAudio();
        
        expect(audioInstance.pause).toHaveBeenCalled();
        expect(mockSetItem).toHaveBeenCalledWith('musicEnabled', 'false');
    });
    
    test('pauseAudio does nothing when backgroundMusic is null', () => {
        audioModule.pauseAudio();
        
        expect(mockSetItem).not.toHaveBeenCalled();
    });
    
    test('muteMusic toggles from muted to playing', () => {
        audioModule.initAudio('test.mp3');
        
        audioModule.muteMusic();
        
        expect(mockSetItem).toHaveBeenCalledWith('musicEnabled', 'true');
    });
    
    test('muteMusic toggles from playing to muted', () => {
        audioModule.initAudio('test.mp3');
        audioModule.playAudio();
        mockSetItem.mockClear();
        
        audioModule.muteMusic();
        
        expect(mockSetItem).toHaveBeenCalledWith('musicEnabled', 'false');
    });
    
    test('stopMusic pauses and resets currentTime', () => {
        audioModule.initAudio('test.mp3');
        const audioInstance = mockAudio.mock.results[0].value;
        audioInstance.currentTime = 50;
        
        audioModule.stopMusic();
        
        expect(audioInstance.pause).toHaveBeenCalled();
        expect(audioInstance.currentTime).toBe(0);
    });
    
    test('playRaffleSound creates new Audio instance', () => {
        audioModule.playRaffleSound();
        
        expect(mockAudio).toHaveBeenCalledWith('../assets/sounds/raffleSound.mp3');
    });
});