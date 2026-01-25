
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Cleanup existing data
    await prisma.shippingActivity.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.user.deleteMany() // Address cascades or delete manually? Address has no cascade from User side directly but Order linkage
    await prisma.address.deleteMany()

    console.log('🧹 Cleaned up database')

    // 1. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10)

    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: 'admin@example.com',
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN',
                avatar: '/images/avatars/admin.png'
            }
        }),
        prisma.user.create({
            data: {
                email: 'manager@example.com',
                name: 'Manager User',
                password: hashedPassword,
                role: 'MANAGER',
                avatar: '/images/avatars/manager.png'
            }
        }),
        prisma.user.create({
            data: {
                email: 'viewer@example.com',
                name: 'Viewer User',
                password: hashedPassword,
                role: 'VIEWER',
                avatar: '/images/avatars/viewer.png'
            }
        }),
        prisma.user.create({
            data: {
                email: 'customer1@example.com',
                name: 'Alice Johnson',
                password: hashedPassword,
                role: 'VIEWER',
                avatar: '/images/avatars/1.png'
            }
        }),
        prisma.user.create({
            data: {
                email: 'customer2@example.com',
                name: 'Bob Smith',
                password: hashedPassword,
                role: 'VIEWER',
                avatar: '/images/avatars/2.png'
            }
        })
    ])

    console.log('👤 Created 5 users')

    // 2. Create Categories
    const categoriesData = [
        { name: 'Smart Phone', icon: 'smartphone' },
        { name: 'Clothing', icon: 'shirt' },
        { name: 'Home & Kitchen', icon: 'home' },
        { name: 'Beauty', icon: 'flower' },
        { name: 'Books', icon: 'book' },
        { name: 'Games', icon: 'gamepad-2' },
        { name: 'Baby Products', icon: 'baby' },
        { name: 'Groceries', icon: 'shopping-cart' },
        { name: 'Computer Accessories', icon: 'monitor' },
        { name: 'Fitness Tracker', icon: 'activity' },
        { name: 'Electronics', icon: 'zap' },
        { name: 'Automotive', icon: 'car' }
    ]

    const categories = await Promise.all(
        categoriesData.map(c =>
            prisma.category.create({
                data: {
                    name: c.name,
                    description: `All your favorite ${c.name} items`,
                    icon: c.icon,
                    totalEarning: 0,
                    totalProducts: 0
                }
            })
        )
    )

    console.log('📂 Created 12 categories')

    // 3. Create Products
    const products = []
    for (const category of categories) {
        for (let i = 1; i <= 15; i++) {
            const price = Math.floor(Math.random() * 500) + 20
            const stock = Math.floor(Math.random() * 100)

            const product = await prisma.product.create({
                data: {
                    name: `${category.name} Item ${i}`,
                    description: `High quality ${category.name} product`,
                    price,
                    stock,
                    sku: `SKU-${category.name.substring(0, 3).toUpperCase()}-${i}-${Math.floor(Math.random() * 1000)}`,
                    categoryId: category.id,
                    image: `/images/products/${category.name.toLowerCase().replace(/ /g, '-')}-${i}.jpg`
                }
            })
            products.push(product)

            // Update category counts (approximate)
            await prisma.category.update({
                where: { id: category.id },
                data: {
                    totalProducts: { increment: 1 }
                }
            })
        }
    }

    console.log(`📦 Created ${products.length} products`)

    // 4. Create Orders & Transactions
    const statuses = ['PENDING', 'DELIVERED', 'CANCELLED', 'READY_TO_PICKUP', 'OUT_FOR_DELIVERY']
    const paymentMethods = ['PAYPAL', 'MASTERCARD', 'VISA', 'COD']

    for (let i = 0; i < 100; i++) {
        const customer = users[Math.floor(Math.random() * users.length)]
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
        const isPaid = status === 'DELIVERED' || paymentMethod !== 'COD' ? 'PAID' : 'PENDING'

        // Select random products
        const orderProducts = []
        const numItems = Math.floor(Math.random() * 5) + 1
        let subtotal = 0

        for (let j = 0; j < numItems; j++) {
            const prod = products[Math.floor(Math.random() * products.length)]
            orderProducts.push(prod)
            subtotal += prod.price
        }

        const tax = subtotal * 0.1
        const shippingFee = subtotal > 100 ? 0 : 15
        const total = subtotal + tax + shippingFee

        const orderDate = new Date()
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 180)) // Past 6 months

        // Create Order with nested writes
        const order = await prisma.order.create({
            data: {
                orderNumber: `#${5000 + i}`,
                customerId: customer.id,
                customerName: customer.name,
                customerEmail: customer.email,
                customerAvatar: customer.avatar,
                status,
                paymentMethod,
                paymentStatus: ['CANCELLED', 'FAILED'].includes(status) ? 'FAILED' : isPaid,
                subtotal,
                tax,
                shippingFee,
                total,
                orderDate,
                shippingAddress: {
                    create: {
                        fullName: customer.name,
                        addressLine1: `${Math.floor(Math.random() * 999)} Main St`,
                        city: 'New York',
                        state: 'NY',
                        country: 'USA',
                        postalCode: '10001',
                        phone: '+1234567890'
                    }
                },
                billingAddress: {
                    create: {
                        fullName: customer.name,
                        addressLine1: `${Math.floor(Math.random() * 999)} Main St`,
                        city: 'New York',
                        state: 'NY',
                        country: 'USA',
                        postalCode: '10001',
                        phone: '+1234567890'
                    }
                },
                items: {
                    create: orderProducts.map(p => ({
                        productId: p.id,
                        productName: p.name,
                        productImage: p.image,
                        price: p.price,
                        quantity: 1,
                        total: p.price
                    }))
                },
                shippingActivity: {
                    create: [
                        {
                            status: 'Order Placed',
                            description: 'Order has been placed successfully',
                            timestamp: orderDate,
                            location: 'System'
                        }
                    ]
                }
            }
        })

        // Update Category Earnings
        for (const p of orderProducts) {
            await prisma.category.update({
                where: { id: p.categoryId },
                data: { totalEarning: { increment: p.price } }
            })
        }

        // Create Transaction if paid
        if (isPaid === 'PAID') {
            await prisma.transaction.create({
                data: {
                    invoiceNumber: `INV-${order.orderNumber.replace('#', '')}`,
                    type: paymentMethod === 'COD' ? 'WALLET' : paymentMethod, // Simplify
                    description: `Payment for order ${order.orderNumber}`,
                    amount: total,
                    status: 'COMPLETED',
                    date: orderDate
                }
            })
        }
    }

    console.log('🛒 Created 100+ orders and transactions')

    console.log('✅ Seeding completed')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
