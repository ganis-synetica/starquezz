#!/usr/bin/env npx tsx
/**
 * Seed script for StarqueZZ
 * Usage: npm run seed
 * 
 * Requires SUPABASE_URL and SUPABASE_SECRET_KEY in environment
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY')
  console.error('   Set them in .env or environment')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)

async function seed() {
  console.log('🌱 Seeding StarqueZZ database...\n')

  // Get parent ID from args or prompt
  const parentId = process.argv[2]
  if (!parentId) {
    console.error('❌ Usage: npm run seed <parent-uuid>')
    console.error('   Get your UUID from Supabase Auth dashboard after signing up')
    process.exit(1)
  }

  const parentEmail = process.argv[3] || 'parent@example.com'

  console.log(`👤 Parent ID: ${parentId}`)
  console.log(`📧 Email: ${parentEmail}\n`)

  // 1. Insert parent
  console.log('1/4 Creating parent...')
  const { error: parentError } = await supabase
    .from('parents')
    .upsert({ id: parentId, email: parentEmail })
  
  if (parentError) {
    console.error('   ❌ Failed:', parentError.message)
  } else {
    console.log('   ✅ Parent created')
  }

  // 2. Insert children
  console.log('2/4 Creating children...')
  const children = [
    { id: '11111111-1111-1111-1111-111111111111', parent_id: parentId, name: 'Zen', avatar: '🦊', pin_hash: '$2b$10$N9qo8uLOickgx2ZMRZoMy.MqrqvKL1LkAz3lLp0VqKU7Nq7YHQFHK', stars: 0 },
    { id: '22222222-2222-2222-2222-222222222222', parent_id: parentId, name: 'Zia', avatar: '🦋', pin_hash: '$2b$10$N9qo8uLOickgx2ZMRZoMy.MqrqvKL1LkAz3lLp0VqKU7Nq7YHQFHK', stars: 0 },
  ]
  
  const { error: childError } = await supabase.from('children').upsert(children)
  if (childError) {
    console.error('   ❌ Failed:', childError.message)
  } else {
    console.log('   ✅ Zen 🦊 and Zia 🦋 created (PIN: 1234)')
  }

  // 3. Insert habits
  console.log('3/4 Creating habits...')
  const habits = [
    // Zen's habits
    { id: '31111111-1111-1111-1111-111111111111', parent_id: parentId, child_id: '11111111-1111-1111-1111-111111111111', title: '🎹 Practice Piano', description: '15 minutes', category: 'learning', is_core: true, active: true },
    { id: '31111111-1111-1111-1111-111111111112', parent_id: parentId, child_id: '11111111-1111-1111-1111-111111111111', title: '✏️ Writing Exercise', description: 'Practice letters', category: 'learning', is_core: true, active: true },
    { id: '31111111-1111-1111-1111-111111111113', parent_id: parentId, child_id: '11111111-1111-1111-1111-111111111111', title: '📖 Reading Time', description: '20 minutes', category: 'learning', is_core: true, active: true },
    { id: '31111111-1111-1111-1111-111111111114', parent_id: parentId, child_id: '11111111-1111-1111-1111-111111111111', title: '🛏️ Make Your Bed', description: null, category: 'helping', is_core: false, active: true },
    { id: '31111111-1111-1111-1111-111111111115', parent_id: parentId, child_id: '11111111-1111-1111-1111-111111111111', title: '🧹 Tidy Room', description: null, category: 'helping', is_core: false, active: true },
    { id: '31111111-1111-1111-1111-111111111116', parent_id: parentId, child_id: '11111111-1111-1111-1111-111111111111', title: '🪥 Brush Teeth', description: null, category: 'self_care', is_core: false, active: true },
    // Zia's habits
    { id: '32222222-2222-2222-2222-222222222221', parent_id: parentId, child_id: '22222222-2222-2222-2222-222222222222', title: '🎹 Practice Piano', description: '15 minutes', category: 'learning', is_core: true, active: true },
    { id: '32222222-2222-2222-2222-222222222222', parent_id: parentId, child_id: '22222222-2222-2222-2222-222222222222', title: '✏️ Writing Exercise', description: 'Practice letters', category: 'learning', is_core: true, active: true },
    { id: '32222222-2222-2222-2222-222222222223', parent_id: parentId, child_id: '22222222-2222-2222-2222-222222222222', title: '📖 Reading Time', description: '20 minutes', category: 'learning', is_core: true, active: true },
    { id: '32222222-2222-2222-2222-222222222224', parent_id: parentId, child_id: '22222222-2222-2222-2222-222222222222', title: '🛏️ Make Your Bed', description: null, category: 'helping', is_core: false, active: true },
    { id: '32222222-2222-2222-2222-222222222225', parent_id: parentId, child_id: '22222222-2222-2222-2222-222222222222', title: '🧹 Tidy Room', description: null, category: 'helping', is_core: false, active: true },
    { id: '32222222-2222-2222-2222-222222222226', parent_id: parentId, child_id: '22222222-2222-2222-2222-222222222222', title: '🪥 Brush Teeth', description: null, category: 'self_care', is_core: false, active: true },
  ]
  
  const { error: habitError } = await supabase.from('habits').upsert(habits)
  if (habitError) {
    console.error('   ❌ Failed:', habitError.message)
  } else {
    console.log('   ✅ 12 habits created (6 per child)')
  }

  // 4. Insert rewards
  console.log('4/4 Creating rewards...')
  const rewards = [
    { id: '40000000-0000-0000-0000-000000000001', parent_id: parentId, title: 'Ice Cream Trip 🍦', description: 'A delicious treat!', star_cost: 10, active: true },
    { id: '40000000-0000-0000-0000-000000000002', parent_id: parentId, title: 'Movie Night 🎬', description: 'Pick any movie!', star_cost: 25, active: true },
    { id: '40000000-0000-0000-0000-000000000003', parent_id: parentId, title: 'New Book 📚', description: 'Choose a fun book', star_cost: 15, active: true },
    { id: '40000000-0000-0000-0000-000000000004', parent_id: parentId, title: 'Extra Screen Time 📱', description: '30 minutes bonus!', star_cost: 20, active: true },
    { id: '40000000-0000-0000-0000-000000000005', parent_id: parentId, title: 'Pizza Party 🍕', description: 'With your favorite toppings!', star_cost: 50, active: true },
  ]
  
  const { error: rewardError } = await supabase.from('rewards').upsert(rewards)
  if (rewardError) {
    console.error('   ❌ Failed:', rewardError.message)
  } else {
    console.log('   ✅ 5 rewards created')
  }

  console.log('\n🎉 Seeding complete!')
  console.log('   Open https://starquezz.musang.dev and try PIN 1234')
}

seed().catch(console.error)
