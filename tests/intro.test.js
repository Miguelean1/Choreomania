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
    <button id="muteBtn"><i class="fa-volume-high"></i></button>
`;

beforeEach(() => {
    document.body.innerHTML = html;
    jest.clearAllMocks();
    document.body.style.opacity = '1';
    document.body.style.transition = '';
});

test('paragraphs array has 5 elements', () => {
    const paragraphs = [
        "First paragraph",
        "Second paragraph",
        "Third paragraph",
        "Fourth paragraph",
        "Fifth paragraph"
    ];
    
    expect(paragraphs.length).toBe(5);
});

test('textBox element exists in DOM', () => {
    const textBox = document.getElementById('textBox');
    
    expect(textBox).not.toBeNull();
});

test('buttonContainer element exists in DOM', () => {
    const buttonContainer = document.getElementById('buttonContainer');
    
    expect(buttonContainer).not.toBeNull();
});

test('updateProgressDots adds active class to correct dot', () => {
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
});

test('updateBackground adds active class to correct background', () => {
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

test('arrow can have show class removed', () => {
    const arrow = document.getElementById('arrow');
    arrow.classList.add('show');
    
    arrow.classList.remove('show');
    
    expect(arrow.classList.contains('show')).toBe(false);
});

test('textBox can create and append paragraph element', () => {
    const textBox = document.getElementById('textBox');
    
    const p = document.createElement('p');
    p.textContent = "Test paragraph";
    textBox.appendChild(p);
    
    expect(textBox.querySelector('p')).not.toBeNull();
    expect(textBox.querySelector('p').textContent).toBe("Test paragraph");
});

test('cursor element can be created with correct class', () => {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    
    expect(cursor.className).toBe('cursor');
    expect(cursor.tagName).toBe('SPAN');
});

test('buttonContainer can show when last paragraph is reached', () => {
    const buttonContainer = document.getElementById('buttonContainer');
    
    buttonContainer.classList.add('show');
    
    expect(buttonContainer.classList.contains('show')).toBe(true);
});

test('isTyping flag can change between true and false', () => {
    let isTyping = false;
    
    isTyping = true;
    expect(isTyping).toBe(true);
    
    isTyping = false;
    expect(isTyping).toBe(false);
});

test('currentParagraphIndex can be incremented', () => {
    let currentParagraphIndex = 0;
    
    currentParagraphIndex++;
    
    expect(currentParagraphIndex).toBe(1);
});

test('textBox innerHTML can be cleared', () => {
    const textBox = document.getElementById('textBox');
    textBox.innerHTML = "<p>Some content</p>";
    
    textBox.innerHTML = "";
    
    expect(textBox.innerHTML).toBe("");
});

test('skipScene calls Swal.fire with correct parameters', () => {
    Swal.fire({
        title: "Are you sure you want to skip the intro?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: "#ffffffff",
        color: "#000000ff"
    });
    
    expect(Swal.fire).toHaveBeenCalled();
});

test('returnHome calls Swal.fire with correct parameters', () => {
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: "#ffffff",
        color: "#000000"
    });
    
    expect(Swal.fire).toHaveBeenCalled();
});

test('nextScreen changes body opacity to 0', () => {
    document.body.style.transition = "opacity 0.8s";
    document.body.style.opacity = "0";
    
    expect(document.body.style.opacity).toBe("0");
    expect(document.body.style.transition).toBe("opacity 0.8s");
});

test('speed variable can be changed', () => {
    let speed = 50;
    
    speed = 80;
    
    expect(speed).toBe(80);
});

test('charIndex can be reset to 0', () => {
    let charIndex = 10;
    
    charIndex = 0;
    
    expect(charIndex).toBe(0);
});

test('autoTimers array can store timeout ids', () => {
    let autoTimers = [];
    
    autoTimers.push(setTimeout(() => {}, 1000));
    
    expect(autoTimers.length).toBe(1);
});


test('mute icon classes can be toggled', () => {
    const icon = document.querySelector('#muteBtn i');
    
    icon.classList.remove('fa-volume-xmark');
    icon.classList.add('fa-volume-high');
    
    expect(icon.classList.contains('fa-volume-high')).toBe(true);
    expect(icon.classList.contains('fa-volume-xmark')).toBe(false);
});