// Polyfill TextEncoder/TextDecoder for jsdom/whatwg-url
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
const { JSDOM } = require('jsdom')
global.document = new JSDOM('<!doctype html><html><body></body></html>').window.document
global.window = document.defaultView
global.playRaffleSound = jest.fn()
require('../scripts/raffle.js')
global.RaffleSystem = global.window.RaffleSystem

function createMockBoxes(n) {
    const boxes = []
    for (let i = 0; i < n; i++) {
        const el = document.createElement('div')
        el.className = 'character-image'
        el.id = 'playerBox' + (i + 1)
        boxes.push(el)
        document.body.appendChild(el)
    }
    return boxes
}

beforeEach(() => {
    document.body.innerHTML = ''
})

test('init loads elements correctly by selector', () => {
    createMockBoxes(5)
    const rs = new RaffleSystem({ playerBoxSelector: '.character-image', totalPlayers: 5 })
    rs.init()
    expect(rs.playerBoxes.length).toBe(5)
})

test('init loads elements correctly by ID', () => {
    for (let i = 1; i <= 3; i++) {
        const el = document.createElement('div')
        el.id = 'playerBox' + i
        document.body.appendChild(el)
    }
    const rs = new RaffleSystem({ playerBoxSelector: '#none', totalPlayers: 3 })
    rs.init()
    expect(rs.playerBoxes.length).toBe(3)
})

test('reset removes styles and classes from players', () => {
    const boxes = createMockBoxes(2)
    const rs = new RaffleSystem({ playerBoxSelector: '.character-image', totalPlayers: 2, selectedClass: 'selected' })
    rs.init()
    boxes[0].style.boxShadow = '0 0 10px #000'
    boxes[0].classList.add('selected')
    boxes[1].style.boxShadow = '0 0 10px #000'
    boxes[1].classList.add('selected')
    rs.reset()
    expect(boxes.every(box => box.style.boxShadow === '' && !box.classList.contains('selected'))).toBe(true)
})

test('getRandomInt generates values in inclusive range', () => {
    const rs = new RaffleSystem({})
    const vals = Array(100).fill(0).map(() => rs.getRandomInt(2, 7))
    expect(vals.every(v => v >= 2 && v <= 7)).toBe(true)
})

test('selectRandomIndices selects unique valid indices', () => {
    const rs = new RaffleSystem({})
    const selected = rs.selectRandomIndices(8, 5)
    expect(selected.length).toBe(5)
    expect(new Set(selected).size).toBe(5)
    expect(selected.every(i => i >= 0 && i < 8)).toBe(true)
})

test('start selects winners and applies styles', async () => {
    createMockBoxes(7)
    const rs = new RaffleSystem({ playerBoxSelector: '.character-image', totalPlayers: 7, winnersCount: 3, selectedClass: 'selected', animationDuration: 10, glowColor: 'gold', shadowColors: ['#fff'], blinkInterval: 1 })
    rs.init()
    await rs.start()
    const selected = rs.getSelectedElements()
    expect(selected.length).toBe(3)
    expect(selected.every(box => box.classList.contains('selected'))).toBe(true)
})

test('getSelectedElements and getSelectedIndices return correct selections', async () => {
    createMockBoxes(4)
    const rs = new RaffleSystem({ playerBoxSelector: '.character-image', totalPlayers: 4, winnersCount: 2, selectedClass: 'selected', animationDuration: 10, glowColor: 'gold', shadowColors: ['#fff'], blinkInterval: 1 })
    rs.init()
    await rs.start()
    const els = rs.getSelectedElements()
    const idxs = rs.getSelectedIndices()
    expect(els.length).toBe(2)
    expect(idxs.length).toBe(2)
    expect(els.every(el => el.classList.contains('selected'))).toBe(true)
    expect(idxs.every(i => typeof i === 'number')).toBe(true)
})

test('reset stops animation and clears isRunning flag', async () => {
    createMockBoxes(3)
    const rs = new RaffleSystem({ playerBoxSelector: '.character-image', totalPlayers: 3, winnersCount: 1, selectedClass: 'selected', animationDuration: 10, glowColor: 'gold', shadowColors: ['#fff'], blinkInterval: 1 })
    rs.init()
    await rs.start()
    rs.reset()
    expect(rs.isRunning).toBe(false)
    expect(rs.animationInterval).toBeNull()
})

test('start does not execute if raffle is already running', async () => {
    createMockBoxes(2)
    const rs = new RaffleSystem({ playerBoxSelector: '.character-image', totalPlayers: 2, winnersCount: 1, selectedClass: 'selected', animationDuration: 10, shadowColors: ['#fff'], blinkInterval: 1 })
    rs.init()
    rs.isRunning = true
    await rs.start()
    expect(rs.isRunning).toBe(true)
})

test('start handles error if no elements are loaded', async () => {
    const rs = new RaffleSystem({ playerBoxSelector: '.character-image', totalPlayers: 2, winnersCount: 1 })
    expect(() => rs.start()).not.toThrow()
})

test('reset without players or animation does not throw error', () => {
    const rs = new RaffleSystem({})
    expect(() => rs.reset()).not.toThrow()
})

test('start calls onComplete callback if provided', async () => {
    createMockBoxes(3)
    const rs = new RaffleSystem({ playerBoxSelector: '.character-image', totalPlayers: 3, winnersCount: 1, selectedClass: 'selected', animationDuration: 10, shadowColors: ['#fff'], blinkInterval: 1 })
    rs.init()
    let cbResult = null
    await rs.start(indices => { cbResult = indices })
    expect(cbResult.length).toBe(1)
})

