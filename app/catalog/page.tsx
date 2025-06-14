"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { products } from "@/lib/products"

export default function CatalogPage() {
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [sizeFilter, setSizeFilter] = useState<string>("all")

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const genderMatch = genderFilter === "all" || product.gender === genderFilter
      const sizeMatch = sizeFilter === "all" || product.sizes.includes(Number.parseInt(sizeFilter))
      return genderMatch && sizeMatch
    })
  }, [genderFilter, sizeFilter])

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
              <label className="text-sm font-medium text-gray-600">Size</label>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="16">Size 16</SelectItem>
                  <SelectItem value="17">Size 17</SelectItem>
                  <SelectItem value="18">Size 18</SelectItem>
                  <SelectItem value="19">Size 19</SelectItem>
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
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      product.gender === "boys" ? "bg-blue-500 hover:bg-blue-600" : "bg-pink-500 hover:bg-pink-600"
                    }`}
                  >
                    {product.gender === "boys" ? "Boys" : "Girls"}
                  </Badge>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{product.name}</h3>

                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">${product.price}</div>
                    <div className="text-sm text-gray-500">Sizes: {product.sizes.join(", ")}</div>
                  </div>

                  {/* <Button className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Add to Cart
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No products found matching your filters.</div>
            <Button
              onClick={() => {
                setGenderFilter("all")
                setSizeFilter("all")
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
