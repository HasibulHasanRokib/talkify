"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Progress } from "./ui/progress";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  isPending: boolean;
}

export function FileUpload({ onChange, value, isPending }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("serverImage", {
    onClientUploadComplete: (data) => {
      if (data && data.length > 0 && data[0].ufsUrl) {
        onChange(data[0].ufsUrl);
      }
    },

    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onUploadError: (error: Error) => {
      toast({
        title: `Error:${error.message}`,
        variant: "destructive",
      });
    },
  });

  if (value) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative h-20 w-20">
          <Image
            fill
            src={value}
            alt="Uploaded image"
            className="rounded-full object-cover shadow-sm ring-1"
          />
          <button
            type="button"
            disabled={isPending}
            className="absolute right-0 top-0 rounded-full bg-destructive p-1 text-white"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Dropzone
      onDrop={(acceptedFile) => startUpload(acceptedFile)}
      multiple={false}
      accept={{ "image/*": [] }}
      disabled={isUploading}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <section
          {...getRootProps()}
          className={cn(
            "flex min-h-56 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dotted bg-slate-100 p-4 transition-all",
            isDragActive ? "border-primary bg-slate-200" : "",
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex w-full flex-col items-center justify-center space-y-2">
              <Loader2 className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Uploading:{uploadProgress}%
              </p>
              <Progress value={uploadProgress} className="w-[50%]" />
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? "Drop the image here..."
                  : "Drag & drop an image here, or click to select"}
              </p>
            </div>
          )}
        </section>
      )}
    </Dropzone>
  );
}
