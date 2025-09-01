import dynamic from "next/dynamic";
import { ReactNode } from "react";



export default dynamic(() => {
  return Promise.resolve(({ children }: { children?: ReactNode }) => {
    return children;
  });
}, {
  ssr: false
});