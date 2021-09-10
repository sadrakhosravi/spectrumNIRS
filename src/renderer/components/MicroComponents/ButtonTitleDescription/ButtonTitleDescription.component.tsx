import React from 'react';

interface Props {
  title: string;
  description: string;
}

const ButtonTitleDescription = (props: Props) => {
  const { title, description } = props;
  return (
    <>
      <h3 className="font-bold">{title}</h3>
      <p className="text-base text-light">{description}</p>
    </>
  );
};

export default ButtonTitleDescription;
