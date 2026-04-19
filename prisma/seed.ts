import { PrismaClient, Role, OrderStatus } from "../lib/generated/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);

  // 1. Admin User
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@shopmind.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  // 2. Regular Users
  const users = [
    { name: "Varshitha", email: "varshitha@example.com" },
    { name: "Arun", email: "arun@example.com" },
    { name: "Priya", email: "priya@example.com" },
    { name: "Rahul", email: "rahul@example.com" },
    { name: "Deepa", email: "deepa@example.com" },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: {
        ...u,
        passwordHash,
        role: Role.USER,
      },
    });
  }

  // 3. Products (30)
  const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"];
  const productsData = [
    // Electronics
    { name: "Smartphone X1", description: "Latest flagship smartphone", price: 59999, stock: 50, category: "Electronics", imageUrl: "https://placehold.co/600x400?text=Smartphone+X1" },
    { name: "Laptop Pro", description: "High-performance laptop for pros", price: 89999, stock: 20, category: "Electronics", imageUrl: "https://placehold.co/600x400?text=Laptop+Pro" },
    { name: "Wireless Earbuds", description: "Noise-cancelling earbuds", price: 4999, stock: 100, category: "Electronics", imageUrl: "https://placehold.co/600x400?text=Wireless+Earbuds" },
    { name: "Smart Watch", description: "Track your health and fitness", price: 8999, stock: 40, category: "Electronics", imageUrl: "https://placehold.co/600x400?text=Smart+Watch" },
    { name: "Tablet Air", description: "Thin and light tablet", price: 34999, stock: 30, category: "Electronics", imageUrl: "https://placehold.co/600x400?text=Tablet+Air" },
    { name: "4K Monitor", description: "Crystal clear display", price: 15999, stock: 15, category: "Electronics", imageUrl: "https://placehold.co/600x400?text=4K+Monitor" },
    // Clothing
    { name: "Classic T-Shirt", description: "100% Cotton premium t-shirt", price: 899, stock: 200, category: "Clothing", imageUrl: "https://placehold.co/600x400?text=Classic+T-Shirt" },
    { name: "Denim Jacket", description: "Stylish blue denim jacket", price: 2499, stock: 50, category: "Clothing", imageUrl: "https://placehold.co/600x400?text=Denim+Jacket" },
    { name: "Running Shoes", description: "Lightweight running shoes", price: 3999, stock: 80, category: "Clothing", imageUrl: "https://placehold.co/600x400?text=Running+Shoes" },
    { name: "Summer Dress", description: "Floral print summer dress", price: 1599, stock: 60, category: "Clothing", imageUrl: "https://placehold.co/600x400?text=Summer+Dress" },
    { name: "Formal Shirt", description: "Slim fit formal shirt", price: 1299, stock: 100, category: "Clothing", imageUrl: "https://placehold.co/600x400?text=Formal+Shirt" },
    { name: "Yoga Pants", description: "Flexible yoga pants", price: 999, stock: 120, category: "Clothing", imageUrl: "https://placehold.co/600x400?text=Yoga+Pants" },
    // Books
    { name: "The Alchemist", description: "A fable about following your dream", price: 399, stock: 150, category: "Books", imageUrl: "https://placehold.co/600x400?text=The+Alchemist" },
    { name: "Atomic Habits", description: "Build good habits and break bad ones", price: 499, stock: 200, category: "Books", imageUrl: "https://placehold.co/600x400?text=Atomic+Habits" },
    { name: "Clean Code", description: "A handbook of agile software craftsmanship", price: 799, stock: 40, category: "Books", imageUrl: "https://placehold.co/600x400?text=Clean+Code" },
    { name: "Deep Work", description: "Rules for focused success in a distracted world", price: 450, stock: 90, category: "Books", imageUrl: "https://placehold.co/600x400?text=Deep+Work" },
    { name: "Psychology of Money", description: "Timeless lessons on wealth and greed", price: 350, stock: 300, category: "Books", imageUrl: "https://placehold.co/600x400?text=Psychology+of+Money" },
    { name: "Sapiens", description: "A brief history of humankind", price: 550, stock: 110, category: "Books", imageUrl: "https://placehold.co/600x400?text=Sapiens" },
    // Home
    { name: "Scented Candle", description: "Relaxing lavender scent", price: 499, stock: 300, category: "Home", imageUrl: "https://placehold.co/600x400?text=Scented+Candle" },
    { name: "Wall Clock", description: "Modern minimalist design", price: 899, stock: 45, category: "Home", imageUrl: "https://placehold.co/600x400?text=Wall+Clock" },
    { name: "Throw Blanket", description: "Soft and cozy throw blanket", price: 1299, stock: 65, category: "Home", imageUrl: "https://placehold.co/600x400?text=Throw+Blanket" },
    { name: "Coffee Mug Set", description: "Set of 4 ceramic mugs", price: 799, stock: 150, category: "Home", imageUrl: "https://placehold.co/600x400?text=Coffee+Mug+Set" },
    { name: "Cushion Cover", description: "Pack of 2 velvet covers", price: 599, stock: 200, category: "Home", imageUrl: "https://placehold.co/600x400?text=Cushion+Cover" },
    { name: "Table Lamp", description: "Adjustable desk lamp", price: 1499, stock: 35, category: "Home", imageUrl: "https://placehold.co/600x400?text=Table+Lamp" },
    // Sports
    { name: "Yoga Mat", description: "Non-slip eco-friendly mat", price: 999, stock: 100, category: "Sports", imageUrl: "https://placehold.co/600x400?text=Yoga+Mat" },
    { name: "Dumbbell Set", description: "2 x 5kg adjustable dumbbells", price: 2999, stock: 25, category: "Sports", imageUrl: "https://placehold.co/600x400?text=Dumbbell+Set" },
    { name: "Cricket Bat", description: "English willow cricket bat", price: 4999, stock: 15, category: "Sports", imageUrl: "https://placehold.co/600x400?text=Cricket+Bat" },
    { name: "Basketball", description: "Official size 7 basketball", price: 1299, stock: 60, category: "Sports", imageUrl: "https://placehold.co/600x400?text=Basketball" },
    { name: "Skipping Rope", description: "High-speed jump rope", price: 299, stock: 500, category: "Sports", imageUrl: "https://placehold.co/600x400?text=Skipping+Rope" },
    { name: "Badminton Racket", description: "Carbon fiber lightweight racket", price: 2499, stock: 45, category: "Sports", imageUrl: "https://placehold.co/600x400?text=Badminton+Racket" },
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }

  // 4. Coupons (3)
  await prisma.coupon.createMany({
    data: [
      { code: "SAVE10", discountPct: 10, minOrderValue: 500, expiresAt: new Date("2026-12-31"), isActive: true },
      { code: "WELCOME20", discountPct: 20, minOrderValue: 1000, expiresAt: new Date("2026-12-31"), isActive: true },
      { code: "FESTIVE30", discountPct: 30, minOrderValue: 2000, expiresAt: new Date("2026-12-31"), isActive: true },
    ],
  });

  // 5. Sample Orders (10)
  const allUsers = await prisma.user.findMany({ where: { role: Role.USER } });
  const allProducts = await prisma.product.findMany();

  for (let i = 0; i < 10; i++) {
    const user = allUsers[Math.floor(Math.random() * allUsers.length)];
    const product1 = allProducts[Math.floor(Math.random() * allProducts.length)];
    const product2 = allProducts[Math.floor(Math.random() * allProducts.length)];

    await prisma.order.create({
      data: {
        userId: user.id,
        total: product1.price + product2.price,
        status: OrderStatus.DELIVERED,
        items: {
          create: [
            { productId: product1.id, quantity: 1, price: product1.price },
            { productId: product2.id, quantity: 1, price: product2.price },
          ],
        },
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
