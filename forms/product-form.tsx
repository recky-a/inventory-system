"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { productSchema, ProductSchema } from "./schema"
import { Loader2 } from "lucide-react"

export function ProductForm({
  defaultValues,
  onSubmitAction,
  isPending
}: {
  defaultValues?: Partial<ProductSchema>;
  onSubmitAction: (data: ProductSchema) => void;
  isPending?: boolean;
}) {
  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ? {
      id: defaultValues.id,
      code: defaultValues.code,
      name: defaultValues.name,
      stock: defaultValues.stock ? defaultValues.stock : 0,
      price: defaultValues.price ? parseInt(`${defaultValues.price}`) : 0
    } : {
      code: "",
      name: "",
      stock: 0,
      price: 0,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitAction)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Barang</FormLabel>
              <FormControl>
                <Input placeholder="BRG001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Barang</FormLabel>
              <FormControl>
                <Input placeholder="Nama produk..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Barang</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input type="text" placeholder="10000.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          {isPending && <Loader2 className="animate-in spin-in repeat-infinite duration-150 ease-linear size-5" />}
          Simpan
        </Button>
      </form>
    </Form>
  )
}

