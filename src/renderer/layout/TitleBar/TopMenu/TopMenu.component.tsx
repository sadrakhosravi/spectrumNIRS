// Top Navigation of the app
import React from 'react';

// Menu import
import FileMenu from './File/File.menu';
import NewMenu from './New/New.menu';

const TopMenu = () => {
  return (
    <nav className="inline-block absolute top-0 h-full ">
      <ul className="top-menu h-full my-auto ml-3 ">
        <FileMenu />
        <NewMenu />
      </ul>
    </nav>
  );
};

export default TopMenu;
