"use client";

import { DataTable } from "./data-table";
import { columns } from "@/app/administration/kelola-transaksi/columns";
import { TransactionForm } from "@/forms/transaction-form";
import { TransactionSchema } from "@/forms/schema";
import { Card, CardContent } from "./ui/card";
import { useDataTableAction } from "./data-table-providers";
import DataTableActionDialogs from "./data-table-action-dialogs";
import { addTransaction, destroyTransactions, editTransaction } from "@/actions/transaction.action";
import { useTransition } from "react";
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from "./ui/alert-dialog";
import { Transaction, TransactionWithProduct } from "@/types/transaction";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function TransactionTable({ transactions }: { transactions: TransactionWithProduct[] }) {
  const [isPending, startTransition] = useTransition()
  const { selectedData, setSelectedData } = useDataTableAction()

  const submitAddTransaction = async (newTransaction: TransactionSchema) => {
    startTransition(async () => {
      const { success, message } = await addTransaction(newTransaction)
      if (!success) {
        toast.error(message)
        return
      }
      toast.success(message)
      return
    })
  }

  const submitEditTransaction = async (transactionData: TransactionSchema) => {
    startTransition(async () => {
      const { success, message } = await editTransaction(transactionData)
      if (!success) {
        toast.error(message)
        return
      }
      toast.success(message)
      return
    })
  }

  const deleteConfirm = async (selectedTransactions: Transaction[]) => {
    startTransition(async () => {
      const { success, message } = await destroyTransactions(selectedTransactions)
      if (!success) {
        toast.error(message)
        return
      }
      setSelectedData([])
      toast.success(message)
      return

    })
  }

  const actionDialogContent = {
    add: <TransactionForm isPending={isPending} onSubmitAction={submitAddTransaction} />,
    edit: <TransactionForm defaultValues={selectedData} onSubmitAction={submitEditTransaction} />,
    view: <Card className="w-full max-w-lg mx-auto border border-muted shadow-md">
      <CardContent className="p-6 space-y-4">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="font-medium text-muted-foreground">Kode Barang</dt>
            <dd className="mt-1 text-base font-semibold">{selectedData?.code ?? "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Nama Barang</dt>
            <dd className="mt-1 text-base font-semibold">{selectedData?.name ?? "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Kategori</dt>
            <dd className="mt-1">{selectedData?.category ?? "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Harga</dt>
            <dd className="mt-1">
              {selectedData?.price
                ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(selectedData.price)
                : "-"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-muted-foreground">Deskripsi</dt>
            <dd className="mt-1 whitespace-pre-line">
              {selectedData?.description ?? "Tidak ada deskripsi"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>,
    delete: <DataTableActionDialogsDeleteContent transactions={selectedData} onConfirm={deleteConfirm} />
  }
  return <>
    <DataTable columns={columns} data={transactions ?? []} />
    <DataTableActionDialogs content={actionDialogContent} />
  </>
}

function DataTableActionDialogsDeleteContent({ transactions, onConfirm }: { transactions: TransactionWithProduct[], onConfirm: (selectedTransactions: Transaction[]) => void }) {
  return <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tgl Transaksi</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Nama Barang</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map(transaction => <TableRow key={`DTActionDialogsDelContent-${transaction.id}`}>
          <TableCell>
            {transaction.date && format(new Date(transaction.date), "EEEE, d MMMM yyyy 'pukul' HH.mm", {
              locale: id,
            })}
          </TableCell>
          <TableCell>{transaction.total}</TableCell>
          <TableCell>{transaction.product.name}</TableCell>
        </TableRow>)}
      </TableBody>
    </Table>
    <AlertDialogFooter className="flex items-center-safe justify-between w-full" >
      <AlertDialogCancel>Batal</AlertDialogCancel>
      <AlertDialogAction onClick={() => onConfirm(transactions)}>Hapus</AlertDialogAction>
    </AlertDialogFooter>
  </>
}
