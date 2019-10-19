import React, { useState } from "react";
import { Button } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  View,
  StyleSheet,
  YellowBox,
  Text,
  KeyboardAvoidingView
} from "react-native";
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
import MLoading from "../../components/ModalLoading";
import * as Service from "./Service";

const Login = () => {
  const [loading, setLoading] = useState(false);
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

  async function registrar() {
    const verifica = Service.verifica({
      Email,
      Senha,
      Nome,
      Sobrenome,
      Celular
    });

    if (verifica) {
      try {
        setLoading(true);
        setmodalCadastro(false);
        const userInfo = await Service.registraFirebase({ Email, Senha });

        const ID = userInfo.user.uid;
        Service.criaUser({ ID, Email, Nome, Sobrenome, Celular });

        setNome("");
        setSobrenome("");
        setCelular("");
        setEmail("");
        setSenha("");
      } catch (e) {
        Service.catchErros(e);
      }
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

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
    }
    setModalLoading(false);
    return;
  }

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
    } catch (e) {
      Service.catchErros(e);
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
    <KeyboardAvoidingView behavior="height" enabled style={styles.container}>
      <MLoading ModalLoading={ModalLoading} />
      <Overlay
        isVisible={modalCadastro}
        windowBackgroundColor="rgba(255, 255, 255, 0)"
        animationType="slide"
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
            placeholder={"(xx) 9xxxx-xxxx"}
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
          <Button color="#202a31" onPress={() => registrar()}>
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
          onPress={() => resetaSenha()}
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
        onPress={openmodalCadastro}
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
    bottom: 10,
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
