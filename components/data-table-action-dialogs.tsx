"use client"

import { DataTableActionDialogContent, DataTableActionType } from "@/types/data-table"
import { useDataTableAction } from "./data-table-providers"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { useMemo } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"



interface DataTableActionDialogsProps {
  content: DataTableActionDialogContent
}

export default function DataTableActionDialogs({ content }: DataTableActionDialogsProps) {
  const { actionType, setActionType } = useDataTableAction()
  const closeDialog = () => setActionType(false)

  const actionConfig: Record<
    Exclude<DataTableActionType, false>,
    { title: string; description?: string }
  > = useMemo(() => ({
    add: {
      title: "Tambah / Buat",
      description: "Isi data baru pada form berikut.",
    },
    edit: {
      title: "Edit / Ubah",
      description: "Ubah data yang sudah ada.",
    },
    view: {
      title: "Lihat",
      description: "Detail data yang dipilih.",
    },
    delete: {
      title: "Hapus",
      description: "Apakah Anda yakin ingin menghapus data ini?",
    },
  }
  ), [])

  const { title, description } = useMemo(() => {
    if (actionType === false) return { title: "", description: "" };
    return actionConfig[actionType]
  }, [actionType])

  if (actionType === 'delete') {
    return <AlertDialog open={actionType === "delete"} defaultOpen={actionType === 'delete'} onOpenChange={closeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin ingin menghapus data?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus data secara permanen
            dan menghapus data dari server
          </AlertDialogDescription>
        </AlertDialogHeader>
        {content[actionType]}
        {/* <AlertDialogFooter className="flex items-center-safe justify-between w-full" > */}
        {/*   <AlertDialogCancel>Batal</AlertDialogCancel> */}
        {/*   <AlertDialogAction>Hapus</AlertDialogAction> */}
        {/* </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  }

  return <Dialog open={actionType !== false} onOpenChange={closeDialog}>
    <DialogContent >
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          {/* {actionType && actionType === 'add' ? "Tambah/Buat" : (actionType === "edit" ? "Edit/Ubah" : (actionType === "view" ? "Lihat" : "Hapus"))} */}
          {title}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription>

      </DialogHeader>
      {/* {actionType && actionElements[actionType]} */}
      {actionType && content[actionType]}
    </DialogContent>
  </Dialog>
}

