
import { describe, it, expect } from 'vitest'
import { formatDate } from '../lib/utils'

describe('formatDate', () => {
  it('mostra només l\'any quan la data és 1 de gener', () => {
    expect(formatDate('2024-01-01')).toBe('2024')
  })

  it('mostra mes i any quan el dia és 1', () => {
    expect(formatDate('2024-03-01')).toBe('March 2024')
  })

  it('mostra la data completa quan té dia, mes i any', () => {
    expect(formatDate('2024-03-15')).toBe('March 15, 2024')
  })
})