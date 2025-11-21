describe('muteMusic', () => {
    let mockIcon;
    let muteMusic;
    
    beforeEach(() => {
        document.body.innerHTML = `
            <button id="muteBtn">
                <i class="fa-volume-high"></i>
            </button>
        `;
        
        mockIcon = document.querySelector('#muteBtn i');
        
        muteMusic = function() {
            const icon = document.querySelector('#muteBtn i');
            icon.classList.toggle('fa-volume-xmark');
            icon.classList.toggle('fa-volume-high');
        };
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('should change between sound icons', () => {
        expect(mockIcon.classList.contains('fa-volume-high')).toBe(true);
        
        muteMusic();

        expect(mockIcon.classList.contains('fa-volume-xmark')).toBe(true);
    });
});


describe('returnHome', () => {
    let returnHome;
    let mockSwal;

    beforeEach(() => {
        mockSwal = {
            fire: jest.fn().mockResolvedValue({ isConfirmed: false })
        };
        global.Swal = mockSwal;

        returnHome = function() {
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
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should show confirm box', () => {
        returnHome();

        expect(mockSwal.fire).toHaveBeenCalled();
        expect(mockSwal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Do you want to go to the homepage?",
                confirmButtonText: "Yes"
            })
        );
    });
});


describe('nextScreen', () => {
    let nextScreen;

    beforeEach(() => {
        jest.useFakeTimers();
        
        delete window.location;
        window.location = { href: '' };

        document.body.style.transition = '';
        document.body.style.opacity = '';

        nextScreen = function() {
            document.body.style.transition = 'opacity 0.8s';
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = 'intro.html';
            }, 800);
        };
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('should apply opacicty 0', () => {
        nextScreen();

        expect(document.body.style.opacity).toBe('0');
    });
});