"use client"

import { DataTableActionType } from "@/types/data-table";
import { createContext, ReactNode, useContext, useState } from "react"


type DataTableActionContextType = {
  actionType: DataTableActionType;
  setActionType: (value: DataTableActionType) => void;
  selectedData: any | any[];
  setSelectedData: (data: any | any[]) => void;
}

export const DataTableActionContext = createContext<DataTableActionContextType | undefined>(undefined)

export function DataTableActionProvider({ children }: { children: ReactNode }) {
  const [actionType, setActionType] = useState<DataTableActionType>(false)
  const [selectedData, setSelectedData] = useState(null)

  return <DataTableActionContext.Provider value={{ actionType, setActionType, selectedData, setSelectedData }}>
    {children}
  </DataTableActionContext.Provider>
}

export function useDataTableAction() {
  const ctx = useContext(DataTableActionContext)
  if (!ctx) throw new Error("useDataTableAction must be used inside DataTableActionProvider")
  return ctx
}

// Maybe later add the DataTableActionContext into one manageable context
// export const DataTableActionContext = createContext()
//
// export const DataTableContext = createContext();
//
// export function DataTableProvider({ children }) {
// }
