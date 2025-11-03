const fullText = "Congratulations, contestant. You've done what few could, proved that humanity still endures. Your rhythm, your will, your spirit… all unmatched. But the terms have changed. Survival isn't a reward, it's a duty. New Esperanza needs workers, not dreamers. Your new destination: Labor Complex Nine, orbiting Saturn's rings. There, you'll build the future your dance once promised. Rejoice, champion. You've earned your place among the stars. The contract is already signed… just not the one you expected.";

let currentText = "";
let currentIndex = 0;
let isTyping = true;

function typeText() {
    const dialogElement = document.getElementById('dialog-text');
    const arrow = document.getElementById('arrow');
    
    if (currentIndex < fullText.length) {
        currentText += fullText[currentIndex];
        dialogElement.textContent = currentText;
        currentIndex++;
        setTimeout(typeText, 50);
    } else {
        isTyping = false;
        arrow.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(typeText, 1000);
});

document.getElementById('dialog-text').addEventListener('click', function() {
    if (isTyping) {
        currentText = fullText;
        document.getElementById('dialog-text').textContent = currentText;
        currentIndex = fullText.length;
        isTyping = false;
        document.getElementById('arrow').style.display = 'block';
    }
});
