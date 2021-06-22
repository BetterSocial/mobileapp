// /**
//  * @format
//  */

// import 'react-native';
// import React from 'react';
// import App from '../App';

// // Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   renderer.create(<App />);
// });

function sum(a, b) {
  return a + b;
}
it('renders correctly', () => {
  expect(sum(2, 1)).toBe(3);
});
