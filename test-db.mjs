import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...')
        const count = await prisma.user.count()
        console.log('✅ Connection successful! User count:', count)

        console.log('\nTesting user creation...')
        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test-' + Date.now() + '@example.com',
                password: 'hashedpassword123',
                semester: '4th',
                tracks: JSON.stringify(['Web Development']),
            }
        })
        console.log('✅ User created successfully:', user.id)

    } catch (error) {
        console.error('❌ Error:', error.message)
        console.error('Full error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testConnection()
