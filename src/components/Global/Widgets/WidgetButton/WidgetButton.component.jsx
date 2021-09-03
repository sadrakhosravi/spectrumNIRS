import React from 'react';

const WidgetButton = props => {
  const { text } = props;

  return (
    <button className="text-white absolute bottom-5 right-5 bg-grey1 px-2 py-1 transition duration-100 hover:bg-light2 active:bg-accent">
      {text}
    </button>
  );
};

export default WidgetButton;
