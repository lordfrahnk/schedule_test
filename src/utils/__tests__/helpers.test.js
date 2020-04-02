import { range, spread } from '../helpers'

describe('range', () => {
  test('it returns an array of numbers between two numbers', () => {
    const res = range(0, 2)

    expect(res.length).toEqual(3)
    expect(res).toEqual([0,1,2])
  })

  test('it returns an array with one number when the start and end are the same', () => {
    const res = range(0, 0)

    expect(res.length).toEqual(1)
    expect(res).toEqual([0])
  })
})

describe('spread', () => {
  test('it spreads input (min/max) across output (min/max)', () => {
    const in_min = 0,
          in_max = 1,
          out_min = 0,
          out_max = 10

    expect(spread(0, in_min, in_max, out_min, out_max)).toEqual(0)
    expect(spread(1, in_min, in_max, out_min, out_max)).toEqual(10)
  })
})