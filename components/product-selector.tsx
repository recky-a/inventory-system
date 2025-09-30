"use client"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { CommandLoading } from "cmdk"
import { useEffect, useMemo, useState, useTransition } from "react"
import { Product } from "@/types/product"
import { cn } from "@/lib/utils"
import { searchProducts } from "@/actions/product.action"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/use-debounce"

interface ProductSelectorProps {
  defaultValue?: Product["id"];
  onSelect: (value: Product["id"]) => void
}

export default function ProductSelector({ defaultValue, onSelect }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<Product['id'] | null>(defaultValue ?? null)
  const [open, setOpen] = useState(false);
  const selectedProduct = useMemo(() => products.find(product => product.id === selectedProductId), [products, selectedProductId])
  const [searchQuery, setSearchQuery] = useState("")

  const debounced = useDebounce(searchQuery, 400)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const data = await searchProducts(debounced)
      if (data?.success) {
        setProducts(data.products)
        return
      }
      toast.error("Failed to get products data")
      return
    })
  }, [debounced])

  const handleSelect = (value: string) => {
    onSelect(parseInt(value))
    setOpen(false)
    setSelectedProductId(parseInt(value))
  }

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-96 justify-between"
        >
          {selectedProduct ? (
            <div className="flex flex-1 items-center justify-between">
              <ProductDisplay variant="horizontal" {...selectedProduct} />
            </div>
          ) : (
            <span className="text-muted-foreground">Pilih barang...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0">
        <Command shouldFilter={false}>
          <CommandInput onValueChange={setSearchQuery} placeholder="Cari barang..." className="h-9" />
          <CommandList>
            <CommandEmpty>Barang tidak ditemukan.</CommandEmpty>
            {isPending && <CommandLoading className="py-6 text-center text-sm"
            >Memuat data...</CommandLoading>}
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.id.toString()}
                  onSelect={handleSelect}
                >
                  <ProductDisplay {...product} />
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedProductId === product.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface ProductDisplayProps extends Omit<Product, "id"> {
  variant?: "horizontal" | "detailed"
}

function ProductDisplay({ code, name, price, stock, variant = "detailed" }: ProductDisplayProps) {
  if (variant === "horizontal") {
    return (
      <div className="flex w-full items-center gap-2 truncate text-sm">
        <span className="font-medium truncate">{name}</span>
        <span className="text-muted-foreground">- {code}</span>
        <span className="text-muted-foreground">- {price?.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
        <span className="text-muted-foreground">- Jmlh {stock}</span>
      </div>
    )
  }

  // Detailed (dropdown list)
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="font-medium text-sm">{name}</span>
        <span className="text-xs text-muted-foreground">{code}</span>
      </div>

      <div className="flex flex-col items-end text-right">
        <span className="text-sm font-semibold">
          {price?.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
        </span>
        <span className="text-xs text-muted-foreground">Jmlh: {stock}</span>
      </div>
    </div>
  )
}

