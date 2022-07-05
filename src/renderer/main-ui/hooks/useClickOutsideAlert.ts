import { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useOutsideAlerter = (ref: React.RefObject<any>, callback: () => void) => {
  useEffect(() => {
    const cleanListeners = () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeypress);
    };

    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: MouseEvent) => {
      console.log('click outside');
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
        cleanListeners();
      }
    };

    const handleKeypress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('Escape key pressed');
        cleanListeners();
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeypress);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeypress);
    };
  }, [ref]);
};
