const message = "And the chosen ones are...";
let shownText = "";
let index = 0;
let finished = false;
const arrow = document.getElementById('arrow');
const dialogText = document.getElementById('dialog-text');
const dialog = document.querySelector('.raffle-dialog');

function typeDialog() {
  if (index < message.length) {
    shownText += message[index];
    dialogText.textContent = shownText;
    index++;
    setTimeout(typeDialog, 37);
  } else {
    finished = true;
    dialog.classList.add("finished");
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(typeDialog, 400);
});
