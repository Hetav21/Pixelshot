import { useEffect, useState } from "react";

export function useCounter(): number | null {
  const [value, setValue] = useState<number | null>(null);

  // A function returned from useEffect
  // will be called when the component is unmounted
  useEffect(() => {
    const unsub = window.electronAPI.subscribeCounter((val) => setValue(val));

    return unsub;
  }, []);

  return value;
}
