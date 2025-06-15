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
  description: string
  price: number
  imageData: string // base64 encoded image
  imageMimeType: string // image/jpeg, image/png, etc.
  gender: "boys" | "girls"
  sizes: number[]
  createdAt: string
  updatedAt: string
}

// Redis keys
export const REDIS_KEYS = {
  PRODUCTS: "products",
  PRODUCT: (id: string) => `product:${id}`,
  PRODUCTS_BY_GENDER: (gender: string) => `products:gender:${gender}`,
}
