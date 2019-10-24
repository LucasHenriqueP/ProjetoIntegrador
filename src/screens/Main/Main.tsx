import auth from "@react-native-firebase/auth";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { showMessage } from "react-native-flash-message";

import Background from "../../components/Background";
import Login from "../Login/Login";
import Loading from "../../components/Loading";
import MLoading from "../../components/ModalLoading";
import * as Service from "./Service";
import * as Verify from "../../utils/verificaLogin";

const Page1 = ({ navigation }) => {
  // Set an loading state whilst Firebase connects
  const [loading, setLoading] = useState(true);
  //transferir para service e verificar, mudar toda a estrutura
  const [user, setUser] = useState(false);
  const [Google, setGoogle] = useState(false);
  const [email, setEmail] = useState(false);
  const [ModalLoading, setModalLoading] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (loading) setLoading(false);
    if (user && Verify.userVerified()) {
      showMessage({
        message: "Autenticado com sucesso!",
        type: "success",
        icon: "success",
        duration: 2000
      });
    }
  }

  useEffect(() => {
    var subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    if (user && !Verify.userVerified() && !email && !Google) {
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

  if (!Verify.verificaLogin()) {
    return <Login navigation={navigation} />;
  }

  async function sendEmail() {
    setEmail(true);
    setModalLoading(true);
    Service.sendEmail();
    setModalLoading(false);
  }

  return (
    <Background>
      <MLoading ModalLoading={ModalLoading} />
      <View style={styles.auth}>
        {user && !auth().currentUser.emailVerified && (
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

        <Button
          style={{ margin: 5 }}
          mode="contained"
          onPress={() => navigation.navigate("CursosADM")}
        >
          CursosADM
        </Button>

        <Button
          style={{ margin: 5 }}
          mode="contained"
          onPress={() => navigation.navigate("UsersADM")}
        >
          UsuáriosADM
        </Button>
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
