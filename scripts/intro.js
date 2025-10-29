const fullText = `Year 2047. Earth no longer belongs to us. From the ruins of a dying world came the Lagomorph Sapiens: humanoid rabbits born from a failed experiment. They spread fast, too fast, and within months they ruled everything.

Obsessed with disco music and flashy attires, cities became their stages. Humans were forced to dance for them, day and night, trapped in an endless rhythm under their glowing eyes. Those who stopped… disappeared.

But once a year, the music pauses. The mysterious Benefactor interrupts every broadcast, offering a single escape: one ticket aboard the New Esperanza, a ship bound for Saturn and freedom from the rabbits' reign.

Sixteen are chosen. Four deadly trials await. Only one will earn the right to ascend.

Now, the world watches. The Ceremony of Ascension begins. Will you rise to the stars… or keep dancing for their pleasure?`;

const textBox = document.getElementById('textBox');
const buttonContainer = document.getElementById('buttonContainer');
let index = 0;
const speed = 65;
let currentParagraph = document.createElement('p');
textBox.appendChild(currentParagraph);

function typeText() {
    if (index < fullText.length) {
        const char = fullText[index];
        

        if (char === '\n' && fullText[index - 1] === '\n') {
            currentParagraph = document.createElement('p');
            textBox.appendChild(currentParagraph);
        } else if (char !== '\n') {
            currentParagraph.textContent += char;
        }
        

        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        currentParagraph.appendChild(cursor);
        
        index++;
        

        textBox.scrollTop = textBox.scrollHeight;
        
        setTimeout(() => {
            cursor.remove();
            typeText();
        }, speed);
    } else {

        setTimeout(() => {
            buttonContainer.classList.add('show');
        }, 500);
    }
}

function nextScreen() {

    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '0';
    
    setTimeout(() => {

        alert('Loading next screen...\n(In your game, this would navigate to the next scene)');
        document.body.style.opacity = '1';
    }, 500);
}


// Funciones vacías para evitar errores cuando se pulsa en los botones
function toggleMute() {
    // TODO: implementar control de audio
}

function restartGame() {
    // TODO: implementar reinicio del juego
}


window.addEventListener('load', () => {
    setTimeout(typeText, 500);
});