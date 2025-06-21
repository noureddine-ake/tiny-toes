"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Package, Calendar, Users, Ruler, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductService, type Product } from "@/lib/product-service"

interface ProductDetailsModalProps {
  product: Product
  onClose: () => void
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const, color: "text-red-600" }
    if (stock <= 5) return { label: "Low Stock", variant: "secondary" as const, color: "text-yellow-600" }
    return { label: "In Stock", variant: "default" as const, color: "text-green-600" }
  }

  const stockStatus = getStockStatus(product.stock)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const currentImage = product.images[currentImageIndex]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Images */}
          <div className="relative">
            {currentImage && (
              <div className="relative">
                <Image
                  src={
                    ProductService.base64ToDataUrl(currentImage.imageData, currentImage.imageMimeType) ||
                    "/placeholder.svg"
                  }
                  alt={`${product.name} - ${currentImage.color}`}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Badge variant={stockStatus.variant} className="absolute top-4 right-4">
                  {stockStatus.label}
                </Badge>
                <Badge className="absolute top-4 left-4 bg-black/70 text-white">{currentImage.color}</Badge>

                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Image thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 relative ${index === currentImageIndex ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <Image
                      src={ProductService.base64ToDataUrl(image.imageData, image.imageMimeType) || "/placeholder.svg"}
                      alt={`${product.name} - ${image.color}`}
                      width={80}
                      height={60}
                      className="w-20 h-15 object-cover rounded"
                    />
                    <Badge className="absolute bottom-1 left-1 text-xs bg-black/70 text-white">{image.color}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">${product.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <span className={`font-semibold ${stockStatus.color}`}>{product.stock} in stock</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-semibold capitalize">{product.gender}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Season</p>
                  <p className="font-semibold capitalize">{product.season}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Ruler className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Available Sizes</p>
                  <p className="font-semibold">{product.sizes.join(", ")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-semibold">{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Available Colors */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Available Colors</p>
              <div className="flex flex-wrap gap-2">
                {product.images.map((image) => (
                  <Badge key={image.id} variant="outline">
                    {image.color}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
