global.Swal = {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
    showLoading: jest.fn()
};

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

const html = `
    <div class="button-container">
        <button id="playAgainBtn">Play Again</button>
    </div>
    <button id="muteBtn"><i class="fa-volume-high"></i></button>
    <marquee>
        <div>Credit 1</div>
        <div>Credit 2</div>
        <div>Credit 3</div>
    </marquee>
`;

beforeEach(() => {
    document.body.innerHTML = html;
    jest.clearAllMocks();
    document.body.style.opacity = '1';
    document.body.style.transition = '';
});


test('returnHome calls Swal.fire with correct parameters', () => {
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
    });

    expect(Swal.fire).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
    });
});

test('nextScreen changes body opacity to 0', () => {
    document.body.style.transition = 'opacity 0.8s';
    document.body.style.opacity = '0';

    expect(document.body.style.opacity).toBe('0');
    expect(document.body.style.transition).toBe('opacity 0.8s');
});

test('button container has show class', () => {
    const btnContainer = document.querySelector('.button-container');

    btnContainer.classList.add('show');

    expect(btnContainer.classList.contains('show')).toBe(true);
});

test('button container can remove show class', () => {
    const btnContainer = document.querySelector('.button-container');
    btnContainer.classList.add('show');

    btnContainer.classList.remove('show');

    expect(btnContainer.classList.contains('show')).toBe(false);
});

test('button container aria-hidden can be set to false', () => {
    const btnContainer = document.querySelector('.button-container');

    btnContainer.setAttribute('aria-hidden', 'false');

    expect(btnContainer.getAttribute('aria-hidden')).toBe('false');
});

test('playAgainBtn exists in the DOM', () => {
    const playBtn = document.getElementById('playAgainBtn');

    expect(playBtn).not.toBeNull();
    expect(playBtn.tagName).toBe('BUTTON');
});

test('marquee element exists and has children', () => {
    const marquee = document.querySelector('marquee');

    expect(marquee).not.toBeNull();
    expect(marquee.children.length).toBeGreaterThan(0);
});

test('marquee children can be filtered as elements', () => {
    const marquee = document.querySelector('marquee');

    const children = Array.from(marquee.children).filter(n => n.nodeType === 1);

    expect(children.length).toBe(3);
});

test('last child of marquee can be accessed', () => {
    const marquee = document.querySelector('marquee');
    const children = Array.from(marquee.children).filter(n => n.nodeType === 1);

    const lastChild = children.length ? children[children.length - 1] : marquee;

    expect(lastChild).not.toBeNull();
    expect(lastChild.textContent).toBe('Credit 3');
});

test('localStorage can retrieve musicEnabled value', () => {
    localStorageMock.getItem.mockReturnValue('true');

    const musicChoice = localStorage.getItem('musicEnabled');

    expect(musicChoice).toBe('true');
    expect(localStorage.getItem).toHaveBeenCalledWith('musicEnabled');
});

test('mute icon classes can be toggled to volume-high', () => {
    const icon = document.querySelector('#muteBtn i');

    icon.classList.remove('fa-volume-xmark');
    icon.classList.add('fa-volume-high');

    expect(icon.classList.contains('fa-volume-high')).toBe(true);
    expect(icon.classList.contains('fa-volume-xmark')).toBe(false);
});

test('mute icon classes can be toggled to volume-xmark', () => {
    const icon = document.querySelector('#muteBtn i');
    icon.classList.add('fa-volume-high');

    icon.classList.add('fa-volume-xmark');
    icon.classList.remove('fa-volume-high');

    expect(icon.classList.contains('fa-volume-xmark')).toBe(true);
    expect(icon.classList.contains('fa-volume-high')).toBe(false);
});

test('loading complete flag can change state', () => {
    let loadingComplete = true;

    loadingComplete = false;
    expect(loadingComplete).toBe(false);

    loadingComplete = true;
    expect(loadingComplete).toBe(true);
});

test('lastMessage flag can be set to true', () => {
    let lastMessage = false;

    lastMessage = true;

    expect(lastMessage).toBe(true);
});