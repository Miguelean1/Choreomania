
const paragraphs = [
    "Year 2047. Earth no longer belongs to us. From the ruins of a dying world came the Lagomorph Sapiens: humanoid rabbits born from a failed experiment. They spread fast, too fast, and within months they ruled everything.",
    "Obsessed with disco music and flashy attires, cities became their stages. Humans were forced to dance for them, day and night, trapped in an endless rhythm under their glowing eyes. Those who stopped… disappeared.",
    "But once a year, the music pauses. The mysterious Benefactor interrupts every broadcast, offering a single escape: one ticket aboard the New Esperanza, a ship bound for Saturn and freedom from the rabbits' reign.",
    "Sixteen are chosen. Four deadly trials await. Only one will earn the right to ascend.",
    "Now, the world watches. The Ceremony of Ascension begins. Will you rise to the stars… or keep dancing for their pleasure?"
];

const textBox = document.getElementById('textBox');
const buttonContainer = document.getElementById('buttonContainer');
const progressDots = document.querySelectorAll('.dot');
const backgrounds = document.querySelectorAll('.background');
const arrow = document.getElementById('arrow');

let currentParagraphIndex = 0;
let currentText = '';
let charIndex = 0;
const speed = 50;
let isTyping = false;

function updateProgressDots() {
    progressDots.forEach((dot, index) => {
        if (index === currentParagraphIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function updateBackground() {
    backgrounds.forEach((bg, index) => {
        if (index === currentParagraphIndex) {
            bg.classList.add('active');
        } else {
            bg.classList.remove('active');
        }
    });
}

function typeText() {
    if (charIndex < currentText.length) {
        isTyping = true;
        arrow.classList.remove('show');
        const p = textBox.querySelector('p') || document.createElement('p');
        if (!textBox.querySelector('p')) {
            textBox.appendChild(p);
        }

        p.textContent = currentText.substring(0, charIndex + 1);

        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        p.appendChild(cursor);

        charIndex++;

        setTimeout(() => {
            cursor.remove();
            typeText();
        }, speed);
    } else {
        isTyping = false;

        if (currentParagraphIndex < paragraphs.length - 1) {
            arrow.classList.add('show');
        }

        if (currentParagraphIndex === paragraphs.length - 1) {
            setTimeout(() => {
                buttonContainer.classList.add('show');
            }, 500);
        }
    }
}

function nextParagraph() {
    if (isTyping) {

        const p = textBox.querySelector('p');
        if (p) {
            p.textContent = currentText;
        }
        isTyping = false;
        charIndex = currentText.length;


        if (currentParagraphIndex < paragraphs.length - 1) {
            arrow.classList.add('show');
        }

        if (currentParagraphIndex === paragraphs.length - 1) {
            setTimeout(() => {
                buttonContainer.classList.add('show');
            }, 300);
        }
    } else if (currentParagraphIndex < paragraphs.length - 1) {

        arrow.classList.remove('show');
        currentParagraphIndex++;
        currentText = paragraphs[currentParagraphIndex];
        charIndex = 0;
        textBox.innerHTML = '';
        updateProgressDots();
        updateBackground();
        typeText();
    }
}

function startIntro() {
    currentText = paragraphs[0];
    updateProgressDots();
    updateBackground();
    typeText();
}

function returnHome() {
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Returning to the homepage",
                timer: 1000,
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            }).then(() => {
                window.location.href = 'welcome.html';
            });
        }
    });
}

function skipScene() {
    Swal.fire({
        title: "Are you sure you want to skip the intro?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: '#ffffffff',
        color: '#000000ff'
    }).then((result) => {
        if (result.isConfirmed) {
            nextScreen();
        }
    });
}

function nextScreen() {
    document.body.style.transition = 'opacity 0.8s';
    document.body.style.opacity = '0';

    setTimeout(() => {
        alert('Loading next screen...');
        document.body.style.opacity = '1';
    }, 800);
}

function muteMusic() {
    const icon = document.querySelector('#muteBtn i');
    icon.classList.toggle('fa-volume-xmark');
    icon.classList.toggle('fa-volume-high');
}


document.addEventListener('click', (e) => {

    if (e.target.closest('button')) return;
    nextParagraph();
});


document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        nextParagraph();
    }
});

window.addEventListener('load', () => {
    setTimeout(startIntro, 1000);
});