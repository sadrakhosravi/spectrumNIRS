import React from 'react';
import LogoPNG from '@img/Logo.png';

const Logo = () => {
  return (
    <img
      src={LogoPNG}
      width="30px"
      height="25px"
      className="pl-3 inline-block"
      alt="NIRS Software"
    />
  );
};

export default Logo;
