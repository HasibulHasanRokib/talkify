import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers, generateUploadButton } from "@uploadthing/react";

export const { uploadFiles, useUploadThing } =
  generateReactHelpers<OurFileRouter>();
export const UploadButton = generateUploadButton<OurFileRouter>();
