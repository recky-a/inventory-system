import { transaction } from "@/db/schema";
import { Product } from "./product";

export type Transaction = {
	id: number;
	date: Date;
	qty: number;
	total: number;
	productId: number;
} | typeof transaction.$inferSelect

export type TransactionWithProduct = Transaction & {
	product: Product
}

export type NewTransaction = typeof transaction.$inferInsert
