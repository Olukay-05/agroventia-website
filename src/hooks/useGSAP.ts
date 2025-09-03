// hooks/useGSAP.ts
// import { useEffect, useRef } from "react";
// import gsap from "gsap";

// export const useGSAP = (callback: () => void, deps: any[] = []) => {
//   const elementRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     if (elementRef.current) {
//       callback();
//     }
//   }, [callback, ...deps]);

//   return { elementRef };
// };
