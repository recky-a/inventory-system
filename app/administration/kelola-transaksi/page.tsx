import { db } from "@/lib/db"
import { DataTableActionProvider } from "@/components/data-table-providers";
import TransactionTable from "@/components/transaction-table";

export default async function ManageTransaction() {
  const transactions= await db.query.transaction.findMany({
    with: {
      product: true
      // {
      //   columns: {
      //     name: true,
      //     price: true
      //   }
      // }
    }
  })
  return (
    <div>
      <DataTableActionProvider>
        <TransactionTable transactions={transactions} />
      </DataTableActionProvider>
    </div>
  )
}

