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
import { transactionSchema, TransactionSchema } from "./schema"
import { Loader2 } from "lucide-react"
import { DateTimePicker } from "@/components/datetime-picker"
import ProductSelector from "@/components/product-selector"

export function TransactionForm({
  defaultValues,
  onSubmitAction,
  isPending,
}: {
  defaultValues?: Partial<TransactionSchema>;
  onSubmitAction: (data: TransactionSchema) => void;
  isPending?: boolean;
}) {
  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues ?? {
      date: new Date().toISOString(),
      qty: 1,
      total: 0,
      productId: 0,
    },
  })
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitAction)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pilih Produk</FormLabel>
              <FormControl>
                <ProductSelector onSelect={field.onChange} defaultValue={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Qty */}
        <FormField
          control={form.control}
          name="qty"
          render={({ field: { onChange, ...fieldController } }) => (
            <FormItem>
              <FormLabel>Jumlah Item</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...fieldController} onChange={(e) => onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total */}
        <FormField
          control={form.control}
          name="total"
          render={({ field: { onChange, ...fieldController } }) => (
            <FormItem>
              <FormLabel>Total Transaksi</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...fieldController} onChange={(e) => onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit">
          {isPending && (
            <Loader2 className="animate-spin mr-2 size-5" />
          )}
          Simpan
        </Button>
      </form>
    </Form>
  )
}

