// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Redis } = require("@upstash/redis")

// Updated sample products data with multiple images and no description
const sampleProducts = [
  {
    name: "Lightning Bolt Runners",
    price: 45.99,
    gender: "boys",
    season: "summer",
    stock: 15,
    sizes: [16, 17, 18, 19, 20],
    images: [
      {
        id: "img_1",
        color: "Blue",
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        imageMimeType: "image/png",
        isPrimary: true,
      },
      {
        id: "img_2",
        color: "Red",
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        imageMimeType: "image/png",
        isPrimary: false,
      },
    ],
  },
  {
    name: "Rainbow Sparkle Shoes",
    price: 42.99,
    gender: "girls",
    season: "summer",
    stock: 8,
    sizes: [16, 17, 18, 21, 22],
    images: [
      {
        id: "img_3",
        color: "Rainbow",
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        imageMimeType: "image/png",
        isPrimary: true,
      },
      {
        id: "img_4",
        color: "Pink",
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        imageMimeType: "image/png",
        isPrimary: false,
      },
    ],
  },
  {
    name: "Space Explorer Kicks",
    price: 48.99,
    gender: "boys",
    season: "winter",
    stock: 0, // Out of stock
    sizes: [17, 18, 19, 23, 24, 25],
    images: [
      {
        id: "img_5",
        color: "Black",
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        imageMimeType: "image/png",
        isPrimary: true,
      },
    ],
  },
  {
    name: "Autumn Leaf Sneakers",
    price: 44.99,
    gender: "girls",
    season: "autumn",
    stock: 3, // Low stock
    sizes: [16, 17, 18, 19, 20, 21],
    images: [
      {
        id: "img_6",
        color: "Orange",
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        imageMimeType: "image/png",
        isPrimary: true,
      },
      {
        id: "img_7",
        color: "Brown",
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        imageMimeType: "image/png",
        isPrimary: false,
      },
      {
        id: "img_8",
        color: "Yellow",
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        imageMimeType: "image/png",
        isPrimary: false,
      },
    ],
  },
  {
    name: "Winter Snow Boots",
    price: 52.99,
    gender: "boys",
    season: "winter",
    stock: 12,
    sizes: [18, 19, 20, 21, 22, 23, 24, 25],
    images: [
      {
        id: "img_9",
        color: "White",
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        imageMimeType: "image/png",
        isPrimary: true,
      },
      {
        id: "img_10",
        color: "Gray",
        imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        imageMimeType: "image/png",
        isPrimary: false,
      },
    ],
  },
]

async function seedRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.error("Missing Redis environment variables")
    console.error("Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN")
    process.exit(1)
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  console.log("Clearing existing data and seeding Redis with updated sample products (multiple images, sizes 16-25)...")

  try {
    // Clear existing data
    const existingProducts = await redis.smembers("products")
    if (existingProducts && existingProducts.length > 0) {
      for (const productId of existingProducts) {
        await redis.del(`product:${productId}`)
      }
      await redis.del("products")
      await redis.del("products:gender:boys")
      await redis.del("products:gender:girls")
    }

    for (const productData of sampleProducts) {
      const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const now = new Date().toISOString()

      const product = {
        ...productData,
        id,
        createdAt: now,
        updatedAt: now,
        sizes: JSON.stringify(productData.sizes),
        images: JSON.stringify(productData.images),
      }

      // Store individual product
      await redis.hset(`product:${id}`, product)

      // Add to products set
      await redis.sadd("products", id)

      // Add to gender-specific set
      await redis.sadd(`products:gender:${product.gender}`, id)

      console.log(
        `✓ Created product: ${product.name} (Stock: ${product.stock}, Season: ${product.season}, Colors: ${productData.images.length})`,
      )

      // Small delay to ensure unique timestamps
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    console.log("🎉 Seeding completed successfully with multiple images and sizes 16-25!")
  } catch (error) {
    console.error("❌ Error seeding Redis:", error)
    process.exit(1)
  }
}

seedRedis()
