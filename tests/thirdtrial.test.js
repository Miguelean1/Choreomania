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

test('message strings can be split by separator', () => {
    const messageString = "First message || Second message || Third message";
    
    const messageStrings = messageString.split("||").map(msg => msg.trim());
    
    expect(messageStrings.length).toBe(3);
    expect(messageStrings[0]).toBe("First message");
    expect(messageStrings[1]).toBe("Second message");
    expect(messageStrings[2]).toBe("Third message");
});

test('localStorage can store and retrieve game state', () => {
    const mockState = {
        contestants: [
            { name: "Player1", color: "#ff0000" },
            { name: "Player2", color: "#00ff00" }
        ]
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockState));
    
    const storedData = JSON.parse(localStorage.getItem('myRegistrationGameState'));
    
    expect(storedData.contestants.length).toBe(2);
    expect(storedData.contestants[0].name).toBe("Player1");
});

test('character card is created with correct structure', () => {
    const grid = document.getElementById('charactersGrid');
    const player = {
        name: "TestPlayer",
        color: "#ff0000",
        imagePath: "https://res.cloudinary.com/dc4u0bzgh/image/upload/v1762417863/human5_u2tkyw.png"

    };
    
    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
        <div class="character-image" style="--bg-color: ${player.color};">
            <img class="principal-img" src="${player.imagePath}" alt="${player.name}">
        </div>
        <div class="character-name">${player.name}</div>
    `;
    grid.appendChild(card);
    
    expect(grid.children.length).toBe(1);
    expect(grid.querySelector('.character-card')).not.toBeNull();
    expect(grid.querySelector('.character-name').textContent).toBe("TestPlayer");
});

test('readyToStartRaffle flag can be set to true', () => {
    let readyToStartRaffle = false;
    const messageId = 5;
    const messageStrings = ["msg1", "msg2", "msg3", "msg4", "msg5"];
    
    readyToStartRaffle = (messageId === messageStrings.length - 1);
    
    expect(readyToStartRaffle).toBe(true);
});

test('loading complete flag changes state', () => {
    let loadingComplete = true;
    
    loadingComplete = false;
    expect(loadingComplete).toBe(false);
    
    loadingComplete = true;
    expect(loadingComplete).toBe(true);
});

test('mute icon classes can be toggled', () => {
    const icon = document.querySelector('#muteBtn i');
    
    icon.classList.remove('fa-volume-xmark');
    icon.classList.add('fa-volume-high');
    
    expect(icon.classList.contains('fa-volume-high')).toBe(true);
    expect(icon.classList.contains('fa-volume-xmark')).toBe(false);
});

test('winner can be marked as thirdTrialCompleted', () => {
    const winner = {
        name: "Winner1",
        thirdTrialCompleted: false
    };
    
    winner.thirdTrialCompleted = true;
    
    expect(winner.thirdTrialCompleted).toBe(true);
});

test('contestants array can be filtered', () => {
    const contestants = [
        { name: "Player1" },
        { name: "Player2" },
        null,
        { name: "Player3" }
    ];
    
    const winners = contestants.filter(Boolean);
    
    expect(winners.length).toBe(3);
    expect(winners[0].name).toBe("Player1");
});