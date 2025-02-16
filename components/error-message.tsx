import { OctagonAlert } from "lucide-react";

export function ErrorMessage({ message }: { message: string | undefined }) {
  return (
    <>
      {message && (
        <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <OctagonAlert />
          {message}
        </div>
      )}
    </>
  );
}
