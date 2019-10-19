import React, { Component } from "react";
import { StyleSheet, ImageBackground } from "react-native";

export default class BackgroundImage extends Component {
  render() {
    return (
      <ImageBackground
        blurRadius={1}
        source={require("../assets/background.jpg")}
        style={styles.backgroundImage}
      >
        {this.props.children}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null
  }
});
