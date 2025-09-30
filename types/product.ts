import { product } from "@/db/schema";

export type Product = {
  id: number;
  code: string;
  name: string;
  stock: number;
  price: number;
} | typeof product.$inferSelect

export type NewProduct = typeof product.$inferInsert
