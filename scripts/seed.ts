import { prisma } from '../src/db'

async function seed() {
  try {
    // Seed admin user (mock data)
    const adminEmail = 'admin@fastcrew.com'

    console.log('✅ Database seeded successfully!')
    console.log('📝 Admin user: admin@fastcrew.com')
    console.log('🏢 To set admin access, add this email to ADMIN_EMAILS in your .env file')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()