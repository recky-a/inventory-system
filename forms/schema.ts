import z from "zod";

export const loginFormSchema = z.object({
  email: z
    .email("Please enter a valid email"),
  password: z
    .string("Please enter a valid password")
    .min(6, "Password must be at least 6 characters"),
})

export const productSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, "Kode barang wajib diisi").max(15),
  name: z.string().min(1, "Nama barang wajib diisi").max(50),
  stock: z.number().int().nonnegative("Jumlah harus ≥ 0"),
  // price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Format harga tidak valid"),
  price: z.number()
})


export const transactionSchema = z.object({
  id: z.number().optional(),
  date: z.iso.datetime(),
  qty: z.number().int().positive("Jumlah item harus > 0"),
  total: z.number().int().nonnegative("Total harus ≥ 0"),
  productId: z.number().int().positive("Produk wajib dipilih"),
})


export type ProductSchema = z.infer<typeof productSchema>
export type TransactionSchema = z.infer<typeof transactionSchema>
