import { useEffect, useState } from 'react';

function useScreenSize() {
  const [size, setSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const onResize = () => {
      setSize({ height: window.innerHeight, width: window.innerWidth });
    };
    // runs on initial render
    onResize();

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return size;
}

export default useScreenSize;
