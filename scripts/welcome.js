function checkMusicPreference() {
    const musicChoice = localStorage.getItem("musicEnabled");

    if (musicChoice === "true") {
        playAudio();
    } else if (musicChoice === "false") {
        pauseAudio();
    } else {
        Swal.fire({
            title: "Choreomania is best played with music!",
            text: "Do you want to enable it for the best experience?",
            iconHtml:
                '<i class="fa-solid fa-music" style="color: #000000; display: block; margin: 0 auto; font-size: 55px;"></i>',
            showDenyButton: true,
            confirmButtonText: "YES",
            denyButtonText: "NO",
            background: "#ffffff",
            color: "#000000",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                playAudio();
            } else {
                pauseAudio();
            }
        });
    }
}

function returnHome() {
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: "#ffffff",
        color: "#000000",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Redirecting...",
                icon: "success",
                background: "#ffffff",
                color: "#000000",
            });
        }
    });
}

function nextScreen() {
    stopMusic();

    document.body.style.transition = "opacity 0.8s";
    document.body.style.opacity = "0";

    setTimeout(() => {
        window.location.href = "intro.html";
    }, 800);
}
module.exports = {
  returnHome, 
  normalStyle,
  titleStyle,
  nextMessage
};
