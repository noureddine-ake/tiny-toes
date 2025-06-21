import { getRedisClient, type Product, REDIS_KEYS } from "./db"
export type { Product } from "./db"

export interface ProductImage {
  id: string
  color: string
  imageData: string
  imageMimeType: string
  isPrimary: boolean
}

export class ProductService {
  // Create a new product with multiple images
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
      images: JSON.stringify(product.images),
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
          images: typeof product.images === "string" ? JSON.parse(product.images) : product.images,
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
          images: typeof product.images === "string" ? JSON.parse(product.images) : product.images,
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
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images,
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
      images: JSON.stringify(updatedProduct.images),
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

  // Get primary image for display
  static getPrimaryImage(product: Product): ProductImage | null {
    const primaryImage = product.images.find((img) => img.isPrimary)
    return primaryImage || product.images[0] || null
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

  // Helper method to create ProductImage
  static createProductImage(imageData: string, imageMimeType: string, color: string, isPrimary = false): ProductImage {
    return {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      color,
      imageData,
      imageMimeType,
      isPrimary,
    }
  }

  // Update stock
  static async updateStock(id: string, newStock: number): Promise<Product | null> {
    const product = await this.getProduct(id)

    if (!product) {
      return null
    }

    return await this.updateProduct(id, { stock: newStock })
  }

  // Check if product is in stock
  static isInStock(product: Product): boolean {
    return product.stock > 0
  }

  // Get products by season
  static async getProductsBySeason(season: "winter" | "summer" | "autumn"): Promise<Product[]> {
    const allProducts = await this.getAllProducts()
    return allProducts.filter((product) => product.season === season)
  }

  // Get products with filters
  static async getProductsWithFilters(filters: {
    gender?: "boys" | "girls"
    season?: "winter" | "summer" | "autumn"
    size?: number
    inStockOnly?: boolean
  }): Promise<Product[]> {
    let products = await this.getAllProducts()

    if (filters.gender) {
      products = products.filter((product) => product.gender === filters.gender)
    }

    if (filters.season) {
      products = products.filter((product) => product.season === filters.season)
    }

    if (filters.size) {
      products = products.filter((product) => product.sizes.includes(filters.size))
    }

    if (filters.inStockOnly) {
      products = products.filter((product) => this.isInStock(product))
    }

    return products
  }
}
