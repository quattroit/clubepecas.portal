import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-surface placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-muted aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex field-sizing-content min-h-28 w-full rounded-xl border px-3.5 py-3 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm read-only:bg-muted/40 read-only:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
