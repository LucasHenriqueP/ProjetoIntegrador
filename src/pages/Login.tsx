import firestore from "@react-native-firebase/firestore";
import React, { useState } from "react";
import { Button } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, StyleSheet, YellowBox, Text } from "react-native";
import { Overlay, Input } from "react-native-elements";
import { TextInputMask } from "react-native-masked-text";
import { showMessage, hideMessage } from "react-native-flash-message";

YellowBox.ignoreWarnings(["Warning: State updates"]);

import auth from "@react-native-firebase/auth";
import Loading from "./Loading";
// import { Container } from './styles';
const ref = firestore().collection("usuarios");

const Login = () => {
  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [Nome, setNome] = useState("");
  const [Sobrenome, setSobrenome] = useState("");
  const [Celular, setCelular] = useState("");
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const [modalCadastro, setmodalCadastro] = useState(false);

  async function register(email, password, Nome, Sobrenome, Celular) {
    setLoading(true);
    try {
      setmodalCadastro(false);
      const userInfo = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      await ref.doc(userInfo.user.uid).set({
        uid: userInfo.user.uid,
        nome: Nome,
        sobrenome: Sobrenome,
        celular: Celular,
        email: email
      });
      setNome("");
      setSobrenome("");
      setCelular("");
      setEmail("");
      setSenha("");
      auth().currentUser.sendEmailVerification();
      setLoading(false);
    } catch (e) {
      console.error(e.message);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  async function login() {
    if (Email == "" || Senha == "") {
      showMessage({
        message: "Usuário ou Senha em branco!",
        type: "danger",
        icon: "danger",
        duration: 2500
      });
      return;
    }
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(Email, Senha);
      setEmail("");
      setSenha("");
      setLoading(false);
    } catch (e) {
      console.error(e.message);
    }
  }
  const openmodalCadastro = () => {
    setmodalCadastro(true);
  };
  const closemodalCadastro = () => {
    setmodalCadastro(false);
  };

  return (
    <View style={styles.container}>
      <Overlay
        isVisible={modalCadastro}
        windowBackgroundColor="rgba(255, 255, 255, 0)"
        width="100%"
        onBackdropPress={closemodalCadastro}
        height="auto"
      >
        <KeyboardAwareScrollView>
          <Input
            label={"Nome"}
            value={Nome}
            placeholder={"João"}
            onChangeText={setNome}
          />
          <Input
            label={"Sobrenome"}
            value={Sobrenome}
            placeholder={"Da Silva"}
            onChangeText={setSobrenome}
          />
          <Input
            label={"Celular"}
            type={"cel-phone"}
            options={{
              maskType: "BRL",
              withDDD: true,
              dddMask: "(99) "
            }}
            value={Celular}
            onChangeText={setCelular}
            placeholder={"(xx)9xxxx-xxxx"}
            inputComponent={TextInputMask}
          />
          <Input
            keyboardType="email-address"
            autoCapitalize="none"
            autoCompleteType="email"
            inputContainerStyle={styles.input}
            style={styles.input}
            value={Email}
            onChangeText={setEmail}
            label={"E-mail"}
            leftIcon={{ type: "font-awesome", name: "envelope" }}
            placeholder={"email@endereco.com"}
          />
          <Input
            secureTextEntry={true}
            textContentType="password"
            autoCompleteType="password"
            autoCapitalize="none"
            inputContainerStyle={styles.input2}
            value={Senha}
            onChangeText={setSenha}
            label={"Senha"}
            leftIcon={{ type: "font-awesome", name: "lock" }}
            placeholder={"senha"}
          />
          <Button
            color="#202a31"
            onPress={() => register(Email, Senha, Nome, Sobrenome, Celular)}
          >
            Cadastrar
          </Button>
        </KeyboardAwareScrollView>
      </Overlay>
      <View style={styles.input}>
        <Input
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
          inputContainerStyle={styles.input}
          style={styles.input}
          value={Email}
          onChangeText={setEmail}
          label={"E-mail"}
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          placeholder={"email@endereco.com.br"}
        ></Input>
        <Input
          secureTextEntry={true}
          textContentType="password"
          autoCompleteType="password"
          autoCapitalize="none"
          inputContainerStyle={styles.input2}
          value={Senha}
          onChangeText={setSenha}
          label={"Senha"}
          leftIcon={{ type: "font-awesome", name: "lock" }}
          placeholder={"senha"}
        ></Input>
      </View>
      <Button style={styles.button} color="#000" onPress={() => login()}>
        Login
      </Button>
      <Button style={styles.touch} onPress={openmodalCadastro} mode="contained">
        Ainda não é cadastrado? Registre-se
      </Button>
      {/* <Text>Ou faça login como uma das opções abaixo</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    backgroundColor: "#ffffff",
    width: "100%",
    height: "auto"
  },
  input2: {
    backgroundColor: "#ffffff",
    width: "100%",
    height: "auto",
    marginBottom: 15
  },
  button: {
    backgroundColor: "#7986CB",
    marginTop: 10
  },
  touch: {
    margin: 10,
    backgroundColor: "#1DE9B6"
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  }
});

export default Login;
