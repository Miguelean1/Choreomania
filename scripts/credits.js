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
    
    initAudio('../assets/sounds/WelcomeMusic.mp3'); 

    const musicChoice = localStorage.getItem('musicEnabled');
    const icon = document.querySelector('#muteBtn i');

    if (musicChoice === 'true') {
        isMuted = false;
        if (icon) {
            icon.classList.remove('fa-volume-xmark');
            icon.classList.add('fa-volume-high');
        }
        playAudio(); 
    } else if (musicChoice === 'false') {
        isMuted = true;
        if (icon) {
            icon.classList.add('fa-volume-xmark');
            icon.classList.remove('fa-volume-high');
        }
    } else {
        isMuted = true;
        if (icon) {
            icon.classList.add('fa-volume-xmark');
        }
    }
}, false);

function returnHome() {
    stopMusic();
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

function nextScreen() {
    stopMusic(); 
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

// --- Mostrar botón "PLAY AGAIN?" cuando el <marquee> termine ---
(function() {
    const btnContainer = document.querySelector('.button-container');
    const playBtn = document.getElementById('playAgainBtn');

    if (!btnContainer || !playBtn) return;

    const marquee = document.querySelector('marquee');

    function showButton() {
        btnContainer.classList.add('show');
        btnContainer.setAttribute('aria-hidden', 'false');
    }

    if (marquee) {
        
        const children = Array.from(marquee.children).filter(n => n.nodeType === 1);
        const lastChild = children.length ? children[children.length - 1] : marquee;
        let rafId = null;
        const marqueeRect = () => marquee.getBoundingClientRect();
        function checkMarqueeEnd() {
            if (!lastChild) return;
            const lastRect = lastChild.getBoundingClientRect();
            const mRect = marqueeRect();
            if (lastRect.bottom <= mRect.top + 2) {
                showButton();
                if (rafId) cancelAnimationFrame(rafId);
                return;
            }
            rafId = requestAnimationFrame(checkMarqueeEnd);
        }
        checkMarqueeEnd();
        const fallback = setTimeout(() => {
            showButton();
            if (rafId) cancelAnimationFrame(rafId);
        }, 30000);

    } else {
        
        function checkScrollToEnd() {
            const scrolledToBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2);
            if (scrolledToBottom) {
                showButton();
                window.removeEventListener('scroll', onScroll);
            }
        }
        function onScroll() { checkScrollToEnd(); }
        checkScrollToEnd();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    playBtn.addEventListener('click', function() {
        stopMusic();
        btnContainer.classList.remove('show');
        setTimeout(function() {
            window.location.reload();
        }, 120);
    });

})();

