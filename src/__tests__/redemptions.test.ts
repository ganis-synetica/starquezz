import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRedemption, fulfillRedemption, cancelRedemption, listPendingRedemptions } from '@/services/redemptions'

// Mock supabase
const mockSupabase = {
  from: vi.fn(),
}

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => mockSupabase.from(table),
  },
}))

describe('redemptions service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createRedemption', () => {
    it('should throw error when child has insufficient stars', async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'children') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { stars: 5 }, error: null }),
          }
        }
        return {}
      })

      await expect(createRedemption('child-1', 'reward-1', 10)).rejects.toThrow('Not enough stars!')
    })

    it('should deduct stars and create redemption when successful', async () => {
      const mockUpdate = vi.fn().mockReturnThis()
      const mockInsert = vi.fn().mockReturnThis()
      
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'children') {
          return {
            select: vi.fn().mockReturnThis(),
            update: mockUpdate,
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { stars: 20 }, error: null }),
          }
        }
        if (table === 'redemptions') {
          return {
            insert: mockInsert,
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'redemption-1',
                child_id: 'child-1',
                reward_id: 'reward-1',
                stars_spent: 10,
                status: 'pending',
              },
              error: null,
            }),
          }
        }
        return {}
      })

      // Mock the chained methods properly
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })

      const result = await createRedemption('child-1', 'reward-1', 10)

      expect(result).toEqual({
        id: 'redemption-1',
        child_id: 'child-1',
        reward_id: 'reward-1',
        stars_spent: 10,
        status: 'pending',
      })
    })
  })

  describe('fulfillRedemption', () => {
    it('should update redemption status to fulfilled', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })

      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      })

      await fulfillRedemption('redemption-1')

      expect(mockSupabase.from).toHaveBeenCalledWith('redemptions')
      expect(mockUpdate).toHaveBeenCalledWith({
        status: 'fulfilled',
        fulfilled_at: expect.any(String),
      })
    })
  })

  describe('cancelRedemption', () => {
    it('should throw error when redemption is not pending', async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'redemptions') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { child_id: 'child-1', stars_spent: 10, status: 'fulfilled' },
              error: null,
            }),
          }
        }
        return {}
      })

      await expect(cancelRedemption('redemption-1')).rejects.toThrow('Can only cancel pending redemptions')
    })

    it('should refund stars when cancelling pending redemption', async () => {
      const mockChildUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })
      const mockRedemptionUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })

      let callCount = 0
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'redemptions') {
          callCount++
          if (callCount === 1) {
            // First call - select
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: { child_id: 'child-1', stars_spent: 10, status: 'pending' },
                error: null,
              }),
            }
          }
          // Subsequent calls - update
          return {
            update: mockRedemptionUpdate,
          }
        }
        if (table === 'children') {
          return {
            select: vi.fn().mockReturnThis(),
            update: mockChildUpdate,
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { stars: 5 }, error: null }),
          }
        }
        return {}
      })

      await cancelRedemption('redemption-1')

      // Should refund stars (5 + 10 = 15)
      expect(mockChildUpdate).toHaveBeenCalledWith({ stars: 15 })
    })
  })

  describe('listPendingRedemptions', () => {
    it('should return pending redemptions with child and reward details', async () => {
      const mockRedemptions = [
        {
          id: 'redemption-1',
          child_id: 'child-1',
          reward_id: 'reward-1',
          stars_spent: 10,
          status: 'pending',
          created_at: '2025-01-01T00:00:00Z',
          reward: { id: 'reward-1', title: 'Ice Cream' },
          child: { id: 'child-1', name: 'Test Child', avatar: '🦊' },
        },
      ]

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockRedemptions, error: null }),
      })

      const result = await listPendingRedemptions()

      expect(result).toEqual(mockRedemptions)
      expect(mockSupabase.from).toHaveBeenCalledWith('redemptions')
    })
  })
})
