import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import IOSIcon from "react-native-vector-icons/Ionicons";
import { GoogleSignin } from "@react-native-community/google-signin";
import AsyncStorage from "@react-native-community/async-storage";

const ref = firestore().collection("admins");

const SideMenu = ({ navigation }) => {
  const [showADM, setShowADM] = useState(false);

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { id } = doc.data();
        AsyncStorage.getItem("@ID").then(item => {
          if (id == item) {
            setShowADM(true);
          }
        });
      });
    });
  }, []);

  async function sair() {
    try {
      await AsyncStorage.removeItem("@ID");
      if (auth().currentUser) {
        await auth().signOut();
        navigation.navigate("Landing");
        console.log("Saiu Firebase");
      }
      if (GoogleSignin.isSignedIn) {
        await GoogleSignin.signOut();
        navigation.navigate("Landing");
        console.log("Saiu Google");
      }
    } catch (e) {
      console.log("fudeu", e);
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
              onPress={() => navigation.navigate("User")}
            >
              Perfil
            </Button>
            <Button
              style={styles.navItemStyle}
              onPress={() => navigation.navigate("Cursos")}
            >
              Cursos Online
            </Button>
            <Button
              style={styles.navItemStyle}
              onPress={() => navigation.navigate("CursosP")}
            >
              Cursos Presenciais
            </Button>
            {showADM === true && (
              <>
                <Button
                  style={styles.navItemStyle}
                  onPress={() => navigation.navigate("CursosADM")}
                >
                  CursosADM
                </Button>

                <Button
                  style={styles.navItemStyle}
                  onPress={() => navigation.navigate("CursosPADM")}
                >
                  CursosPresenciaisADM
                </Button>

                <Button
                  style={styles.navItemStyle}
                  onPress={() => navigation.navigate("UsersADM")}
                >
                  UsuáriosADM
                </Button>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <Button onPress={async () => await sair()}>Sair</Button>
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
