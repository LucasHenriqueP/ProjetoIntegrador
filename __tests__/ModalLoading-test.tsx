/**
 * @format
 */

import "react-native";
import React from "react";
import App from "../src/components/ModalLoading";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

test("renders correctly", () => {
  const tree = renderer.create(<App ModalLoading={true} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("renders correctly", () => {
  renderer.create(<App ModalLoading={true} />);
});
