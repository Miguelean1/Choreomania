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
        denyButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
}

function muteMusic() {
    const icon = document.querySelector('#muteBtn i');
    icon.classList.toggle('fa-volume-xmark');
    icon.classList.toggle('fa-volume-high');
}

function titleStyle() {
    dialogbox.classList.remove('normal-style');
    dialogbox.classList.add('title-style');
}

function normalStyle() {
    dialogbox.classList.remove('title-style');
    dialogbox.classList.add('normal-style');
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

document.addEventListener("DOMContentLoaded", function() {
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
