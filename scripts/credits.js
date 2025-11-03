const timer = 30;
var messageStrings;
var dialogbox;
var currMessage;
var messageId;
var applytitlestyle = true;
var loadingComplete = true;
var skipNextPress = false;
let isMessageSkipped = false;
var lastMessage = false;

var arrow = document.createElement("div");
arrow.id = "arrow";

document.addEventListener("DOMContentLoaded", function(){
	dialogbox = document.getElementById("dialogbox");
    var messageString = dialogbox.innerHTML.replace(/\s+/g, ' ').trim();
    messageStrings = messageString.split('|');
	dialogbox.innerHTML = "";
    messageId = 0;
	currMessage = messageStrings[messageId];
	nextMessage();
	
	document.getElementById("dialogbox").addEventListener("click", function() {
        if (!loadingComplete) {
            clearTimeouts();
            dialogbox.innerHTML = currMessage;
            if (!dialogbox.contains(arrow)) {
                dialogbox.appendChild(arrow);
            }
            loadingComplete = true;
        } else if (!skipNextPress) {

            if (lastMessage) {
                nextScreen();
            } else {
                nextMessage();
            }
        } else {
            skipNextPress = false;
        }
    });
}, false);


function muteMusic() {
            const icon = document.querySelector('#muteBtn i');
            icon.classList.toggle('fa-volume-xmark');
            icon.classList.toggle('fa-volume-high');
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
            Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
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

function clearTimeouts() {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
}