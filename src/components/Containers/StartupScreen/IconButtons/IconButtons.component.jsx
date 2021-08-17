import React from 'react';

import ButtonTitleDescription from 'components/Global/ButtonTitleDescription/ButtonTitleDescription.component';

import { Link } from 'react-router-dom';

const IconButtons = ({ icon, title, description, navigateTo }) => {
  return (
    <Link to="/record">
      <button className="bg-grey1 p-5 mb-5 w-full grid grid-flow-col auto-cols-max gap-6 items-center hover:bg-accent transition duration-300">
        <div>
          <img width="58px" src={icon} alt="Icon" />
        </div>
        <div className="text-left">
          <ButtonTitleDescription title={title} description={description} />
        </div>
      </button>
    </Link>
  );
};

export default IconButtons;
