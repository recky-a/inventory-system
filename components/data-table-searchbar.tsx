import { Table } from "@tanstack/react-table";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export default function DataTableSearchBar<TData>({ table }: {
  table: Table<TData>
}) {
  const [value, setValue] = useState("")
  const debounced = useDebounce(value, 400)
  useEffect(() => { table.setGlobalFilter(debounced) }, [debounced, table])
  return (
    <div>
      <Input value={value} placeholder="Cari..." onChange={e => setValue(String(e.target.value))} />
    </div>
  )
}

