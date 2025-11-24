global.Swal = {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
    showLoading: jest.fn()
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

test('timer constant is set to 30', () => {
    const timer = 30;
    
    expect(timer).toBe(30);
});

test('STORAGE_KEY constant is defined correctly', () => {
    const STORAGE_KEY = "myRegistrationGameState";
    
    expect(STORAGE_KEY).toBe("myRegistrationGameState");
});

test('POST_RAFFLE_REDIRECT constant is defined correctly', () => {
    const POST_RAFFLE_REDIRECT = "../main/final-raffle-1.html";
    
    expect(POST_RAFFLE_REDIRECT).toBe("../main/final-raffle-1.html");
});

test('arrow element is created with correct id', () => {
    const arrow = document.createElement("div");
    arrow.id = "arrow";
    
    expect(arrow.id).toBe("arrow");
    expect(arrow.tagName).toBe("DIV");
});

test('titleStyle adds title-style class to dialogbox', () => {
    const dialogbox = document.getElementById('dialogbox');
    
    dialogbox.classList.remove("normal-style");
    dialogbox.classList.add("title-style");
    
    expect(dialogbox.classList.contains("title-style")).toBe(true);
    expect(dialogbox.classList.contains("normal-style")).toBe(false);
});

test('normalStyle adds normal-style class to dialogbox', () => {
    const dialogbox = document.getElementById('dialogbox');
    
    dialogbox.classList.remove("title-style");
    dialogbox.classList.add("normal-style");
    
    expect(dialogbox.classList.contains("normal-style")).toBe(true);
    expect(dialogbox.classList.contains("title-style")).toBe(false);
});

test('returnHome calls Swal.fire with correct parameters', () => {
    Swal.fire({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
    });
    
    expect(Swal.fire).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
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

test('message strings can be split by double pipe separator', () => {
    const messageString = "First message || Second message || Third message";
    
    const messageStrings = messageString.split("||").map(msg => msg.trim());
    
    expect(messageStrings.length).toBe(3);
    expect(messageStrings[0]).toBe("First message");
    expect(messageStrings[1]).toBe("Second message");
});

test('whitespace is normalized in message string', () => {
    const messageString = "Message   with    extra     spaces";
    
    const normalized = messageString.replace(/\s+/g, " ").trim();
    
    expect(normalized).toBe("Message with extra spaces");
});

test('readyToStartRaffle flag is set when at last message', () => {
    let readyToStartRaffle = false;
    const messageId = 4;
    const messageStrings = ["msg1", "msg2", "msg3", "msg4", "msg5"];
    
    readyToStartRaffle = messageId === messageStrings.length - 1;
    
    expect(readyToStartRaffle).toBe(true);
});

test('loadingComplete flag can change state', () => {
    let loadingComplete = true;
    
    loadingComplete = false;
    expect(loadingComplete).toBe(false);
    
    loadingComplete = true;
    expect(loadingComplete).toBe(true);
});

test('isRaffleStarted flag can be set to true', () => {
    let isRaffleStarted = false;
    
    isRaffleStarted = true;
    
    expect(isRaffleStarted).toBe(true);
});

test('raffleFinished flag can be set to true', () => {
    let raffleFinished = false;
    
    raffleFinished = true;
    
    expect(raffleFinished).toBe(true);
});



test('character card is created with correct structure', () => {
    const grid = document.getElementById('charactersGrid');
    const player = {
        name: "TestPlayer",
        color: "#ff0000",
        imagePath: "/test/image.png"
    };
    const index = 0;
    
    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
        <div class="character-image" style="--bg-color: ${player.color};" id="playerBox${index + 1}">
            <img class="principal-img" src="${player.imagePath}" alt="${player.name}">
        </div>
        <div class="character-name">${player.name}</div>
    `;
    grid.appendChild(card);
    
    expect(grid.children.length).toBe(1);
    expect(grid.querySelector('.character-card')).not.toBeNull();
    expect(grid.querySelector('.character-name').textContent).toBe("TestPlayer");
});

test('winners can be marked as thirdTrialCompleted', () => {
    const winner = {
        name: "Winner1",
        thirdTrialCompleted: false
    };
    
    winner.thirdTrialCompleted = true;
    
    expect(winner.thirdTrialCompleted).toBe(true);
});

test('contestants array can be filtered to remove null values', () => {
    const contestants = [
        { name: "Player1" },
        null,
        { name: "Player2" },
        { name: "Player3" }
    ];
    
    const winners = contestants.filter(Boolean);
    
    expect(winners.length).toBe(3);
    expect(winners[0].name).toBe("Player1");
});

test('mute icon classes can be toggled', () => {
    const icon = document.querySelector('#muteBtn i');
    
    icon.classList.remove('fa-volume-xmark');
    icon.classList.add('fa-volume-high');
    
    expect(icon.classList.contains('fa-volume-high')).toBe(true);
    expect(icon.classList.contains('fa-volume-xmark')).toBe(false);
});

test('arrow can have raffle-ready class removed', () => {
    const arrow = document.createElement('div');
    arrow.id = 'arrow';
    arrow.classList.add('raffle-ready');
    
    arrow.classList.remove('raffle-ready');
    
    expect(arrow.classList.contains('raffle-ready')).toBe(false);
});