"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useTransition } from "react";
import { loginFormSchema } from "./schema";
import { signIn } from "@/app/(auth)/login/_action";
import { toast } from 'sonner'
import { useRouter } from "next/navigation";


export default function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    startTransition(async () => {
      const res = await signIn(values)
      if (!res.success) {
        toast.error(`${res.message}`)
        return
      }

      return router.push("/administration/dashboard")
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="email" render={({ field }) => <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="Enter your email address" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>} />

        <FormField control={form.control} name="password" render={({ field }) => <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="Enter password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>} />

        <div className="mt-5">
          <Button disabled={isPending} type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}

