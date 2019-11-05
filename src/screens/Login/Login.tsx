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
  GoogleSigninButton,
  statusCodes
} from "@react-native-community/google-signin";
import AsyncStorage from "@react-native-community/async-storage";
import * as Verify from "../../utils/verificaLogin";

YellowBox.ignoreWarnings(["Warning: State updates"]);

import auth from "@react-native-firebase/auth";
import Loading from "../../components/Loading";
import firestore from "@react-native-firebase/firestore";
import MLoading from "../../components/ModalLoading";
import * as Service from "./Service";

const Login = ({ navigation }) => {
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [ModalLoading, setModalLoading] = useState(false);

  GoogleSignin.configure({
    webClientId:
      "832067946495-9vgi9uomr5pr2kh3fsjn1oi376a2nosm.apps.googleusercontent.com" // client ID of type WEB for your server (needed to verify user ID and offline access)
    //offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      GoogleSignin.getCurrentUser().then(async user => {
        // user.user.id
        const storeData = async () => {
          try {
            await AsyncStorage.setItem("@ID", user.user.id);
          } catch (e) {
            console.log("fudeu", e);
          }
        };
        const querySnapshot = await firestore()
          .collection("usuarios")
          .get();
        querySnapshot.forEach(doc => {
          if (doc.id == user.user.id) {
            navigation.navigate("Main");
            return;
          }
        });
        navigation.navigate("Registrar", userInfo.user);
      });
    } catch (error) {
      console.log(error);
    }
  };

  function loginFace() {
    return;
  }

  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      return userInfo;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        return false;
      } else {
        console.log("erro2");
        return false;
        // some other error
      }
    }
  };

  useEffect(() => {
    getCurrentUserInfo()
      .then(user => {
        if (user) {
          console.log(user);
          navigation.navigate("Main");
        }
      })
      .catch(() => {
        console.log("num foi2");
      });
    Verify.verificaLogin().then(user => {
      if (user) {
        navigation.navigate("Main");
      }
    });
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
        onPress={signIn}
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
