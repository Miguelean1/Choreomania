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

// --- Scroll-to-fixed final image logic ---
document.addEventListener('DOMContentLoaded', function () {
    const viewport = document.querySelector('.credits-viewport');
    if (!viewport) return;
    const track = viewport.querySelector('.credits-track');
    if (!track) return;

    // If the author set a data-duration on the viewport (e.g. "20s"), use it.
    const duration = viewport.dataset.duration || '20s';
    track.style.setProperty('--credits-duration', duration);

    // When the scrolling animation ends, clone the final image and fix it to the center.
    track.addEventListener('animationend', function () {
        // Try to find the image marked as the final one.
        const finalImg = track.querySelector('img.credits-final');
        if (finalImg) {
            const clone = finalImg.cloneNode(true);
            clone.classList.add('final-logo-fixed');
            // Remove any layout-only classes that may interfere
            clone.classList.remove('img-class');
            document.body.appendChild(clone);

            // Hide the scrolling area to avoid overlap
            viewport.style.visibility = 'hidden';
        }
    }, { once: true });
});