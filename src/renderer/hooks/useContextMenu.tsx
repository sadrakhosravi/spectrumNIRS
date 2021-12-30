// import { useEffect } from 'react';

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const useContextMenu = (containerId: string, Menu?: any) => {
  const [isOpen, setIsOpen] = useState(false);
  // Use a portal to render the container

  const contextMenuContainer = document.getElementById(
    'contextMenu'
  ) as HTMLDivElement;

  const handleContextMenu = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    const menu = document.getElementById('contextMenu') as HTMLElement;
    menu.style.top = y + 5 + 'px';
    menu.style.left = x + 5 + 'px';

    if (isOpen === false) {
      console.log('Already Opened');
    }

    console.log('CONTEXT MENU');
    setIsOpen(true);

    ReactDOM.render(Menu, contextMenuContainer);
  };

  const handleClick = (_event: MouseEvent) => {
    ReactDOM.unmountComponentAtNode(contextMenuContainer);
  };

  useEffect(() => {
    const container = document.getElementById(containerId) as HTMLElement;
    container.addEventListener('contextmenu', handleContextMenu);

    return () => {
      container.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById(containerId) as HTMLElement;
    if (isOpen) {
      container.addEventListener('click', handleClick);
    }
    if (isOpen === false) {
      container.removeEventListener('click', handleClick);
    }
    return () => container.removeEventListener('click', handleClick);
  }, [isOpen]);
};

export default useContextMenu;
