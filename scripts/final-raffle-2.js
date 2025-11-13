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

function loadMessage(dialog) {
    loadingComplete = false;
    // Lock the dialog height to avoid layout jump / flicker when clearing content
    if (dialogbox) {
        dialogbox.style.minHeight = dialogbox.offsetHeight + 'px';
    }
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
            // allow the box to resize again for the next message
            if (dialogbox) {
                dialogbox.style.minHeight = '';
            }
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
        messageId = 0;
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
    if (typeof typeDialog === 'function') {
        setTimeout(typeDialog, 400);
    }
});

