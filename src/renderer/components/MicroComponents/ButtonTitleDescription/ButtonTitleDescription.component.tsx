import React from 'react';

interface Props {
  title: string;
  description: string | JSX.Element | JSX.Element[];
}

const ButtonTitleDescription = (props: Props) => {
  const { title, description } = props;
  return (
    <>
      <h3 className="font-bold">{title}</h3>

      <div className="text-base text-light">{description}</div>
    </>
  );
};

export default ButtonTitleDescription;
