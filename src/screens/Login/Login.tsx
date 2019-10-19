import firestore from "@react-native-firebase/firestore";
import React, { useState } from "react";
import { Button } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, StyleSheet, YellowBox, Text } from "react-native";
import { Overlay, Input } from "react-native-elements";
import { TextInputMask } from "react-native-masked-text";
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  GoogleSignin,
  GoogleSigninButton
} from "@react-native-community/google-signin";

YellowBox.ignoreWarnings(["Warning: State updates"]);

import auth from "@react-native-firebase/auth";
import Loading from "../../components/Loading";
// import { Container } from './styles';
const ref = firestore().collection("usuarios");

const Login = () => {
  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [Nome, setNome] = useState("");
  const [Sobrenome, setSobrenome] = useState("");
  const [Celular, setCelular] = useState("");
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [modalCadastro, setmodalCadastro] = useState(false);
  const [ModalLoading, setModalLoading] = useState(false);

  function loginGoogle() {
    return;
  }

  function loginFace() {
    return;
  }

  function catchErros(e) {
    if (e.code == "auth/email-already-in-use") {
      showMessage({
        message: "Erro, este E-mail já está em uso",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
    } else if (e.code == "auth/invalid-email") {
      showMessage({
        message: "Erro, E-mail inválido ou incorreto",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
    } else if (e.code == "auth/weak-password") {
      showMessage({
        message: "Erro, Senha deve ter pelo menos 6 caracteres",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
    } else if (e.code == "auth/user-not-found") {
      showMessage({
        message: "Erro, E-mail não cadastrado",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
    } else if (e.code == "auth/wrong-password") {
      showMessage({
        message: "Erro, Senha inválida",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
    } else {
      showMessage({
        message: "Tente novamente mais tarde",
        type: "danger",
        icon: "danger",
        duration: 2500
      });
      console.log(e);
    }
  }

  async function register(email, password, Nome, Sobrenome, Celular) {
    if (!email || !password || !Nome || !Sobrenome || !Celular) {
      var campos = [];
      if (!email) campos.push("Email");
      if (!password) campos.push("Senha");
      if (!Nome) campos.push("Nome");
      if (!Sobrenome) campos.push("Sobrenome");
      if (!Celular) campos.push("Celular");

      showMessage({
        message: "Erro, o(s) seguinte(s) campos são obrigatórios:",
        description: campos.toString(),
        type: "danger",
        icon: "danger",
        duration: 1500
      });
      return;
    }
    if (Celular.toString().length != 15) {
      showMessage({
        message: "Erro, celular inválido",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
      return;
    }
    try {
      const userInfo = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      setmodalCadastro(false);
      setLoading(true);

      await ref.doc(userInfo.user.uid).set({
        nome: Nome,
        sobrenome: Sobrenome,
        celular: Celular,
        email: email,
        cursosOferecidos: [],
        favoritos: [],
        historico: []
      });
      setNome("");
      setSobrenome("");
      setCelular("");
      setEmail("");
      setSenha("");
      auth().currentUser.sendEmailVerification();
    } catch (e) {
      catchErros(e);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  async function senha() {
    if (!Email) {
      showMessage({
        message: "Digite o seu E-mail acima",
        type: "danger",
        icon: "danger",
        duration: 2500
      });
      return;
    }
    try {
      setModalLoading(true);
      await auth().sendPasswordResetEmail(Email);
      showMessage({
        message: "Email enviado com sucesso!",
        type: "success",
        icon: "success",
        duration: 2500
      });
    } catch (e) {
      catchErros(e);
    }
    setModalLoading(false);
    return;
  }

  async function login() {
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
    } catch (e) {
      catchErros(e);
    }
    setModalLoading(false);
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
        style={styles.load}
        isVisible={ModalLoading}
        windowBackgroundColor="rgba(255, 255, 255, 0)"
        width="auto"
        height="10%"
      >
        <Loading />
      </Overlay>
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
            keyboardType="phone-pad"
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
          onPress={() => senha()}
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
        <Button style={styles.login} color="#000" onPress={() => login()}>
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
        color="#fff"
        onPress={openmodalCadastro}
        mode="text"
      >
        Ainda não é cadastrado? Registre-se
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 50,
    alignContent: "flex-start",
    justifyContent: "flex-start",
    alignItems: "center"
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
    marginBottom: 10
  },
  touch: {
    bottom: 50,
    position: "absolute"
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  load: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Login;
