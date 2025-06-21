"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Loader2, Upload, Plus, Trash2, ImageIcon } from "lucide-react"
import type { Product } from "@/lib/product-service"

interface AddProductFormProps {
  onClose: () => void
  onProductAdded: (product: Product) => void
}

interface ImageUpload {
  file: File
  color: string
  isPrimary: boolean
  preview: string
}

export default function AddProductForm({ onClose, onProductAdded }: AddProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    gender: "",
    season: "",
    stock: "",
    sizes: [] as number[],
  })
  const [imageUploads, setImageUploads] = useState<ImageUpload[]>([])

  const availableSizes = Array.from({ length: 10 }, (_, i) => i + 16) // 16 to 25

  const handleSizeToggle = (size: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size].sort(),
    }))
  }

  const handleImageAdd = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const preview = URL.createObjectURL(file)
        const newImage: ImageUpload = {
          file,
          color: "",
          isPrimary: imageUploads.length === 0, // First image is primary by default
          preview,
        }
        setImageUploads((prev) => [...prev, newImage])
      }
    }
    input.click()
  }

  const handleImageRemove = (index: number) => {
    setImageUploads((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      // If we removed the primary image, make the first remaining image primary
      if (prev[index].isPrimary && updated.length > 0) {
        updated[0].isPrimary = true
      }
      return updated
    })
  }

  const handleColorChange = (index: number, color: string) => {
    setImageUploads((prev) => prev.map((img, i) => (i === index ? { ...img, color } : img)))
  }

  const handlePrimaryChange = (index: number) => {
    setImageUploads((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.price ||
      !formData.gender ||
      !formData.season ||
      !formData.stock ||
      formData.sizes.length === 0 ||
      imageUploads.length === 0
    ) {
      alert("Please fill in all fields and add at least one image")
      return
    }

    // Check if all images have colors
    if (imageUploads.some((img) => !img.color.trim())) {
      alert("Please specify a color for each image")
      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("price", formData.price)
      submitData.append("gender", formData.gender)
      submitData.append("season", formData.season)
      submitData.append("stock", formData.stock)
      submitData.append("sizes", JSON.stringify(formData.sizes))

      // Add images data
      const imagesData = imageUploads.map((img, index) => ({
        color: img.color,
        isPrimary: img.isPrimary,
        index,
      }))
      submitData.append("imagesData", JSON.stringify(imagesData))

      // Add image files
      imageUploads.forEach((img, index) => {
        submitData.append(`image_${index}`, img.file)
      })

      const response = await fetch("/api/products", {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      const { product } = await response.json()
      onProductAdded(product)
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Failed to create product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add New Product</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boys">Boys</SelectItem>
                    <SelectItem value="girls">Girls</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="season">Season</Label>
                <Select
                  value={formData.season}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, season: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="autumn">Autumn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Available Sizes</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSizes.map((size) => (
                  <Badge
                    key={size}
                    variant={formData.sizes.includes(size) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleSizeToggle(size)}
                  >
                    Size {size}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Product Images & Colors</Label>
                <Button type="button" onClick={handleImageAdd} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </div>

              {imageUploads.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No images added yet</p>
                  <Button type="button" onClick={handleImageAdd} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Image
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {imageUploads.map((image, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="relative">
                          <img
                            src={image.preview || "/placeholder.svg"}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleImageRemove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          {image.isPrimary && <Badge className="absolute bottom-2 left-2">Primary</Badge>}
                        </div>

                        <div className="space-y-2">
                          <Label>Color</Label>
                          <Input
                            value={image.color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            placeholder="e.g., Red, Blue, Black"
                            required
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`primary_${index}`}
                            name="primary"
                            checked={image.isPrimary}
                            onChange={() => handlePrimaryChange(index)}
                          />
                          <Label htmlFor={`primary_${index}`}>Set as primary image</Label>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
