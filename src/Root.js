import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import AppContainer from './containers/AppContainer';

const Root = () => {
  return (
    <BrowserRouter>
      <Route exact path="/:filterName?" component={AppContainer} />
      {/* <Route path="/:filterName" component={App} /> */}
    </BrowserRouter>
  );
};

export default Root;