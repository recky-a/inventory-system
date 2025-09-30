"use client";

import { Product } from "@/types/product";
import { DataTable } from "./data-table";
import { columns } from "@/app/administration/kelola-barang/columns";
import { ProductForm } from "@/forms/product-form";
import { ProductSchema } from "@/forms/schema";
import { Card, CardContent } from "./ui/card";
import { useDataTableAction } from "./data-table-providers";
import DataTableActionDialogs from "./data-table-action-dialogs";
import { addProduct, destroyProducts, editProduct } from "@/actions/product.action";
import { useTransition } from "react";
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from "./ui/alert-dialog";

export default function ProductTable({ products }: { products: Product[] }) {
  // selected row
  // action type
  // based on action type
  // render the action element
  const [isPending, startTransition] = useTransition()
  const { selectedData, setSelectedData } = useDataTableAction()

  const submitAddProduct = async (newProduct: ProductSchema) => {
    startTransition(async () => {
      const { success, message } = await addProduct(newProduct)
      if (!success) {
        toast.error(message)
        return
      }
      toast.success(message)
      return
    })
  }

  const submitEditProduct = async (productData: ProductSchema) => {
    startTransition(async () => {
      const { success, message } = await editProduct(productData)
      if (!success) {
        toast.error(message)
        return
      }
      toast.success(message)
      return
    })
  }

  const deleteConfirm = async (selectedProducts: Product[]) => {
    startTransition(async () => {
      const { success, message } = await destroyProducts(selectedProducts)
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
    add: <ProductForm isPending={isPending} onSubmitAction={submitAddProduct} />,
    edit: <ProductForm defaultValues={selectedData} onSubmitAction={submitEditProduct} />,
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
    delete: <DataTableActionDialogsDeleteContent products={selectedData} onConfirm={deleteConfirm} />
  }
  return <>
    <DataTable columns={columns} data={products ?? []} />
    <DataTableActionDialogs content={actionDialogContent} />
  </>
}

function DataTableActionDialogsDeleteContent({ products, onConfirm }: { products: Product[], onConfirm: (selectedProducts: Product[]) => void }) {

  return <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kode Barang</TableHead>
          <TableHead>Nama Barang</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product => <TableRow key={`DTActionDialogsDelContent-${product.code}`}>
          <TableCell>{product.code}</TableCell>
          <TableCell>{product.name}</TableCell>
        </TableRow>)}
      </TableBody>
    </Table>
    <AlertDialogFooter className="flex items-center-safe justify-between w-full" >
      <AlertDialogCancel>Batal</AlertDialogCancel>
      <AlertDialogAction onClick={() => onConfirm(products)}>Hapus</AlertDialogAction>
    </AlertDialogFooter>
  </>
}
