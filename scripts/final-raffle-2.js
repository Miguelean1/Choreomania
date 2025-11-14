const timer = 30;
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
var activeTimeouts = [];

var arrow = document.createElement("div");
arrow.id = "arrow";

function clearAllTimeouts() {
    activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeTimeouts = [];
}

document.addEventListener("DOMContentLoaded", function(){

	try {
		const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
		const players = storedData?.contestants ?? [];
		
		if (players.length > 0) {
			const grid = document.getElementById("characters-stage");
			if (grid) {
				players.forEach((player, index) => {
					const card = document.createElement('div');
					card.className = 'character-card';
					card.innerHTML = `
						<div class="character-name">${player.name}</div>
						<div class="character-image">
							<img src="${player.imagePath}" alt="${player.name}">
						</div>
					`;
					grid.appendChild(card);
				});
			}
		}
	} catch (e) {
		console.error('Error cargando personajes:', e);
	}
}, false);


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

function nextMessage() {
    if (!loadingComplete || skipNextPress) {
        skipNextPress = false;
        return;
    }

    if (messageId >= messageStrings.length) {
        messageId = messageStrings.length - 1;
    }
    currMessage = messageStrings[messageId];
    

    readyToStartRaffle = (messageId === messageStrings.length - 1);
	
	if (applytitlestyle) {
		if (messageId == 1 || messageId == messageStrings.length) {
			titleStyle();
		} else {
			normalStyle();
		}
	}
	

	if (!readyToStartRaffle) {
		messageId++;
	}
	
    loadMessage(currMessage.split(''));
}

document.addEventListener("DOMContentLoaded", function(){
    dialogbox = document.getElementById("dialogbox");
    var messageString = dialogbox.innerHTML.replace(/\s+/g, " ").trim();

    messageStrings = messageString.split("|").map((msg) => msg.trim());
    dialogbox.innerHTML = "";
    messageId = 0;
    currMessage = messageStrings[messageId];
    nextMessage();

    document.getElementById("dialogbox").addEventListener("click", function (e) {


        if (isRaffleStarted) {
            e.stopPropagation();
            return;
        }


        if (raffleFinished) {
            // redirige a la ruta configurada
            window.location.href = '../main/blackout.html';
            return;
        }

        if (!loadingComplete) {
            clearAllTimeouts();
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

document.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && !loadingComplete && !isMessageSkipped) {
        clearAllTimeouts();
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

document.addEventListener('DOMContentLoaded', function() {

});


let raffleSystem = null;

function animateRaffle() {
    if (!raffleSystem) {

        raffleSystem = new RaffleSystem({
            playerBoxSelector: '.character-name', 
            totalPlayers: 2,                      
            winnersCount: 1,                       
            animationDuration: 2000,               
            selectedClass: 'selected',             
            glowColor: 'gold'                      
        });
        raffleSystem.init();
    }


    raffleSystem.start((selectedIndices) => {
        console.log('Sorteo final completado. Índice del ganador:', selectedIndices);
        raffleFinished = true;
        isRaffleStarted = false;

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const state = raw ? JSON.parse(raw) : { contestants: [] };
            state.contestants = state.contestants || [];
            const winners = selectedIndices
                .map((idx) => state.contestants[idx])
                .filter(Boolean);
            winners.forEach((w) => {
                if (w) w.finalRaffleCompleted = true;
            });
            state.contestants = winners;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Error actualizando myRegistrationGameState:', e);
        }
        try {
            if (dialogbox) {
                dialogbox.innerHTML = 'The ascension is complete. Your name will be forever inscribed in our records.';
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

