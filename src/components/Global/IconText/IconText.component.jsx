import React from 'react';

const IconText = ({ icon, text }) => {
  return (
    <>
      <span className="mr-2">
        <img width="35rem" src={icon} alt="Icon" />
      </span>
      <span className="text-xl">{text}</span>
    </>
  );
};

export default IconText;
