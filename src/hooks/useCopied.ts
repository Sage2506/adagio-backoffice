import { useEffect, useState } from "react";


export function useCopied() {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1500)
    }
  }, [copied])
  return { copied, setCopied }
}