import { type NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/product-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gender = searchParams.get("gender")

    let products
    if (gender && (gender === "boys" || gender === "girls")) {
      products = await ProductService.getProductsByGender(gender)
    } else {
      products = await ProductService.getAllProducts()
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = formData.get("name") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const gender = formData.get("gender") as "boys" | "girls"
    const season = formData.get("season") as "winter" | "summer" | "autumn"
    const stock = Number.parseInt(formData.get("stock") as string)
    const sizes = JSON.parse(formData.get("sizes") as string)
    const imagesData = JSON.parse(formData.get("imagesData") as string)

    if (!name || !price || !gender || !season || stock === undefined || !sizes || !imagesData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process images
    const images = []
    for (const imageInfo of imagesData) {
      const imageFile = formData.get(`image_${imageInfo.index}`) as File
      if (imageFile) {
        const { data: imageData, mimeType } = await ProductService.fileToBase64(imageFile)
        images.push(ProductService.createProductImage(imageData, mimeType, imageInfo.color, imageInfo.isPrimary))
      }
    }

    if (images.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 })
    }

    const product = await ProductService.createProduct({
      name,
      price,
      gender,
      season,
      stock,
      sizes,
      images,
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
