// Top Navigation of the app
import React from 'react';

// Menu import
import FileMenu from './File/File.menu';

const TopMenu = () => {
  return (
    <nav className="inline-block absolute top-0 h-full">
      <ul className="top-menu h-full my-auto ml-3">
        <FileMenu />
      </ul>
    </nav>
  );
};

export default TopMenu;
