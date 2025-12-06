import { useEffect, useRef, useState } from 'react';

export function useElementSize<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    padding: {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    },
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateSize = () => {
      const style = getComputedStyle(element);

      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
        padding: {
          top: parseFloat(style.paddingTop),
          right: parseFloat(style.paddingRight),
          bottom: parseFloat(style.paddingBottom),
          left: parseFloat(style.paddingLeft),
        },
      });
    };

    updateSize(); // initial

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref.current]);

  return { ref, ...size };
}
