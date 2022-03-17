import React from 'react';
import LogoPNG from '@img/Logo.png';

const Logo = () => {
  return (
    <img
      src={LogoPNG}
      width="26px"
      height="26px"
      className="mx-2 inline-block"
      alt="NIRS Software"
    />
  );
};

export default Logo;
