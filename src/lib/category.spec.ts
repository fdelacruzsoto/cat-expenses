import { getCategoryColor } from './category'

describe('getCategoryColor', () => {
  it('returns green colors for Food category', () => {
    expect(getCategoryColor('Food')).toBe('bg-green-100 text-green-800')
  })

  it('returns amber colors for Furniture category', () => {
    expect(getCategoryColor('Furniture')).toBe('bg-amber-100 text-amber-800')
  })

  it('returns purple colors for Accessory category', () => {
    expect(getCategoryColor('Accessory')).toBe('bg-purple-100 text-purple-800')
  })

  it('returns blue colors for Toy category', () => {
    expect(getCategoryColor('Toy')).toBe('bg-blue-100 text-blue-800')
  })

  it('returns red colors for Healthcare category', () => {
    expect(getCategoryColor('Healthcare')).toBe('bg-red-100 text-red-800')
  })

  it('returns gray colors for unknown categories', () => {
    expect(getCategoryColor('Unknown')).toBe('bg-gray-100 text-gray-800')
  })
})
