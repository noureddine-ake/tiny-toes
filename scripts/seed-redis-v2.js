// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Redis } = require('@upstash/redis');

// Updated sample products data with stock and season
const sampleProducts = [
  {
    name: 'Lightning Bolt Runners',
    description:
      'Super fast sneakers with lightning bolt design. Perfect for active boys who love to run and play.',
    price: 45.99,
    gender: 'boys',
    season: 'summer',
    stock: 15,
    sizes: [16, 17, 18, 19],
    imageData:
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    imageMimeType: 'image/png',
  },
  {
    name: 'Rainbow Sparkle Shoes',
    description:
      'Colorful sneakers with sparkly details and rainbow accents. Makes every step magical!',
    price: 42.99,
    gender: 'girls',
    season: 'summer',
    stock: 8,
    sizes: [16, 17, 18],
    imageData:
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    imageMimeType: 'image/png',
  },
  {
    name: 'Space Explorer Kicks',
    description:
      'Out-of-this-world sneakers with space theme design. Perfect for future astronauts!',
    price: 48.99,
    gender: 'boys',
    season: 'winter',
    stock: 0, // Out of stock
    sizes: [17, 18, 19],
    imageData:
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    imageMimeType: 'image/png',
  },
  {
    name: 'Autumn Leaf Sneakers',
    description:
      'Beautiful autumn-themed sneakers with leaf patterns and warm colors.',
    price: 44.99,
    gender: 'girls',
    season: 'autumn',
    stock: 3, // Low stock
    sizes: [16, 17, 18, 19],
    imageData:
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    imageMimeType: 'image/png',
  },
  {
    name: 'Winter Snow Boots',
    description: 'Warm and cozy winter sneakers perfect for snowy days.',
    price: 52.99,
    gender: 'boys',
    season: 'winter',
    stock: 12,
    sizes: [16, 17, 18, 19],
    imageData:
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    imageMimeType: 'image/png',
  },
];

async function seedRedis() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    console.error('Missing Redis environment variables');
    console.error(
      'Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN'
    );
    process.exit(1);
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  console.log(
    'Clearing existing data and seeding Redis with updated sample products...'
  );

  try {
    // Clear existing data
    const existingProducts = await redis.smembers('products');
    if (existingProducts && existingProducts.length > 0) {
      for (const productId of existingProducts) {
        await redis.del(`product:${productId}`);
      }
      await redis.del('products');
      await redis.del('products:gender:boys');
      await redis.del('products:gender:girls');
    }

    for (const productData of sampleProducts) {
      const id = `product_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const now = new Date().toISOString();

      const product = {
        ...productData,
        id,
        createdAt: now,
        updatedAt: now,
        sizes: JSON.stringify(productData.sizes),
      };

      // Store individual product
      await redis.hset(`product:${id}`, product);

      // Add to products set
      await redis.sadd('products', id);

      // Add to gender-specific set
      await redis.sadd(`products:gender:${product.gender}`, id);

      console.log(
        `✓ Created product: ${product.name} (Stock: ${product.stock}, Season: ${product.season})`
      );

      // Small delay to ensure unique timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Redis:', error);
    process.exit(1);
  }
}

seedRedis();
