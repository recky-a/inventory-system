import { product } from "@/db/schema"
import { db } from "@/lib/db"
import ProductTable from "@/components/product-table";
import { DataTableActionProvider } from "@/components/data-table-providers";

export default async function ManageProduct() {
  const products = await db.select().from(product);
  return (
    <div>
      <DataTableActionProvider>
        <ProductTable products={products} />
      </DataTableActionProvider>
    </div>
  )
}

