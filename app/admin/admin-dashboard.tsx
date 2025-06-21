"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit, Trash2, Search, Package, TrendingUp, AlertTriangle } from "lucide-react"
import { ProductService, type Product } from "@/lib/product-service"
import ProductDetailsModal from "./product-details-modal"
import EditProductModal from "./edit-product-modal"
import AddProductForm from "./add-product-form"

interface AdminDashboardProps {
  initialProducts: Product[]
}

export default function AdminDashboard({ initialProducts }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [seasonFilter, setSeasonFilter] = useState<string>("all")
  const [sizeFilter, setSizeFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")

  // Modal states
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const availableSizes = Array.from({ length: 10 }, (_, i) => i + 16) // 16 to 25

  // Apply filters
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Gender filter
    if (genderFilter !== "all") {
      filtered = filtered.filter((product) => product.gender === genderFilter)
    }

    // Season filter
    if (seasonFilter !== "all") {
      filtered = filtered.filter((product) => product.season === seasonFilter)
    }

    // Size filter
    if (sizeFilter !== "all") {
      filtered = filtered.filter((product) => product.sizes.includes(Number.parseInt(sizeFilter)))
    }

    // Stock filter
    if (stockFilter === "in-stock") {
      filtered = filtered.filter((product) => product.stock > 0)
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter((product) => product.stock === 0)
    } else if (stockFilter === "low-stock") {
      filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 5)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, genderFilter, seasonFilter, sizeFilter, stockFilter])

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setProducts((prev) => prev.filter((p) => p.id !== productId))
        } else {
          alert("Failed to delete product")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Failed to delete product")
      }
    }
  }

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    setShowEditModal(false)
    setSelectedProduct(null)
  }

  const handleProductAdded = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev])
    setShowAddForm(false)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (stock <= 5) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  const totalProducts = products.length
  const inStockProducts = products.filter((p) => p.stock > 0).length
  const outOfStockProducts = products.filter((p) => p.stock === 0).length
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-600">Manage your sneaker inventory</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">{inStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{lowStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                </SelectContent>
              </Select>

              <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="autumn">Autumn</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
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

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setGenderFilter("all")
                  setSeasonFilter("all")
                  setSizeFilter("all")
                  setStockFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock)
            return (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={(() => {
                        const primaryImage = ProductService.getPrimaryImage(product)
                        return primaryImage
                          ? ProductService.base64ToDataUrl(primaryImage.imageData, primaryImage.imageMimeType)
                          : "/placeholder.svg"
                      })()}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />

                    {/* Action Buttons Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowDetailsModal(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowEditModal(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Stock Badge */}
                    <Badge variant={stockStatus.variant} className="absolute top-2 right-2">
                      {stockStatus.label}
                    </Badge>

                    {/* Gender Badge */}
                    <Badge
                      className={`absolute top-2 left-2 ${product.gender === "boys" ? "bg-blue-500" : "bg-pink-500"}`}
                    >
                      {product.gender === "boys" ? "Boys" : "Girls"}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="capitalize">{product.season}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Colors: {product.images.length}</span>
                      <span>Sizes: {product.sizes.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">${product.price}</span>
                      <span className="text-sm text-gray-500">Sizes: {product.sizes.join(", ")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or add a new product.</p>
          </div>
        )}

        {/* Modals */}
        {showAddForm && <AddProductForm onClose={() => setShowAddForm(false)} onProductAdded={handleProductAdded} />}

        {showDetailsModal && selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => {
              setShowDetailsModal(false)
              setSelectedProduct(null)
            }}
          />
        )}

        {showEditModal && selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            onClose={() => {
              setShowEditModal(false)
              setSelectedProduct(null)
            }}
            onProductUpdated={handleProductUpdated}
          />
        )}
      </div>
    </div>
  )
}
