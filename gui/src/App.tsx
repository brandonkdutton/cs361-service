import React, { FC } from 'react';
import HomePage from './HomePage';
import LandingPage from './pages/LandingPage';
import TransformationPage from './pages/TransformPage';
import DarkModeWrapper from './components/DarkModeWrapper';
import SnackbarWrapper from './alerts/SnackbarWrapper';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

const App: FC = () => {
  return (
    <DarkModeWrapper>
      <SnackbarWrapper>
        <BrowserRouter>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/transformer" component={TransformationPage} />
          <Route exact path="/old" component={HomePage} />
        </BrowserRouter>
      </SnackbarWrapper>
    </DarkModeWrapper>
  );
};

export default App;
