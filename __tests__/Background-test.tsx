/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../src/pages/Background';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  renderer.create(<App />);
});

test('renders correctly', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
