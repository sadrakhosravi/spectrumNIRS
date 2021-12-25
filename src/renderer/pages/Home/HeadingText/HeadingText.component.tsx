import React from 'react';
import { version } from '~/package.json';

const HeadingText = () => {
  return (
    <>
      <h1 className="text-[2.5rem] font-bold">Spectrum</h1>
      <p>Software Version: {version}</p>
      <p>Developed by Implantable Biosensing Lab at ICORD</p>
    </>
  );
};

export default HeadingText;
