import React, { useState } from "react";
import { Button } from "react-native-paper";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Input } from "react-native-elements";
import { showMessage } from "react-native-flash-message";

import auth from "@react-native-firebase/auth";
import MLoading from "../../components/ModalLoading";
import * as Service from "./Service";

const Login = ({ navigation }) => {
  const [Email, setEmail] = useState("");
  const [ModalLoading, setModalLoading] = useState(false);

  async function resetaSenha() {
    if (!Email) {
      showMessage({
        message: "Digite o seu E-mail acima",
        type: "danger",
        icon: "danger",
        duration: 2500
      });
      return;
    }
    // usar try-catch não seria a melhor opção aqui, mas com .catch() não tava funcionando direito
    try {
      setModalLoading(true);
      auth().sendPasswordResetEmail(Email);
      showMessage({
        message: "Email enviado com sucesso!",
        type: "success",
        icon: "success",
        duration: 2500
      });
    } catch (e) {
      Service.catchErros(e);
      return;
    }
    setModalLoading(false);
    navigation.goBack();
    return;
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

        <Button style={styles.login} color="#000" onPress={() => resetaSenha()}>
          Enviar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
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
  button: {
    backgroundColor: "#7986CB",
    marginTop: 10
  },
  senha: {
    width: "auto",
    height: "auto",
    alignSelf: "flex-end"
  },
  login: {
    backgroundColor: "#7986CB",
    marginTop: 10,
    alignSelf: "center"
  }
});

export default Login;
