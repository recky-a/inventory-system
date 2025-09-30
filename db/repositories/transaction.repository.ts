import { db } from "@/lib/db";
import { NewTransaction, Transaction } from "@/types/transaction";
import "server-only"
import { transaction } from "../schema";
import { NeonDbError } from "@neondatabase/serverless";
import { eq, sql } from "drizzle-orm";

export async function insertTransaction(newTransaction: NewTransaction) {
  try {
    await db.insert(transaction).values(newTransaction);
    return { success: true, message: "Successfully inserted new transaction" }
  } catch (error) {
    const neonErr = getNeonError(error);
    if (neonErr && neonErr.code === "23505") {
      throw new Error(`Duplicate transaction's code. 
Detail: ${neonErr.detail}`, { cause: "db-23505" })
    }
    throw new Error("Failed to insert new transaction", { cause: "db_operation" })
  }
}

export async function updateTransaction(transactionData: Transaction) {
  try {
    await db.update(transaction).set({ date: transactionData.date, qty: transactionData.qty, total: transactionData.total, productId: transactionData.productId
  }).where(eq(transaction.id, transactionData.id))
  return { success: true, message: "Successfully updated transaction" }
} catch (error) {
  const neonErr = getNeonError(error);
  if (neonErr && neonErr.code === "23505") {
    throw new Error(`Duplicate transaction's code. 
Detail: ${neonErr.detail}`, { cause: "db-23505" })
  }
  throw new Error("Failed to update transaction", { cause: "db_operation" })
}
}

export async function deleteTransactions(selectedTransactionIDs: Transaction["id"][]) {
  try {
    await db.delete(transaction).where(sql`${transaction.id} IN (${sql.join(selectedTransactionIDs)})`)
    return { success: true, message: "Successfully deleted transaction/s" }
  } catch (error) {
    throw new Error("Failed to delete transaction/s", { cause: "db_operation" })
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

