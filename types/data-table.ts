import { JSX } from "react"

export type DataTableActionType = 'add' | 'edit' | 'view' | 'delete' | false

// export type DataTableActionElements<TData> = {
//   [K in Exclude<DataTableActionType, false>]: JSX.Element | ComponentType<{ defaultValues:TData }>
// }
// export type DataTableActionRenderer<TData> = (props: { row?: TData }) => ReactNode
// export type DataTableActionElements<TData> = {
//   [K in Exclude<DataTableActionType, false>]: DataTableActionRenderer<TData>
// }
// export type DataTableActionElements<TData> = {
//   add: DataTableActionRenderer<TData>;
//   edit: DataTableActionRenderer<TData>;
//   view: DataTableActionRenderer<TData>;
//   delete: DataTableActionRenderer<TData>;
// };
export type DataTableActionDialogContent = {
  [K in Exclude<DataTableActionType,false>] : JSX.Element
}
