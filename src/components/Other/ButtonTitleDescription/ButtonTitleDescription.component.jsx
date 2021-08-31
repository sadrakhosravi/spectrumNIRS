import React from 'react';

const ButtonTitleDescription = ({ title, description }) => {
  return (
    <>
      <h3 className="font-bold">{title}</h3>
      <p className="text-base text-light">{description}</p>
    </>
  );
};

export default ButtonTitleDescription;
