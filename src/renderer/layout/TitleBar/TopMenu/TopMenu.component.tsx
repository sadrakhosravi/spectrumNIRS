// Top Navigation of the app
import React from 'react';

// Menu import
import FileMenu from './File/File.menu';
import HelpMenu from './Help/Help.menu';
import NewMenu from './New/New.menu';

const TopMenu = (): JSX.Element => {
  return (
    <nav className="inline-block h-40px">
      <ul className="top-menu h-full my-auto ml-3 ">
        <FileMenu />
        <NewMenu />
        <HelpMenu />
      </ul>
    </nav>
  );
};

export default TopMenu;
