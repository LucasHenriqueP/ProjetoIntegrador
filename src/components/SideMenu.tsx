import auth from "@react-native-firebase/auth";
import React from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-paper";
import IOSIcon from "react-native-vector-icons/Ionicons";
import { GoogleSignin } from "@react-native-community/google-signin";

const SideMenu = ({ navigation }) => {
  async function sair() {
    if (GoogleSignin.isSignedIn) {
      await GoogleSignin.signOut().then(() => {
        navigation.navigate("Landing");
      });
    } else {
      await auth().signOut();
      navigation.navigate("Landing");
    }
  }
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "#000", padding: 12.5 }}>
        <TouchableOpacity
          style={{ width: 30, marginLeft: 10 }}
          onPress={navigation.toggleDrawer}
        >
          <IOSIcon name="ios-menu" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          <View>
            <Button
              style={styles.navItemStyle}
              onPress={() => navigation.navigate("Main")}
            >
              Perfil
            </Button>
            <Button
              style={styles.navItemStyle}
              onPress={() => navigation.navigate("Cursos")}
            >
              Cursos
            </Button>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <Button onPress={() => sair()}>Sair</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navItemStyle: {
    marginBottom: 1,
    borderRadius: 5,
    borderColor: "red",
    borderWidth: 1,
    fontSize: 18,
    backgroundColor: "#ddd"
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  footerContainer: {
    backgroundColor: "lightgrey"
  }
});

export default SideMenu;
