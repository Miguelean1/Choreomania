const timer = 30;
var messageStrings;
var dialogbox;
var currMessage;
var messageId;
var applytitlestyle = false;
var loadingComplete = true;
var activeTimeouts = [];

var arrow = document.createElement("div");
arrow.id = "arrow";


function clearAllTimeouts() {
    activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeTimeouts = [];
}


function returnHome() {
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: '#ffffff',
        color: '#000000'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: "Saved!", icon: "success", background: '#ffffff', color: '#000000' });
        } else if (result.isDenied) {
            Swal.fire({ title: "Changes are not saved", icon: "info", background: '#ffffff', color: '#000000' });
        }
    });
}

function muteMusic() {
    const icon = document.querySelector('#muteBtn i');
    icon.classList.toggle('fa-volume-xmark');
    icon.classList.toggle('fa-volume-high');
}

function titleStyle(){
    dialogbox.classList.remove('normal-style');
    dialogbox.classList.add('title-style');
}

function normalStyle(){
    dialogbox.classList.remove('title-style');
    dialogbox.classList.add('normal-style');
}

function nextScreen() {
    clearAllTimeouts();

    const overlay = document.createElement('div');
    overlay.id = 'flash-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: '#ffffff',
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '2147483647',
        transition: 'opacity 80ms linear'
    });
    document.body.appendChild(overlay);

    const sequence = [
        { delay: 0,    opacity: '1' },
        { delay: 100,  opacity: '0' },
        { delay: 200,  opacity: '1' },
        { delay: 300,  opacity: '0' },
        { delay: 380,  opacity: '1' }
    ];

    sequence.forEach(step => {
        const id = setTimeout(() => {
            overlay.style.opacity = step.opacity;
        }, step.delay);
        activeTimeouts.push(id);
    });


    const navigateTimeout = setTimeout(() => {
        window.location.href = 'final-raffle-2.html';
    }, 480);
    activeTimeouts.push(navigateTimeout);
}

function loadMessage(dialog) {
    loadingComplete = false;
    dialogbox.innerHTML = "";
    
    let i = 0;
    function animateChar() {
        if (i < dialog.length) {
            dialogbox.innerHTML += dialog.charAt(i);
            i++;
            let timeoutId = setTimeout(animateChar, timer);
            activeTimeouts.push(timeoutId);
        } else {
            dialogbox.innerHTML += "<br>";
            if (!dialogbox.contains(arrow)) {
                dialogbox.appendChild(arrow);
            }
            loadingComplete = true;
            activeTimeouts = [];
        }
    }
    animateChar();
}

function nextMessage() {
    if (!loadingComplete) {
        return;
    }
    
    if (messageId >= messageStrings.length) {
        nextScreen();
        return;
    }

    currMessage = messageStrings[messageId];
    messageId++;
    
    if (applytitlestyle) {
        if (messageId == 1 || messageId == messageStrings.length) {
            titleStyle();
        } else {
            normalStyle();
        }
    }
    
    loadMessage(currMessage);
}

document.addEventListener("DOMContentLoaded", function(){
    dialogbox = document.getElementById("dialogbox");
    var messageString = dialogbox.innerHTML.replace(/\s+/g, ' ').trim();
    messageStrings = messageString.split('|');
    
    messageId = 0;
    currMessage = messageStrings[messageId];
    messageId++;
    
    dialogbox.innerHTML = "";
    loadMessage(currMessage);
    
    dialogbox.addEventListener("click", function() {
        if (!loadingComplete) {
            
            clearAllTimeouts();
            dialogbox.innerHTML = currMessage + "<br>";
            if (!dialogbox.contains(arrow)) {
                dialogbox.appendChild(arrow);
            }
            loadingComplete = true;
        } else {
            
            nextMessage();
        }
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        
        if (!loadingComplete) {
           
            clearAllTimeouts();
            dialogbox.innerHTML = currMessage + "<br>";
            if (!dialogbox.contains(arrow)) {
                dialogbox.appendChild(arrow);
            }
            loadingComplete = true;
        }
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        
        if (loadingComplete) {
            nextMessage();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(typeDialog, 400);
});

