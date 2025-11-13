function checkMusicPreference() {
    const musicChoice = localStorage.getItem('musicEnabled');

    if (musicChoice === 'true') {
        playAudio(); 
    } else if (musicChoice === 'false') {
        pauseAudio(); 
    } else {
        Swal.fire({
            title: 'Choreomania is best played with music!',
            text: 'Do you want to enable it for the best experience?',
            iconHtml: '<i class="fa-solid fa-music" style="color: #000000; display: block; margin: 0 auto; font-size: 55px;"></i>', 
            showDenyButton: true,
            confirmButtonText: 'YES',
            denyButtonText: 'NO',
            background: '#ffffff', 
            color: '#000000',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                playAudio();
            } else {
                pauseAudio();
            }
        });
    }
}

