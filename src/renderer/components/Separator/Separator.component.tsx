import React from 'react';

type SeparatorPros = {
  orientation: 'horizontal' | 'vertical';
  margin?: 'sm' | 'base' | 'lg' | 'xl';
};

const Separator = ({ orientation, margin = 'base' }: SeparatorPros) => {
  let marginStyle;

  switch (margin) {
    case 'sm':
      marginStyle = 'my-1';
      break;
    case 'base':
      marginStyle = 'my-2';
      break;
    case 'lg':
      marginStyle = 'my-4';
      break;
    case 'xl':
      marginStyle = 'my-6';
      break;
    default:
      marginStyle = 'my-2';
      break;
  }

  if (orientation === 'horizontal')
    return (
      <span className={`bg-white/20 w-full h-[1px] block ${marginStyle} `} />
    );
  if (orientation === 'vertical') return <span></span>;

  return null;
};

export default Separator;
