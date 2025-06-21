"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductService, type Product } from "@/lib/product-service"

interface CatalogClientProps {
  initialProducts: Product[]
}

export default function CatalogClient({ initialProducts }: CatalogClientProps) {
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [seasonFilter, setSeasonFilter] = useState<string>("all")
  const [sizeFilter, setSizeFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")

  // Track current image index for each product
  const [productImageIndexes, setProductImageIndexes] = useState<Record<string, number>>({})

  const availableSizes = Array.from({ length: 10 }, (_, i) => i + 16) // 16 to 25

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const genderMatch = genderFilter === "all" || product.gender === genderFilter
      const seasonMatch = seasonFilter === "all" || product.season === seasonFilter
      const sizeMatch = sizeFilter === "all" || product.sizes.includes(Number.parseInt(sizeFilter))
      const stockMatch =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.stock > 0) ||
        (stockFilter === "out-of-stock" && product.stock === 0)

      return genderMatch && seasonMatch && sizeMatch && stockMatch
    })
  }, [initialProducts, genderFilter, seasonFilter, sizeFilter, stockFilter])

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="absolute top-3 left-3">
          Stock Out
        </Badge>
      )
    }
    if (stock <= 5) {
      return (
        <Badge variant="secondary" className="absolute top-3 left-3">
          Low Stock
        </Badge>
      )
    }
    return null
  }

  const getCurrentImage = (product: Product) => {
    const currentIndex = productImageIndexes[product.id] || 0
    return product.images[currentIndex] || product.images[0]
  }

  const nextImage = (productId: string, totalImages: number) => {
    setProductImageIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }))
  }

  const prevImage = (productId: string, totalImages: number) => {
    setProductImageIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages,
    }))
  }

  const setImageIndex = (productId: string, index: number) => {
    setProductImageIndexes((prev) => ({
      ...prev,
      [productId]: index,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Kids Sneakers Catalog</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <h2 className="text-lg font-semibold text-gray-700">Filter by:</h2>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Gender</label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Season</label>
              <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="autumn">Autumn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Size</label>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  {availableSizes.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      Size {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Stock</label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="ml-auto">
            <Badge variant="secondary" className="text-sm">
              {filteredProducts.length} products found
            </Badge>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const currentImage = getCurrentImage(product)
            const currentIndex = productImageIndexes[product.id] || 0

            return (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={
                        currentImage
                          ? ProductService.base64ToDataUrl(currentImage.imageData, currentImage.imageMimeType)
                          : "/placeholder.svg"
                      }
                      alt={`${product.name} - ${currentImage?.color || "Default"}`}
                      width={300}
                      height={300}
                      className={`w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 ${
                        product.stock === 0 ? "grayscale opacity-60" : ""
                      }`}
                    />

                    {/* Image Navigation - Only show if multiple images */}
                    {product.images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            prevImage(product.id, product.images.length)
                          }}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            nextImage(product.id, product.images.length)
                          }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>

                        {/* Image dots indicator */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {product.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation()
                                setImageIndex(product.id, index)
                              }}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentIndex ? "bg-white" : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Stock Badge */}
                    {getStockBadge(product.stock)}

                    {/* Gender Badge */}
                    <Badge
                      className={`absolute top-3 right-3 ${
                        product.gender === "boys" ? "bg-blue-500 hover:bg-blue-600" : "bg-pink-500 hover:bg-pink-600"
                      }`}
                    >
                      {product.gender === "boys" ? "Boys" : "Girls"}
                    </Badge>

                    {/* Current Color Badge */}
                    {currentImage && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
                        {currentImage.color}
                      </Badge>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{product.name}</h3>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-600">${product.price}</div>
                      <div className="text-sm text-gray-500">
                        <span className="capitalize">{product.season}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {product.images.length > 1 ? (
                          <span className="font-medium">{product.images.length} colors</span>
                        ) : (
                          <span>1 color</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">Stock: {product.stock === 0 ? "Out" : product.stock}</div>
                    </div>

                    <div className="text-sm text-gray-500">Sizes: {product.sizes.join(", ")}</div>

                    {/* Color thumbnails - Only show if multiple colors */}
                    {product.images.length > 1 && (
                      <div className="flex gap-1 mt-2">
                        {product.images.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              setImageIndex(product.id, index)
                            }}
                            className={`relative w-8 h-8 rounded border-2 transition-all ${
                              index === currentIndex
                                ? "border-blue-500 scale-110"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <Image
                              src={
                                ProductService.base64ToDataUrl(image.imageData, image.imageMimeType) ||
                                "/placeholder.svg"
                              }
                              alt={`${product.name} - ${image.color}`}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover rounded"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No products found matching your filters.</div>
            <Button
              onClick={() => {
                setGenderFilter("all")
                setSeasonFilter("all")
                setSizeFilter("all")
                setStockFilter("all")
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
