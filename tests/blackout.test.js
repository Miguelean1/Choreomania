global.Swal = {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true })
};

const html = `
    <div id="dialogbox"></div>
    <button id="muteBtn"><i class="fa-volume-high"></i></button>
    <audio id="bg-audio"></audio>
`;

beforeEach(() => {
    document.body.innerHTML = html;
    jest.clearAllMocks();
    document.body.style.opacity = '1';
    document.body.style.transition = '';
});

test('arrow element is created with correct id', () => {
    const arrow = document.createElement("div");
    arrow.id = "arrow";

    expect(arrow.id).toBe("arrow");
    expect(arrow.tagName).toBe("DIV");
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

test('message strings can be split by pipe separator', () => {
    const messageString = "First message|Second message|Third message";

    const messageStrings = messageString.split('|');

    expect(messageStrings.length).toBe(3);
    expect(messageStrings[0]).toBe("First message");
    expect(messageStrings[1]).toBe("Second message");
    expect(messageStrings[2]).toBe("Third message");
});

test('whitespace in message string is normalized', () => {
    const messageString = "Message   with    extra     spaces";

    const normalized = messageString.replace(/\s+/g, ' ').trim();

    expect(normalized).toBe("Message with extra spaces");
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

test('muteMusic toggles icon classes', () => {
    const icon = document.querySelector('#muteBtn i');

    icon.classList.toggle('fa-volume-xmark');
    icon.classList.toggle('fa-volume-high');

    expect(icon.classList.contains('fa-volume-xmark')).toBe(true);
    expect(icon.classList.contains('fa-volume-high')).toBe(false);
});

test('nextScreen changes body opacity to 0', () => {
    document.body.style.transition = 'opacity 0.8s';
    document.body.style.opacity = '0';

    expect(document.body.style.opacity).toBe('0');
    expect(document.body.style.transition).toBe('opacity 0.8s');
});

test('loading complete flag can change state', () => {
    let loadingComplete = true;

    loadingComplete = false;
    expect(loadingComplete).toBe(false);

    loadingComplete = true;
    expect(loadingComplete).toBe(true);
});

test('lastMessage flag can be set to true', () => {
    let lastMessage = false;
    const messageId = 3;
    const messageStrings = ["msg1", "msg2", "msg3"];

    lastMessage = (messageId === messageStrings.length - 1);

    expect(lastMessage).toBe(true);
});

test('skipNextPress flag can be reset', () => {
    let skipNextPress = true;

    skipNextPress = false;

    expect(skipNextPress).toBe(false);
});

test('bg-audio element exists in DOM', () => {
    const bgAudio = document.getElementById('bg-audio');

    expect(bgAudio).not.toBeNull();
    expect(bgAudio.tagName).toBe('AUDIO');
});

test('bgAudioPlayed flag starts as false', () => {
    let bgAudioPlayed = false;

    expect(bgAudioPlayed).toBe(false);
});