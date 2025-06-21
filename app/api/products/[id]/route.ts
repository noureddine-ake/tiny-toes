import { type NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/product-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await ProductService.getProduct(params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await ProductService.deleteProduct(params.id)

    if (!success) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()

    const name = formData.get("name") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const gender = formData.get("gender") as "boys" | "girls"
    const season = formData.get("season") as "winter" | "summer" | "autumn"
    const stock = Number.parseInt(formData.get("stock") as string)
    const sizes = JSON.parse(formData.get("sizes") as string)
    const existingImages = JSON.parse(formData.get("existingImages") as string)
    const newImagesData = JSON.parse((formData.get("newImagesData") as string) || "[]")

    const updates: any = {
      name,
      price,
      gender,
      season,
      stock,
      sizes,
    }

    // Process images
    const allImages = [...existingImages]

    // Add new images
    for (const imageInfo of newImagesData) {
      const imageFile = formData.get(`new_image_${imageInfo.index}`) as File
      if (imageFile) {
        const { data: imageData, mimeType } = await ProductService.fileToBase64(imageFile)
        allImages.push(ProductService.createProductImage(imageData, mimeType, imageInfo.color, imageInfo.isPrimary))
      }
    }

    updates.images = allImages

    const product = await ProductService.updateProduct(params.id, updates)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}
