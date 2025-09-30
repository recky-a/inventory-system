"use server"

import { deleteProducts, getProducts, insertProduct, updateProduct } from "@/db/repositories/product.repository";
import { productSchema, ProductSchema } from "@/forms/schema";
import { sanitizeSearchQuery, SearchQuerySchema } from "@/lib/utils";
import { Product } from "@/types/product";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function addProduct(productData: ProductSchema) {
  try {
    const { code, name, price, stock } = productSchema.parse(productData);
    const result = await insertProduct({ code, name, price: String(price), stock });
    revalidatePath("/administration/kelola-barang", "page")
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Gagal memvalidasi inputan data product" }
    }
    if (error instanceof Error && error.cause === 'db-23505') {
      return { success: false, message: error.message }
    }
    if (error instanceof Error && error.cause === "db_operation") {
      return { success: false, message: error.message }
    }
    return { success: false, message: "Server error" }
  }
}

export async function editProduct(productData: Partial<ProductSchema>) {
  try {
    const { code, name, price, stock, id } = productSchema.parse(productData);
    const result = await updateProduct({ id: id!, code, name, price: String(price), stock });
    revalidatePath("/administration/kelola-barang", "page")
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Gagal memvalidasi inputan data product" }
    }
    if (error instanceof Error && error.cause === 'db-23505') {
      return { success: false, message: error.message }
    }
    if (error instanceof Error && error.cause === "db_operation") {
      return { success: false, message: error.message }
    }
    return { success: false, message: "Server error" }
  }

}


export async function destroyProducts(selectedProducts: Product[]) {
  try {
    // const productIDSchema = productSchema.shape.id.refine((val): val is number => typeof val === "number",
    //   { message: "ID must be a number" });
    const productIDSchema = z.number()
    // validate the selectedProducts using the above schema which only validated the id of selected products
    const ids = selectedProducts.map(sProduct => productIDSchema.parse(sProduct.id))
    const result = await deleteProducts(ids);
    revalidatePath("/administration/kelola-barang", "page")

    return result
  } catch (error) {
    return { success: false, message: "Failed to delete selected products" }
  }
}

export async function searchProducts(searchQuery?: string) {
  try {
    const cleaned = sanitizeSearchQuery(searchQuery ?? undefined)
    if (cleaned) {
      SearchQuerySchema.parse(cleaned)
    }
    const data = await getProducts(cleaned ?? "")
    return data
  } catch (error) {
    throw error
  }
}

export async function getProductsById() {

}

