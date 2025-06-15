import { getRedisClient, type Product, REDIS_KEYS } from "./db"
export type { Product } from "./db"

export class ProductService {
  // Create a new product with image
  static async createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const redis = getRedisClient()
    const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    const product: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now,
    }

    // Store individual product
    await redis.hset(REDIS_KEYS.PRODUCT(id), {
      ...product,
      sizes: JSON.stringify(product.sizes),
    })

    // Add to products set
    await redis.sadd(REDIS_KEYS.PRODUCTS, id)

    // Add to gender-specific set
    await redis.sadd(REDIS_KEYS.PRODUCTS_BY_GENDER(product.gender), id)

    return product
  }

  // Get all products
  static async getAllProducts(): Promise<Product[]> {
    const redis = getRedisClient()
    const productIds = await redis.smembers(REDIS_KEYS.PRODUCTS)

    if (!productIds || productIds.length === 0) {
      return []
    }

    const products: Product[] = []

    for (const id of productIds) {
      const product = await redis.hgetall(REDIS_KEYS.PRODUCT(id))
      if (product && Object.keys(product).length > 0) {
        products.push({
          ...product,
          sizes: typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes,
          price: typeof product.price === "string" ? Number.parseFloat(product.price) : product.price,
        } as Product)
      }
    }

    return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Get products by gender
  static async getProductsByGender(gender: "boys" | "girls"): Promise<Product[]> {
    const redis = getRedisClient()
    const productIds = await redis.smembers(REDIS_KEYS.PRODUCTS_BY_GENDER(gender))

    if (!productIds || productIds.length === 0) {
      return []
    }

    const products: Product[] = []

    for (const id of productIds) {
      const product = await redis.hgetall(REDIS_KEYS.PRODUCT(id))
      if (product && Object.keys(product).length > 0) {
        products.push({
          ...product,
          sizes: typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes,
          price: typeof product.price === "string" ? Number.parseFloat(product.price) : product.price,
        } as Product)
      }
    }

    return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Get single product
  static async getProduct(id: string): Promise<Product | null> {
    const redis = getRedisClient()
    const product = await redis.hgetall(REDIS_KEYS.PRODUCT(id))

    if (!product || Object.keys(product).length === 0) {
      return null
    }

    return {
      ...product,
      sizes: typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes,
      price: typeof product.price === "string" ? Number.parseFloat(product.price) : product.price,
    } as Product
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> {
    const existingProduct = await this.getProduct(id)

    if (!existingProduct) {
      return null
    }

    const updatedProduct: Product = {
      ...existingProduct,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    const redis = getRedisClient()
    await redis.hset(REDIS_KEYS.PRODUCT(id), {
      ...updatedProduct,
      sizes: JSON.stringify(updatedProduct.sizes),
    })

    return updatedProduct
  }

  // Delete product
  static async deleteProduct(id: string): Promise<boolean> {
    const product = await this.getProduct(id)

    if (!product) {
      return false
    }

    const redis = getRedisClient()
    // Remove from all sets
    await redis.srem(REDIS_KEYS.PRODUCTS, id)
    await redis.srem(REDIS_KEYS.PRODUCTS_BY_GENDER(product.gender), id)

    // Delete the product hash
    await redis.del(REDIS_KEYS.PRODUCT(id))

    return true
  }

  // Convert base64 to data URL for display
  static base64ToDataUrl(base64Data: string, mimeType: string): string {
    return `data:${mimeType};base64,${base64Data}`
  }

  static async fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  const buffer = await file.arrayBuffer()
  const base64String = Buffer.from(buffer).toString("base64")
  return {
    data: base64String,
    mimeType: file.type,
  }
}
}
