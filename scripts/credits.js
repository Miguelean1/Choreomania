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
        // Elegimos el último elemento dentro del marquee para detectar cuando pasa fuera
        const children = Array.from(marquee.children).filter(n => n.nodeType === 1);
        const lastChild = children.length ? children[children.length - 1] : marquee;

        let rafId = null;
        const marqueeRect = () => marquee.getBoundingClientRect();

        function checkMarqueeEnd() {
            if (!lastChild) return;
            const lastRect = lastChild.getBoundingClientRect();
            const mRect = marqueeRect();

            // Para marquee con direction="up": consideramos terminado cuando la parte inferior
            // del último elemento pasa por encima de la parte superior del marquee.
            if (lastRect.bottom <= mRect.top + 2) {
                showButton();
                if (rafId) cancelAnimationFrame(rafId);
                return;
            }
            rafId = requestAnimationFrame(checkMarqueeEnd);
        }

        // Iniciar comprobación. También agregamos un fallback por si algo falla.
        checkMarqueeEnd();
        const fallback = setTimeout(() => {
            showButton();
            if (rafId) cancelAnimationFrame(rafId);
        }, 30000); // 30s fallback

    } else {
        // Fallback: si no hay <marquee>, mostramos el botón al llegar al bottom (comportamiento antiguo)
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

    // Acción del botón: recargar la página para "play again" (se puede cambiar a otra ruta)
    playBtn.addEventListener('click', function() {
        btnContainer.classList.remove('show');
        setTimeout(function() {
            window.location.reload();
        }, 120);
    });

})();