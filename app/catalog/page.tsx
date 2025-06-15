import { ProductService } from "@/lib/product-service"
import CatalogClient from "./catalog-client"

export default async function CatalogPage() {
  // Fetch products on the server side
  const products = await ProductService.getAllProducts()

  // Pass data to client component
  return <CatalogClient initialProducts={products} />
}
