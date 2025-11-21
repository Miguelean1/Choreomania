
const { checkMusicPreference, nextScreen } = require('./welcome.js');


global.playAudio = jest.fn();
global.pauseAudio = jest.fn();
global.stopMusic = jest.fn();

const swalFireMock = jest.fn(() => Promise.resolve({}));
global.Swal = { fire: swalFireMock };


const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};

const { muteMusic, returnHome, nextScreen } = require('../scripts/welcome.js'); 

    
    swalFireMock.mockResolvedValueOnce(resultDenied);
    await checkMusicPreference();
    expect(Swal.fire).toHaveBeenCalled();
    expect(pauseAudio).toHaveBeenCalled();




describe('nextScreen', () => {
  beforeEach(() => {
   
    document.body.style.transition = '';
    document.body.style.opacity = '1';
  });

  test('calls stopMusic and sets opacity and transition', () => {
    jest.useFakeTimers();
    nextScreen();
    expect(stopMusic).toHaveBeenCalled();
    expect(document.body.style.transition).toBe('opacity 0.8s');
    expect(document.body.style.opacity).toBe('0');
    jest.useRealTimers();
  });

  test('redirects to intro.html after 800ms', () => {
    jest.useFakeTimers();
    nextScreen();
    jest.advanceTimersByTime(800);
    expect(window.location.href).toBe("intro.html");
    jest.useRealTimers();
  });
});
