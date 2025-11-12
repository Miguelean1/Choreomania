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
                background: '#1a1a1a',
                color: '#ffffff'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Redirecting...",
                        icon: "success",
                        background: '#1a1a1a',
                        color: '#ffffff'
                    });
                }
            });
        }

        