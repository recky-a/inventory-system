import { Table } from "@tanstack/react-table"
import { Button } from "./ui/button"
import { useDataTableAction } from "./data-table-providers"

interface DataTableActionProps<TData> {
  table: Table<TData>
}

export default function DataTableActionButtons<TData>({ table }: DataTableActionProps<TData>) {
  const { setActionType, setSelectedData } = useDataTableAction()
  return (
    <div className="flex gap-x-1.5 items-center justify-center-safe">
      <Button onClick={() => setActionType('add')}>Tambah</Button>
      <Button onClick={() => {
        setActionType('edit');
        const selectedData = table.getFilteredSelectedRowModel().rows[0].original
        setSelectedData(selectedData)
      }} disabled={!(table.getFilteredSelectedRowModel().rows.length === 1)}>Edit</Button>
      <Button onClick={() => {
        setActionType('view')
        const selectedData = table.getFilteredSelectedRowModel().rows[0].original
        setSelectedData(selectedData)
      }} disabled={table.getFilteredSelectedRowModel().rows.length < 1}>Lihat</Button>
      <Button onClick={() => {
        setActionType('delete')
        const selectedData = table.getFilteredSelectedRowModel().rows.map(r => r.original)  
        setSelectedData(selectedData)
      }} disabled={table.getFilteredSelectedRowModel().rows.length < 1}>Hapus</Button>
    </div>
  )
}

