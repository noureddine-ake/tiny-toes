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
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const gender = formData.get("gender") as "boys" | "girls"
    const sizes = JSON.parse(formData.get("sizes") as string)
    const imageFile = formData.get("image") as File

    if (!name || !description || !price || !gender || !sizes || !imageFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert image to base64
    const { data: imageData, mimeType } = await ProductService.fileToBase64(imageFile)

    const product = await ProductService.createProduct({
      name,
      description,
      price,
      gender,
      sizes,
      imageData,
      imageMimeType: mimeType,
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
