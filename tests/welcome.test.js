const { checkMusicPreference, nextScreen } = require('../scripts/welcome.js');


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
global.localStorage = localStorageMock;

describe('checkMusicPreference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Swal.fire is called and can stop music', async () => {
    const resultDenied = { isConfirmed: false };
    swalFireMock.mockResolvedValueOnce(resultDenied);
    
    await checkMusicPreference();
    
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(pauseAudio).toHaveBeenCalledTimes(1);
  });

  test('init audio when confirmed', async () => {
    const resultConfirmed = { isConfirmed: true };
    swalFireMock.mockResolvedValueOnce(resultConfirmed);
    
    await checkMusicPreference();
    
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(playAudio).toHaveBeenCalledTimes(1);
  });
});

describe('nextScreen', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    delete window.location;
    window.location = { href: '', assign: jest.fn() };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.transition = '';
    document.body.style.opacity = '1';
  });

  test('opacity body to 0', () => {
    jest.useFakeTimers();
    
    nextScreen();
    
    expect(stopMusic).toHaveBeenCalledTimes(1);
    expect(document.body.style.transition).toBe('opacity 0.8s');
    expect(document.body.style.opacity).toBe('0');
    
    jest.runAllTimers();
    jest.useRealTimers();
  });

  
});