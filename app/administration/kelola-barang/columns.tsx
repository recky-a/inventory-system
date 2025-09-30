"use client"

import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Product } from "@/types/product"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Product>[] = [
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
    id: "Kode Barang",
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode Barang" />
    ),
  },
  {
    id: "Nama Barang",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Barang" />
    ),
  },
  {
    id: "Jumlah Barang",
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jumlah Barang" />
    ),
  },
  {
    id: "Harga",
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Harga" />
    ),
  }
]
