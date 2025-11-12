const timer = 30;
var messageStrings;
var dialogbox;
var currMessage;
var messageId;
var applytitlestyle = true;
var loadingComplete = true;
var skipNextPress = false;
let isMessageSkipped = false;

var arrow = document.createElement("div");
arrow.id = "arrow";

document.addEventListener("DOMContentLoaded", function () {
    dialogbox = document.getElementById("dialogbox");
    var messageString = dialogbox.innerHTML.replace(/\s+/g, ' ').trim();
    messageStrings = messageString.split('|');
    dialogbox.innerHTML = "";
    messageId = 0;
    currMessage = messageStrings[messageId];
    nextMessage();

    document.getElementById("dialogbox").addEventListener("click", function () {
        if (!loadingComplete) {
            clearTimeouts();
            dialogbox.innerHTML = currMessage;
            if (!dialogbox.contains(arrow)) {
                dialogbox.appendChild(arrow);
            }
            loadingComplete = true;
        } else if (!skipNextPress) {
            nextMessage();
        } else {
            skipNextPress = false;
        }
    });
}, false);



function returnHome() {
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
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


function titleStyle() {
    dialogbox.classList.remove('normal-style');
    dialogbox.classList.add('title-style');
}

function normalStyle() {
    dialogbox.classList.remove('title-style');
    dialogbox.classList.add('normal-style');
}

function nextMessage() {
    if (!loadingComplete || skipNextPress) {
        skipNextPress = false;
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
    loadMessage(currMessage.split(''));
}

function loadMessage(dialog) {
    loadingComplete = false;
    dialogbox.innerHTML = "";
    for (let i = 0; i < dialog.length; i++) {
        setTimeout(function () {
            dialogbox.innerHTML += dialog[i];
            if (i === dialog.length - 1) {
                dialogbox.appendChild(arrow);
                loadingComplete = true;
            }
        }, timer * i);
    }
}

document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && !loadingComplete && !isMessageSkipped) {
        clearTimeouts();
        dialogbox.innerHTML = currMessage;
        if (!dialogbox.contains(arrow)) {
            dialogbox.appendChild(arrow);
        }
        loadingComplete = true;
        isMessageSkipped = true;
    }
});

document.addEventListener('keyup', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && loadingComplete) {
        if (!isMessageSkipped) {
            nextMessage();
        }
        isMessageSkipped = false;
    }
});

function clearTimeouts() {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
}

