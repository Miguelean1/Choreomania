
global.Swal = {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true })
};


const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;


const html = `
    <div id="textBox"></div>
    <div id="buttonContainer"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="background"></div>
    <div class="background"></div>
    <div class="background"></div>
    <div class="background"></div>
    <div class="background"></div>
    <div id="arrow"></div>
`;


beforeEach(() => {
    document.body.innerHTML = html;
    jest.clearAllMocks();
});


test('updateProgressDots adds the active class to the according dot', () => {

    const dots = document.querySelectorAll('.dot');
    let currentParagraphIndex = 2;


    dots.forEach((dot, index) => {
        if (index === currentParagraphIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });


    expect(dots[2].classList.contains('active')).toBe(true);
    expect(dots[0].classList.contains('active')).toBe(false);
    expect(dots[1].classList.contains('active')).toBe(false);
});


test('updateBackground adds the active class to the proper background', () => {

    const backgrounds = document.querySelectorAll('.background');
    let currentParagraphIndex = 1;


    backgrounds.forEach((bg, index) => {
        if (index === currentParagraphIndex) {
            bg.classList.add('active');
        } else {
            bg.classList.remove('active');
        }
    });


    expect(backgrounds[1].classList.contains('active')).toBe(true);
    expect(backgrounds[0].classList.contains('active')).toBe(false);
});


test('typeText creates a  p element inside the textBox', () => {

    const textBox = document.getElementById('textBox');
    const texto = "Hola mundo";


    const p = document.createElement('p');
    p.textContent = texto;
    textBox.appendChild(p);


    expect(textBox.querySelector('p')).not.toBeNull();
    expect(textBox.querySelector('p').textContent).toBe("Hola mundo");
});


test('buttonContainer calls the class show', () => {

    const buttonContainer = document.getElementById('buttonContainer');


    buttonContainer.classList.add('show');


    expect(buttonContainer.classList.contains('show')).toBe(true);
});


test('skipScene calls Swal.fire accordingly', () => {

    Swal.fire({
        title: "Are you sure you want to skip the intro?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
    });


    expect(Swal.fire).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith({
        title: "Are you sure you want to skip the intro?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
    });
});


test('localStorage can storage and read musicEnabled', () => {

    localStorageMock.getItem.mockReturnValue('true');


    const musicChoice = localStorage.getItem('musicEnabled');


    expect(musicChoice).toBe('true');
    expect(localStorage.getItem).toHaveBeenCalledWith('musicEnabled');
});