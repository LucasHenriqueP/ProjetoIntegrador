import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import Background from "./Background";
import Login from "./Login";
import auth from "@react-native-firebase/auth";
import Loading from "./Loading";
import { showMessage } from "react-native-flash-message";

const Page1 = ({ navigation }) => {
  // Set an loading state whilst Firebase connects
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (loading) setLoading(false);
    if (user !== null) {
      showMessage({
        message: "Autenticado com sucesso!",
        type: "success",
        icon: "success",
        duration: 2500
      });
    }
    // console.log(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (loading) return <Loading />;

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Login />
      </View>
    );
  }

  if (!auth().currentUser.emailVerified) {
    showMessage({
      message: "Não esqueça de verificar o seu email!",
      description: "Depois disso, é necessário relogar",
      type: "warning",
      icon: "warning",
      duration: 3500
    });
  }

  return (
    <Background>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          style={{ marginBottom: 10 }}
          mode="contained"
          onPress={() => navigation.navigate("Cursos")}
        >
          Cursos
        </Button>
        <Button
          style={{ margin: 5 }}
          mode="contained"
          onPress={() => navigation.navigate("Users")}
        >
          Usuários
        </Button>
        <Button onPress={() => auth().signOut()}>Sair</Button>
      </View>
    </Background>
  );
};

export default Page1;
