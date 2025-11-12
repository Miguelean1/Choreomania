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
        denyButtonText: "No",
        background: '#ffffff',
        color: '#000000'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Redirecting...",
                icon: "success",
                background: '#ffffff',
                color: '#000000'
            });
        }
    });
}

function nextScreen() {
    document.body.style.transition = 'opacity 0.8s';
    document.body.style.opacity = '0';

    setTimeout(() => {
        window.location.href = 'intro.html';
    }, 800);
}