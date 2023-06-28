const { sortPages } = require('./report.js')
const {test, expect} = require('@jest/globals')

test('sortPages', () => {
    const input = {
        'https://blog.boot.dev/path': 1,
        'https://blog.boot.dev': 3
    }
    const actual = sortPages(input)
    const expected = [
        ['https://blog.boot.dev', 3],
        ['https://blog.boot.dev/path', 1]
    ]
    expect(actual).toEqual(expected)
})

test('sortPages 5 pages', () => {
    const input = {
        'https://blog.boot.dev/path1': 1,
        'https://blog.boot.dev/path2': 10,
        'https://blog.boot.dev/path3': 2,
        'https://blog.boot.dev/path4': 86,
        'https://blog.boot.dev/path5': 21
    }
    const actual = sortPages(input)
    const expected = [
        ['https://blog.boot.dev/path4', 86],
        ['https://blog.boot.dev/path5', 21],
        ['https://blog.boot.dev/path2', 10],
        ['https://blog.boot.dev/path3', 2],
        ['https://blog.boot.dev/path1', 1],
    ]
    expect(actual).toEqual(expected)
})