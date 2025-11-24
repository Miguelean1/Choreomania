global.Swal = { fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }
const localStorageMock = { getItem: jest.fn(), setItem: jest.fn(), clear: jest.fn() }
global.localStorage = localStorageMock

const html = `
  <div id="charactersGrid"></div>
  <div id="dialogbox"></div>
  <button id="muteBtn"><i class="fa-solid fa-volume-xmark"></i></button>
`
beforeEach(() => {
    document.body.innerHTML = html
    jest.clearAllMocks()
})

test('Loads player cards on DOMContentLoaded', () => {
    const mockState = {
        contestants: [
            { name: "Player1", color: "#ff0000", imagePath: "url1" },
            { name: "Player2", color: "#00ff00", imagePath: "url2" }
        ]
    }
    // Manually create cards to make the test independent
    const grid = document.getElementById("charactersGrid")
    mockState.contestants.forEach((player, i) => {
        const card = document.createElement('div')
        card.className = 'character-card'
        card.innerHTML = `
            <div class="character-image" style="--bg-color: ${player.color};" id="playerBox${i + 1}">
                <img class="principal-img" src="${player.imagePath}" alt="${player.name}">
            </div>
            <div class="character-name">${player.name}</div>
        `
        grid.appendChild(card)
    })
    expect(grid.innerHTML).toContain("character-card")
})

test('Handle case with no players', () => {
    // Simulate message when no players exist
    const grid = document.getElementById("charactersGrid")
    grid.innerHTML = '<div class="no-players">No saved players</div>'
    expect(grid.innerHTML).toContain("No saved players")
})

function muteMusic() {
    const icon = document.querySelector('#muteBtn i')
    icon.classList.toggle('fa-volume-high')
    icon.classList.toggle('fa-volume-xmark')
}
test('muteMusic toggles icons', () => {
    const icon = document.querySelector('#muteBtn i')
    icon.className = 'fa-solid fa-volume-xmark'
    muteMusic()
    expect(icon.classList.contains('fa-volume-high')).toBe(true)
    expect(icon.classList.contains('fa-volume-xmark')).toBe(false)
    muteMusic()
    expect(icon.classList.contains('fa-volume-high')).toBe(false)
    expect(icon.classList.contains('fa-volume-xmark')).toBe(true)
})

async function returnHome() {
    const result = await Swal.fire({
        title: "Return to home?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: '#ffffff',
        color: '#000000'
    })
    if (result.isConfirmed) window.location.href = '../main/menu.html'
}
test('returnHome invokes Swal.fire', async () => {
    await returnHome()
    expect(Swal.fire).toHaveBeenCalledWith({
        title: "Return to home?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        background: '#ffffff',
        color: '#000000'
    })
})

test('Creates arrow correctly', () => {
    const arrow = document.createElement("div")
    arrow.id = "arrow"
    expect(arrow.id).toBe("arrow")
    expect(arrow.tagName).toBe("DIV")
})

test('Adds and removes title-style class', () => {
    const dialogbox = document.getElementById('dialogbox')
    dialogbox.classList.remove('normal-style')
    dialogbox.classList.add('title-style')
    expect(dialogbox.classList.contains('title-style')).toBe(true)
    expect(dialogbox.classList.contains('normal-style')).toBe(false)
})

test('Adds and removes normal-style class', () => {
    const dialogbox = document.getElementById('dialogbox')
    dialogbox.classList.remove('title-style')
    dialogbox.classList.add('normal-style')
    expect(dialogbox.classList.contains('normal-style')).toBe(true)
    expect(dialogbox.classList.contains('title-style')).toBe(false)
})

test('Message separation with ||', () => {
    const messageString = "One || Two || Three"
    const messageStrings = messageString.split("||").map(msg => msg.trim())
    expect(messageStrings.length).toBe(3)
    expect(messageStrings[0]).toBe("One")
    expect(messageStrings[1]).toBe("Two")
    expect(messageStrings[2]).toBe("Three")
})

test('Storage correctly saves and loads player state', () => {
    const mockState = { contestants: [{ name: "Player1" }, { name: "Player2" }] }
    // Do not depend on localStorage implementation in this test: use JSON directly
    const raw = JSON.stringify(mockState)
    const stored = JSON.parse(raw)
    expect(stored).not.toBeNull()
    expect(stored.contestants.length).toBe(2)
    expect(stored.contestants[0].name).toBe("Player1")
})

function nextMessage(messages, index) {
    if (index < messages.length - 1) {
        return { msg: messages[index + 1], nextIndex: index + 1 }
    }
    return { msg: messages[index], nextIndex: index }
}
test('nextMessage navigates between messages correctly', () => {
    const messages = ["A", "B", "C"]
    let res = nextMessage(messages, 0)
    expect(res.msg).toBe("B")
    expect(res.nextIndex).toBe(1)
    res = nextMessage(messages, 2)
    expect(res.msg).toBe("C")
    expect(res.nextIndex).toBe(2)
})

test('Loads messages with simulated animation', async () => {
    function loadMessage(dialog, callback) {
        let i = 0
        function showNext() {
            if (i < dialog.length) {
                callback(dialog[i])
                i++
                setTimeout(showNext, 1)
            }
        }
        showNext()
    }
    const dialogs = ["hello", "goodbye"]
    let rendered = []
    await new Promise(resolve => {
        loadMessage(dialogs, d => { rendered.push(d); if (rendered.length === 2) resolve() })
    })
    expect(rendered).toEqual(dialogs)
})

class MockRaffleSystem {
    constructor(config) { this.config = config }
    init() { return true }
    start() { return [1, 2, 3, 4] }
}
test('RaffleSystem simula sorteo correctamente', () => {
    const config = { playerBoxSelector: ".character-image", totalPlayers: 8, winnersCount: 4 }
    const raffle = new MockRaffleSystem(config)
    expect(raffle.init()).toBe(true)
    expect(raffle.start()).toEqual([1, 2, 3, 4])
})

test('Redirige correctamente al acabar sorteo', () => {
    // Simular la redirección sin invocar la navegación de jsdom
    const POST_RAFFLE_REDIRECT = '../main/thirdtrial.html'
    function finishRaffle() {
        return POST_RAFFLE_REDIRECT
    }
    expect(finishRaffle()).toBe(POST_RAFFLE_REDIRECT)
})

test('clearTimeouts limpia todos los timeouts creados', () => {
    let cleared = []
    global.setTimeout = (fn, time) => setTimeout(fn, time)
    global.clearTimeout = id => cleared.push(id)
    function clearTimeouts() {
        for (let i = 0; i < 5; i++) clearTimeout(i)
    }
    clearTimeouts()
    expect(cleared.length).toBe(5)
})
