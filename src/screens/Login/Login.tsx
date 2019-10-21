import React, { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import {
  View,
  StyleSheet,
  YellowBox,
  Text,
  KeyboardAvoidingView
} from "react-native";
import { Input } from "react-native-elements";
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  GoogleSignin,
  GoogleSigninButton
} from "@react-native-community/google-signin";

YellowBox.ignoreWarnings(["Warning: State updates"]);

import auth from "@react-native-firebase/auth";
import Loading from "../../components/Loading";
import MLoading from "../../components/ModalLoading";
import * as Service from "./Service";

const Login = ({ navigation }) => {
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [ModalLoading, setModalLoading] = useState(false);

  function loginGoogle() {
    return;
  }

  function loginFace() {
    return;
  }

  function onAuthStateChanged(user) {
    if (user) {
      navigation.navigate("Main");
    }
  }

  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, []);

  async function entrar() {
    if (!Email || !Senha) {
      showMessage({
        message: "Usuário ou Senha em branco!",
        type: "danger",
        icon: "danger",
        duration: 2500
      });
      return;
    }
    try {
      setModalLoading(true);
      await auth().signInWithEmailAndPassword(Email, Senha);

      setEmail("");
      setSenha("");
      navigation.navigate("Main");
    } catch (e) {
      Service.catchErros(e);
    }
    setModalLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={styles.container}>
      <MLoading ModalLoading={ModalLoading} />
      <View style={styles.contInput}>
        <Input
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
          inputContainerStyle={styles.input}
          style={styles.input}
          value={Email}
          onChangeText={setEmail}
          label={"    E-mail"}
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          placeholder={"email@endereco.com.br"}
        ></Input>
        <Input
          secureTextEntry={true}
          textContentType="password"
          autoCompleteType="password"
          autoCapitalize="none"
          inputContainerStyle={styles.input}
          value={Senha}
          onChangeText={setSenha}
          label={"    Senha"}
          leftIcon={{ type: "font-awesome", name: "lock" }}
          placeholder={"************"}
        ></Input>
        <Button
          style={styles.senha}
          icon="lock"
          color="#000"
          onPress={() => navigation.navigate("Senha")}
        >
          Esqueceu a senha?
        </Button>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        <Button style={styles.login} color="#000" onPress={() => entrar()}>
          Login
        </Button>
      </View>
      <GoogleSigninButton
        style={{ width: 312, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={loginGoogle}
        disabled={isSigninInProgress}
      />
      <Button
        style={styles.touch}
        color="#000"
        onPress={() => navigation.navigate("Registrar")}
        mode="text"
      >
        Ainda não é cadastrado? Registre-se
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignContent: "flex-start",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ddd"
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1
  },
  contInput: {
    width: "100%",
    height: "auto",
    marginBottom: 15
  },
  senha: {
    width: "auto",
    height: "auto",
    alignSelf: "flex-end"
  },
  login: {
    backgroundColor: "#7986CB",
    marginBottom: 10
  },
  touch: {
    bottom: 10,
    position: "absolute"
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  }
});

export default Login;
