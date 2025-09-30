import { db } from "@/lib/db";
import { NewProduct, Product } from "@/types/product";
import "server-only"
import { product } from "../schema";
import { NeonDbError } from "@neondatabase/serverless";
import { desc, eq, ilike, like, or, sql } from "drizzle-orm";

export async function insertProduct(newProduct: NewProduct) {
  try {
    await db.insert(product).values(newProduct);
    return { success: true, message: "Successfully inserted new product" }
  } catch (error) {
    const neonErr = getNeonError(error);
    if (neonErr && neonErr.code === "23505") {
      throw new Error(`Duplicate product's code. 
Detail: ${neonErr.detail}`, { cause: "db-23505" })
    }
    throw new Error("Failed to insert new product", { cause: "db_operation" })
  }
}

export async function updateProduct(productData: Product) {
  try {
    await db.update(product).set({ name: productData.name, code: productData.code, stock: productData.stock, price: String(productData.price) }).where(eq(product.id, productData.id))
    return { success: true, message: "Successfully updated product" }
  } catch (error) {
    const neonErr = getNeonError(error);
    if (neonErr && neonErr.code === "23505") {
      throw new Error(`Duplicate product's code. 
Detail: ${neonErr.detail}`, { cause: "db-23505" })
    }
    throw new Error("Failed to update product", { cause: "db_operation" })
  }
}

export async function deleteProducts(selectedProductIDs: Product["id"][]) {
  try {
    await db.delete(product).where(sql`${product.id} IN (${sql.join(selectedProductIDs)})`)
    return { success: true, message: "Successfully deleted product/s" }
  } catch (error) {
    throw new Error("Failed to delete product/s", { cause: "db_operation" })
  }
}

export async function getProducts(query?: string, opts = { limit: 10 }) {
  try {
    // perhaps later on add: order by, order by direction, and etc
    const { limit } = opts;
    const products = await db.select().from(product).limit(limit).where(query ? or(like(product.code, `%${query}%`), ilike(product.name, `%${query}%`)) : undefined).orderBy(desc(product.id))
    return { success: true, products: products }
  } catch (error) {
    throw new Error("Failed to get products")
  }
}

function getNeonError(err: unknown): NeonDbError | null {
  if (err && typeof err === "object" && "cause" in err) {
    const cause = (err as any).cause;
    if (cause instanceof NeonDbError) {
      return cause;
    }
  }
  return null;
}

