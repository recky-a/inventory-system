"use server"

import { deleteTransactions, insertTransaction, updateTransaction } from "@/db/repositories/transaction.repository";
import { transactionSchema, TransactionSchema } from "@/forms/schema";
import { Transaction } from "@/types/transaction";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function addTransaction(transactionData: TransactionSchema) {
  try {
    const { date, qty, total, productId } = transactionSchema.parse(transactionData);
    const result = await insertTransaction({ date: new Date(date), qty, total, productId });
    revalidatePath("/administration/kelola-transaksi", "page")
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Gagal memvalidasi inputan data transaction" }
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

export async function editTransaction(transactionData: Partial<TransactionSchema>) {
  try {
    const { date, qty, total, productId, id } = transactionSchema.parse(transactionData);
    const result = await updateTransaction({ id: id!, date: new Date(date), qty, total, productId });
    revalidatePath("/administration/kelola-transaksi", "page")
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Gagal memvalidasi inputan data transaction" }
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


export async function destroyTransactions(selectedTransactions: Transaction[]) {
  try {
    // const transactionIDSchema = transactionSchema.shape.id.refine((val): val is number => typeof val === "number",
    //   { message: "ID must be a number" });
    const transactionIDSchema = z.number()
    // validate the selectedTransactions using the above schema which only validated the id of selected transactions
    const ids = selectedTransactions.map(sTransaction => transactionIDSchema.parse(sTransaction.id))
    const result = await deleteTransactions(ids);
    revalidatePath("/administration/kelola-transaksi", "page")

    return result
  } catch (error) {
    return { success: false, message: "Failed to delete selected transactions" }
  }
}
