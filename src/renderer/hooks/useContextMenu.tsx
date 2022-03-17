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

    ReactDOM.render(Menu, contextMenuContainer);

    const mainContainer = document.getElementById('root') as HTMLDivElement;
    const menu = document.getElementById('contextMenuList') as HTMLElement;

    const mainContainerSize = mainContainer.getBoundingClientRect();
    const menuSize = menu.getBoundingClientRect();

    if (y + menuSize.height + 30 >= mainContainerSize.height - 10) {
      menu.style.top = y - menuSize.height + 'px';
    } else {
      menu.style.top = y + 'px';
    }
    if (x + menuSize.width + 30 >= mainContainerSize.width - 10) {
      menu.style.left = x - menuSize.width + 'px';
    } else {
      menu.style.left = x + 'px';
    }

    setIsOpen(true);
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
