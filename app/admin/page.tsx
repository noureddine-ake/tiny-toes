"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Loader2 } from "lucide-react"

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    gender: "",
    sizes: [] as number[],
    image: null as File | null,
  })

  const availableSizes = [16, 17, 18, 19]

  const handleSizeToggle = (size: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size].sort(),
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.gender ||
      formData.sizes.length === 0 ||
      !formData.image
    ) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("description", formData.description)
      submitData.append("price", formData.price)
      submitData.append("gender", formData.gender)
      submitData.append("sizes", JSON.stringify(formData.sizes))
      submitData.append("image", formData.image)

      const response = await fetch("/api/products", {
        method: "POST",
        body: submitData,
      })

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      setSuccess(true)
      setFormData({
        name: "",
        description: "",
        price: "",
        gender: "",
        sizes: [],
        image: null,
      })

      // Reset file input
      const fileInput = document.getElementById("image") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Failed to create product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                Product created successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  rows={3}
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
                <Label htmlFor="image">Product Image</Label>
                <div className="mt-2">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
                  {formData.image && <p className="text-sm text-gray-600 mt-1">Selected: {formData.image.name}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
