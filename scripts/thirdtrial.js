const timer = 30;
const STORAGE_KEY = 'myRegistrationGameState';
var messageStrings;
var dialogbox;
var currMessage;
var messageId;
var applytitlestyle = true;
var loadingComplete = true;
var skipNextPress = false;
let isMessageSkipped = false;
var readyToStartRaffle = false;
var isRaffleStarted = false;
var raffleFinished = false;
const POST_RAFFLE_REDIRECT = '../main/final-raffle.html';

var arrow = document.createElement("div");
arrow.id = "arrow";

document.addEventListener("DOMContentLoaded", function(){
	// Cargar personajes desde localStorage
	try {
		const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
		const players = storedData?.contestants ?? [];
		
		if (players.length > 0) {
			const grid = document.getElementById("charactersGrid");
			if (grid) {
				players.forEach((player, index) => {
					const card = document.createElement('div');
					card.className = 'character-card';
					card.innerHTML = `
						<div class="character-image" style="--bg-color: ${player.color}; --bg-color-dark: ${player.color};" id="playerBox${index + 1}">
							<img class="principal-img" src="${player.imagePath}" alt="${player.name}">
						</div>
						<div class="character-name">${player.name}</div>
					`;
					grid.appendChild(card);
				});
			}
		}
	} catch (e) {
		console.error('Error cargando personajes:', e);
	}
}, false);

document.addEventListener(
    "DOMContentLoaded",
    function () {
        dialogbox = document.getElementById("dialogbox");
        var messageString = dialogbox.innerHTML.replace(/\s+/g, " ").trim();

        messageStrings = messageString.split("||").map((msg) => msg.trim());
        dialogbox.innerHTML = "";
        messageId = 0;
        currMessage = messageStrings[messageId];
        nextMessage();

        document.getElementById("dialogbox").addEventListener("click", function (e) {

            // Si el sorteo está en marcha, bloquear cualquier clic en el dialogbox
            if (isRaffleStarted) {
                e.stopPropagation();
                return;
            }

            // Si el sorteo ya terminó, permitir clic que redirige al componente destino
            if (raffleFinished) {
                // redirige a la ruta configurada
                window.location.href = POST_RAFFLE_REDIRECT;
                return;
            }

            if (!loadingComplete) {
                clearTimeouts();
                dialogbox.innerHTML = currMessage;
                if (!dialogbox.contains(arrow)) {
                    dialogbox.appendChild(arrow);
                }
                loadingComplete = true;
            } else if (readyToStartRaffle && loadingComplete && !isRaffleStarted) {

                isRaffleStarted = true;

                e.stopPropagation();
                animateRaffle();
            } else if (!skipNextPress) {

                nextMessage();
            } else {
                skipNextPress = false;
            }
        });
    },
    false
);



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


function titleStyle(){
	dialogbox.classList.remove('normal-style');
	dialogbox.classList.add('title-style');
}

function normalStyle(){
	dialogbox.classList.remove('title-style');
	dialogbox.classList.add('normal-style');
}

function nextMessage() {
    if (!loadingComplete || skipNextPress) {
        skipNextPress = false;
        return;
    }

    if (messageId >= messageStrings.length) {
        messageId = messageStrings.length - 1;
    }
    currMessage = messageStrings[messageId];
    
    // Determinar si estamos en el último mensaje (preparado para sorteo)
    readyToStartRaffle = (messageId === messageStrings.length - 1);
	
	if (applytitlestyle) {
		if (messageId == 1 || messageId == messageStrings.length) {
			titleStyle();
		} else {
			normalStyle();
		}
	}
	
	// Solo incrementamos si NO estamos en el último mensaje
	if (!readyToStartRaffle) {
		messageId++;
	}
	
    loadMessage(currMessage.split(''));
}

function loadMessage(dialog) {
    loadingComplete = false;
    dialogbox.innerHTML = "";
    for (let i = 0; i < dialog.length; i++) {
        setTimeout(function() {
            dialogbox.innerHTML += dialog[i];
            if (i === dialog.length - 1) {
                dialogbox.appendChild(arrow);
                loadingComplete = true;
            }
        }, timer * i);
    }
}

document.addEventListener('keydown', function(e) {
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

document.addEventListener('keyup', function(e) {
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

// ============================================
// SISTEMA DE SORTEO (usando módulo raffle.js)
// ============================================

let raffleSystem = null;

function animateRaffle() {
    if (!raffleSystem) {
        // Inicializar el sistema de sorteo con la configuración actual
        raffleSystem = new RaffleSystem({
            playerBoxSelector: '.character-image', // Selector CSS de los elementos
            totalPlayers: 4,                       // Total de jugadores
            winnersCount: 2,                       // Cantidad a seleccionar (ganador final)
            animationDuration: 2000,               // Duración de la animación
            selectedClass: 'selected',             // Clase CSS para seleccionados
            glowColor: 'gold'                      // Color del brillo
        });
        raffleSystem.init();
    }

    // Ejecutar el sorteo
    raffleSystem.start((selectedIndices) => {
        console.log('Sorteo final completado. Índice del ganador:', selectedIndices);
        raffleFinished = true;
        isRaffleStarted = false;
        // Actualizar `myRegistrationGameState` para conservar solo a los ganador
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const state = raw ? JSON.parse(raw) : { contestants: [] };
            state.contestants = state.contestants || [];
            const winners = selectedIndices
                .map((idx) => state.contestants[idx])
                .filter(Boolean);
            winners.forEach((w) => {
                if (w) w.thirdTrialCompleted = true;
            });
            state.contestants = winners;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Error actualizando myRegistrationGameState:', e);
        }
        try {
            if (dialogbox) {
                dialogbox.innerHTML = 'And now, only two remain. The final step before one earns the right to ascend.';
                if (!dialogbox.contains(arrow)) {
                    dialogbox.appendChild(arrow);
                }
                loadingComplete = true;
                arrow.classList.remove('raffle-ready');
            }
        } catch (err) {
            console.warn('Could not update dialogbox after raffle:', err);
        }
    });
}


