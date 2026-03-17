
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => ({ data: null, error: null }))
          }))
        }))
      })),
      insert: vi.fn(() => ({ error: null })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({ error: null }))
        }))
      }))
    }))
  }
}))

import { toggleIdea } from '../lib/ideas.api'

describe('toggleIdea', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna false quan el trip no estava guardat i es guarda', async () => {
    
    const { supabase } = await import('../lib/supabase')
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => ({ data: null, error: null }))
          }))
        }))
      })),
      insert: vi.fn(() => ({ error: null })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({ error: null }))
        }))
      }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

    const result = await toggleIdea('user-123', 'trip-456')
    expect(result).toBe(true) // Ha guardat → retorna true
  })

  it('retorna false quan el trip estava guardat i es desguarda', async () => {
    
    const { supabase } = await import('../lib/supabase')
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => ({ data: { id: '1' }, error: null }))
          }))
        }))
      })),
      insert: vi.fn(() => ({ error: null })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({ error: null }))
        }))
      }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } as any)

    const result = await toggleIdea('user-123', 'trip-456')
    expect(result).toBe(false) // Ha desguardat → retorna false
  })
})