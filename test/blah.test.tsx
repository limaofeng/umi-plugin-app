import * as React from 'react';

import * as ReactDOM from 'react-dom';

import { Authorized } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Authorized authority="USER" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
