"use client"

import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { TransactionWithProduct } from "@/types/transaction"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// type TransactionWithProductNameAndPrice = Transaction & { product: Pick<Product, "price" | "name"> }

export const columns: ColumnDef<TransactionWithProduct>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Pilih semua"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Pilih baris"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Tgl Transaksi",
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tgl Transaksi" />
    ),
    cell: info => {
      const value = info.getValue()
      if (!value) return null

      // Format in Indonesian: e.g. "Selasa, 2 September 2025 pukul 17.10"
      const formatted = format(new Date(value as string), "EEEE, d MMMM yyyy 'pukul' HH.mm", {
        locale: id,
      })

      return <span>{formatted}</span>
    },
  },
  // {
  //   id: "Item Transaksi",
  //   accessorKey: "qty",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Item Transaksi" />
  //   ),
  // },
  // {
  //   id: "Total Transaksi",
  //   accessorKey: "total",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Total Transaksi" />
  //   ),
  // },
  {
    id: "Jumlah",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jumlah" />
    ),
    cell: ({ row }) => {
      if (row.original.total && row.original.total > 0) {
        return row.original.total
      }
      const qty = row.original.qty ?? 0;
      const price = Number(row.original.product.price ?? 0);
      const subtotal = qty * price;
      return subtotal
    },
  },
  {
    id: "Nama Barang",
    accessorKey: "product.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Barang" />
    ),
  },

]

