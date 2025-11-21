global.Swal = {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true })
};

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

const html = `
    <div id="dialogbox"></div>
    <div id="charactersGrid"></div>
    <button id="muteBtn"><i class="fa-volume-high"></i></button>
`;

beforeEach(() => {
    document.body.innerHTML = html;
    jest.clearAllMocks();
});

test('titleStyle adds title-style class to dialogbox', () => {
    const dialogbox = document.getElementById('dialogbox');

    dialogbox.classList.remove('normal-style');
    dialogbox.classList.add('title-style');

    expect(dialogbox.classList.contains('title-style')).toBe(true);
    expect(dialogbox.classList.contains('normal-style')).toBe(false);
});

test('normalStyle adds normal-style class to dialogbox', () => {
    const dialogbox = document.getElementById('dialogbox');

    dialogbox.classList.remove('title-style');
    dialogbox.classList.add('normal-style');

    expect(dialogbox.classList.contains('normal-style')).toBe(true);
    expect(dialogbox.classList.contains('title-style')).toBe(false);
});

test('arrow element is created with correct id', () => {
    const arrow = document.createElement("div");
    arrow.id = "arrow";

    expect(arrow.id).toBe("arrow");
    expect(arrow.tagName).toBe("DIV");
});

test('returnHome calls Swal.fire with correct parameters', () => {
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: '#ffffff',
        color: '#000000'
    });

    expect(Swal.fire).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: '#ffffff',
        color: '#000000'
    });
});

test('dialogbox innerHTML can be cleared', () => {
    const dialogbox = document.getElementById('dialogbox');
    dialogbox.innerHTML = "Some text here";

    dialogbox.innerHTML = "";

    expect(dialogbox.innerHTML).toBe("");
});

test('dialogbox can append arrow element', () => {
    const dialogbox = document.getElementById('dialogbox');
    const arrow = document.createElement("div");
    arrow.id = "arrow";

    dialogbox.appendChild(arrow);

    expect(dialogbox.querySelector('#arrow')).not.toBeNull();
    expect(dialogbox.contains(arrow)).toBe(true);
});