import React, { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import { TextInputMask } from "react-native-masked-text";

import Loading from "../../components/Loading";
import * as Service from "./Service";
import { showMessage } from "react-native-flash-message";
import * as Login from "../../utils/verificaLogin"
import AsyncStorage from "@react-native-community/async-storage";

const Registrar = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [Nome, setNome] = useState("");
  const [Sobrenome, setSobrenome] = useState("");
  const [Celular, setCelular] = useState("");
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const [Google, setGoogle] = useState(false);

  useEffect(() => {
    if (navigation.getParam("givenName")) {
      setNome(navigation.getParam("givenName"));
      setEmail(navigation.getParam("email"));
      setSobrenome(navigation.getParam("familyName"));
      setGoogle(true);
      showMessage({
        message: "Complete o formulário acima",
        type: "warning",
        icon: "warning",
        duration: 2000
      });
    }
  }, []);

  async function registrar() {
    if (!Google) {
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
          await Service.criaUser({ ID, Email, Nome, Sobrenome, Celular });
          await Service.sendEmail();
          setNome("");
          setSobrenome("");
          setCelular("");
          setEmail("");
          setSenha("");
          await AsyncStorage.setItem("@ID", ID);
          setLoading(false);
          navigation.navigate("Main");
        } catch (e) {
          Service.catchErros(e);
        }
      }
    } else {
      const verifica = Service.verificaGoogle(Celular);
      if (verifica) {
        console.log("foi");

        setLoading(true);
        await Service.criaUser({
          ID: navigation.getParam("id"),
          Email,
          Nome,
          Sobrenome,
          Celular
        });

        setNome("");
        setSobrenome("");
        setCelular("");
        setEmail("");

        setLoading(false);
        navigation.navigate("Main");
      }
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
          disabled={Google}
          label={"Nome"}
          value={Nome}
          placeholder={"João"}
          onChangeText={setNome}
        />
        <Input
          disabled={Google}
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
          disabled={Google}
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
        {!Google && (
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
        )}
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
