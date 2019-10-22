import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import Loading from "./Loading";

const MLoading = props => {
  return (
    props.ModalLoading?
    <View style={styles.load}>
      <Overlay
        isVisible={props.ModalLoading}
        windowBackgroundColor="rgba(255, 255, 255, 0)"
        width="auto"
        height="10%"
      >
        <Loading />
      </Overlay>
    </View>
    : null
  );
};
export default MLoading;

const styles = StyleSheet.create({
  load: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});
