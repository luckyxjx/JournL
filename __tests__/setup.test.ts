import { describe, it, expect } from 'vitest'
import 'fake-indexeddb/auto'

describe('Project Setup', () => {
  it('should have a working test environment', () => {
    expect(true).toBe(true)
  })

  it('should support TypeScript', () => {
    const message: string = 'TypeScript is working'
    expect(message).toBe('TypeScript is working')
  })
})
