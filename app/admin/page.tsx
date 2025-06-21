import { ProductService } from "@/lib/product-service"
import AdminDashboard from "./admin-dashboard"

export default async function AdminPage() {
  // Fetch products on the server side
  const products = await ProductService.getAllProducts()

  // Pass data to client component
  return <AdminDashboard initialProducts={products} />
}
