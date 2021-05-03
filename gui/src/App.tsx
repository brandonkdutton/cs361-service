import React, { FC } from 'react';
import HomePage from './HomePage';

const App: FC = () => {

  enum transformations {
    saturate = "saturate",
    monochrome = "monochrome",
    brighten = "brighten",
    darken = "darken"
  };
  type error = { message: string; };
  type response = { imgUrl: string; };

  return (
    <HomePage />
  );
};

export default App;
