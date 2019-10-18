import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Background from "./Background";
import Login from "./Login";
import auth from "@react-native-firebase/auth";
import Loading from "./Loading";
import { showMessage } from "react-native-flash-message";
import { Overlay } from "react-native-elements";

const Page1 = ({ navigation }) => {
  // Set an loading state whilst Firebase connects
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);
  const [email, setEmail] = useState(false);
  const [ModalLoading, setModalLoading] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (loading) setLoading(false);
    if (user && auth().currentUser.emailVerified) {
      showMessage({
        message: "Autenticado com sucesso!",
        type: "success",
        icon: "success",
        duration: 2000
      });
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    if (user && !auth().currentUser.emailVerified && !email) {
      showMessage({
        message: "Não esqueça de verificar o seu email!",
        description: "Depois disso, é necessário relogar",
        type: "warning",
        icon: "warning",
        duration: 4500
      });
    }
    return subscriber;
  }, []);

  if (loading) return <Loading />;

  if (!user) {
    return (
      <Background
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Login />
      </Background>
    );
  }

  async function sendEmail() {
    setEmail(true);
    setModalLoading(true);
    try {
      await auth().currentUser.sendEmailVerification();
      showMessage({
        message: "Verifique o seu E-Mail e sua caixa de Spam",
        description: "Depois disso, é necessário relogar",
        type: "warning",
        icon: "warning",
        duration: 4500
      });
    } catch (error) {
      showMessage({
        message: "Um erro ocorreu",
        description: "Tente novamente mais tarde",
        type: "danger",
        icon: "danger",
        duration: 5000
      });
    }
    setModalLoading(false);
  }

  return (
    <Background>
      <Overlay
        style={styles.load}
        isVisible={ModalLoading}
        windowBackgroundColor="rgba(255, 255, 255, 0)"
        width="auto"
        height="10%"
      >
        <Loading />
      </Overlay>
      <View style={styles.auth}>
        {!auth().currentUser.emailVerified && (
          <View style={styles.topcenter}>
            <Text>Enviamos um link de ativação para o seu e-mail</Text>
            <TouchableOpacity onPress={() => sendEmail()} style={styles.touch}>
              <Text style={{ fontWeight: "bold" }}>
                {} Não o recebeu? Clique aqui! {}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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

const styles = StyleSheet.create({
  auth: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  topcenter: {
    position: "absolute",
    alignItems: "center",
    top: 0,
    width: "100%",
    backgroundColor: "#dfc24a"
  },
  touch: {
    height: 42,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#202a31",
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    marginBottom: 5
  },
  load: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Page1;
