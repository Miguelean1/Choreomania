let contestants = [];
const MAX_PLAYERS = 15;

const nameInput = document.getElementById("name");
const addBtn = document.getElementById("addBtn");
const charactersGrid = document.getElementById("charactersGrid");
const form = document.getElementById("form");




























function restartGame() {
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

function toggleMute() {
            const icon = document.querySelector('#muteBtn i');
            icon.classList.toggle('fa-volume-xmark');
            icon.classList.toggle('fa-volume-high');
}









