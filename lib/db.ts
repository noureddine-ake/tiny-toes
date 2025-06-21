import { Redis } from "@upstash/redis"

// Only initialize Redis on server side
let redis: Redis | null = null

export function getRedisClient() {
  if (typeof window !== "undefined") {
    throw new Error("Redis client can only be used on the server side")
  }

  if (!redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error("Missing Redis environment variables")
    }

    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }

  return redis
}

export interface Product {
  id: string
  name: string
  price: number
  images: ProductImage[] // Changed from single image to array
  gender: "boys" | "girls"
  sizes: number[]
  stock: number
  season: "winter" | "summer" | "autumn"
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  color: string
  imageData: string // base64 encoded image
  imageMimeType: string // image/jpeg, image/png, etc.
  isPrimary: boolean // Mark one image as primary for display
}

// Redis keys
export const REDIS_KEYS = {
  PRODUCTS: "products",
  PRODUCT: (id: string) => `product:${id}`,
  PRODUCTS_BY_GENDER: (gender: string) => `products:gender:${gender}`,
}
