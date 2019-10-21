import React from "react";
import { View } from "react-native";
import FlashMessage from "react-native-flash-message";
import Routes from "./config/routes";
import "./config/StatusBarConfig";

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Routes />
        <FlashMessage position="bottom" />
      </View>
    );
  }
}
