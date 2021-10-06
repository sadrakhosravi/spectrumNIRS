import React from 'react';
import { version } from '../../../../../package.json';

const HeadingText = () => {
  return (
    <>
      <h1 className="text-4xl font-bold">NIRS Software</h1>
      <p>Software Version: {version}</p>
      <p>Developed by Shadgan Lab at ICORD</p>
    </>
  );
};

export default HeadingText;
