"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createServerSchema, TCreateServerSchema } from "@/lib/zod-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FileUpload } from "../file-upload";
import { useMutation } from "@tanstack/react-query";
import { createServerAction } from "@/actions/server-actions";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "../error-message";
import { SuccessMessage } from "../success-message";
import { Spinner } from "../spinner";

export function InitialModal() {
  const router = useRouter();
  const form = useForm<TCreateServerSchema>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      serverName: "",
      imageUrl: "",
    },
  });

  const { mutate, isPending, data } = useMutation({
    mutationKey: ["create-server"],
    mutationFn: createServerAction,
    onSuccess: (data) => {
      if (data.success) {
        form.reset();
        router.push(`/servers/${data.newServer.id}`);
      }
    },
  });

  const onSubmit = (values: TCreateServerSchema) => {
    mutate(values);
  };

  return (
    <Dialog open>
      <DialogContent>
        <div className="mt-3">
          {data?.error && <ErrorMessage message={data.error} />}
          {data?.success && <SuccessMessage message={data.success} />}
        </div>
        <DialogHeader>
          <DialogTitle className="text-3xl">Create a server</DialogTitle>
          <DialogDescription className="text-sm">
            Give your server a personality with a name an image. You can always
            change it later.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        isPending={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter server name"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={isPending} type="submit">
                  {isPending ? <Spinner text="Loading..." /> : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
