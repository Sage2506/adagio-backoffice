import { useEffect, useState } from "react";

export function useLoadingLabel(label: string, isLoading: boolean, interval = 500) {
  const [loadingLabel, setLoadingLabel] = useState(label);

  useEffect(() => {
    if (!isLoading) {
      setLoadingLabel(label);
      return;
    }

    let dotCount = 0;
    const intervalId = window.setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setLoadingLabel(`${label}${".".repeat(dotCount)}`);
    }, interval);

    return () => window.clearInterval(intervalId);
  }, [interval, isLoading, label]);

  return loadingLabel;
}
