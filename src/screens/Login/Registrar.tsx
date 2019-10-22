import React, { useState } from "react";
import { Button } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Input } from "react-native-elements";
import { TextInputMask } from "react-native-masked-text";

import Loading from "../../components/Loading";
import * as Service from "./Service";

const Registrar = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [Nome, setNome] = useState("");
  const [Sobrenome, setSobrenome] = useState("");
  const [Celular, setCelular] = useState("");
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");

  if (navigation.getParam("givenName")) {
    setNome(navigation.getParam("givenName"));
    setEmail(navigation.getParam("email"));
    setSobrenome(navigation.getParam("familyName"));
    console.log("entro");
  } else {
    console.log(navigation.getParam("givenName"));
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
      navigation.navigate("Main");
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        <Button
          color="#202a31"
          style={styles.login}
          onPress={() => registrar()}
        >
          Cadastrar
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: "#ddd"
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1
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
  },
  load: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Registrar;
