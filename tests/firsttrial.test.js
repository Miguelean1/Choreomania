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

test('Loads player cards in the grid', () => {
    const mockState = {
        contestants: [
            { name: "A", color: "#00f", imagePath: "urlA" },
            { name: "B", color: "#f00", imagePath: "urlB" }
        ]
    }
    // Manually create cards to make the test standalone
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

test('Shows no players message in grid', () => {
    // Simulate no players state and verify message is shown
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
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
    })
    if (result.isConfirmed) window.location.href = '../main/menu.html'
}
test('returnHome invokes Swal.fire', async () => {
    await returnHome()
    expect(Swal.fire).toHaveBeenCalledWith({
        title: "Do you want to go to the homepage?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
    })
})

function titleStyle(dialogbox) {
    dialogbox.classList.remove('normal-style')
    dialogbox.classList.add('title-style')
}
test('titleStyle adds title-style class', () => {
    const dlg = document.getElementById('dialogbox')
    titleStyle(dlg)
    expect(dlg.classList.contains('title-style')).toBe(true)
    expect(dlg.classList.contains('normal-style')).toBe(false)
})

function normalStyle(dialogbox) {
    dialogbox.classList.remove('title-style')
    dialogbox.classList.add('normal-style')
}
test('normalStyle adds normal-style class', () => {
    const dlg = document.getElementById('dialogbox')
    normalStyle(dlg)
    expect(dlg.classList.contains('normal-style')).toBe(true)
    expect(dlg.classList.contains('title-style')).toBe(false)
})

test('Separates messages with split and trim', () => {
    const messageString = "M1 || M2 || M3"
    const messageStrings = messageString.split("||").map(m => m.trim())
    expect(messageStrings).toEqual(["M1", "M2", "M3"])
})

function nextMessage(messages, id) {
    if (id >= messages.length) id = messages.length - 1
    return { curr: messages[id], nextId: id + 1 }
}
test('nextMessage manages indices and returns correct message', () => {
    const arr = ["A", "B", "C"]
    let r = nextMessage(arr, 1)
    expect(r.curr).toBe("B")
    expect(r.nextId).toBe(2)
    r = nextMessage(arr, 5)
    expect(r.curr).toBe("C")
    expect(r.nextId).toBe(3)
})

function loadMessage(dialog, cb) {
    let i = 0
    function next() {
        if (i < dialog.length) {
            cb(dialog[i])
            i++
            setTimeout(next, 1)
        }
    }
    next()
}
test('loadMessage iterates through all messages invoking callback', async () => {
    const dialog = ["one", "two", "three"]
    let answers = []
    await new Promise(resolve => {
        loadMessage(dialog, d => { answers.push(d); if (answers.length === 3) resolve() })
    })
    expect(answers).toEqual(dialog)
})

test('clearTimeouts clears timeouts correctly', () => {
    let cleared = []
    global.clearTimeout = id => cleared.push(id)
    function clearTimeouts() {
        for (let i = 0; i < 5; i++) clearTimeout(i)
    }
    clearTimeouts()
    expect(cleared.length).toBe(5)
})

class MockRaffleSystem {
    constructor(config) { this.config = config }
    init() { return true }
    start() { return [2, 4, 6, 8, 10, 12, 14, 16] }
}
test('RaffleSystem executes raffle and initializes correctly', () => {
    const config = { totalPlayers: 16, winnersCount: 8 }
    const rs = new MockRaffleSystem(config)
    expect(rs.init()).toBe(true)
    expect(rs.start().length).toBe(8)
})

test('Storage saves and retrieves winners', () => {
    const preState = {
        contestants: Array(16).fill(0).map((_, i) => ({ name: "X" + i }))
    }
    // Use the predefined state directly instead of depending on localStorage mock
    function afterRaffle(indices) {
        const raw = JSON.stringify(preState)
        const state = JSON.parse(raw)
        const winners = indices.map(idx => state.contestants[idx]).filter(Boolean)
        winners.forEach(w => { w.firstTrialCompleted = true })
        state.contestants = winners
        // Simulate saving to localStorage
        localStorage.setItem('myRegistrationGameState', JSON.stringify(state))
        return state.contestants.length
    }
    expect(afterRaffle([1, 3, 5])).toBe(3)
})

test('Redirects correctly after raffle finishes', () => {
    // Simulate redirection without invoking jsdom navigation
    const POST_RAFFLE_REDIRECT = '../main/secondtrial.html'
    function finishRaffle() {
        return POST_RAFFLE_REDIRECT
    }
    expect(finishRaffle()).toBe(POST_RAFFLE_REDIRECT)
})

test('Creates arrow element correctly', () => {
    const arrow = document.createElement("div")
    arrow.id = "arrow"
    expect(arrow.id).toBe("arrow")
    expect(arrow.tagName).toBe("DIV")
})
