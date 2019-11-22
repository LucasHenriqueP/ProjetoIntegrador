import React, { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import { View } from "react-native";
import { Input } from "react-native-elements";
import MLoading from "../../components/ModalLoading";
import { TextInputMask } from "react-native-masked-text";
import { showMessage } from "react-native-flash-message";
import * as Service from "./Service";
import _ from "lodash";

const Registrar = ({ navigation }) => {
  const [Curso, setCurso] = useState("");
  const [Preco, setPreco] = useState("R$0,00");
  const [Desc, setDesc] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  async function addCurso() {
    if (Curso && Desc) {
      setModalLoading(true);
      Service.addCurso({ Curso, Desc, Preco });
      setCurso("");
      setDesc("");
      setPreco("R$0,00");
    } else {
      var campos = [];
      if (!Curso) campos.push("Sobrenome");
      if (!Desc) campos.push("Celular");
      showMessage({
        message: "Erro, o(s) seguinte(s) campos são obrigatórios:",
        description: campos.toString(),
        type: "danger",
        icon: "danger",
        duration: 1500
      });
      return;
    }
    setModalLoading(false);
    navigation.goBack();
  }

  return (
    <View>
      <MLoading ModalLoading={modalLoading} />
      <Input label={"Nome"} value={Curso} onChangeText={setCurso} />
      <Input label={"Descrição"} value={Desc} onChangeText={setDesc} />
      <Input
        label={"Preço"}
        type={"money"}
        options={{
          precision: 2,
          separator: ",",
          delimiter: ".",
          unit: "R$",
          suffixUnit: ""
        }}
        inputComponent={TextInputMask}
        value={Preco}
        onChangeText={setPreco}
      />
      <Button color="#202a31" onPress={() => addCurso()}>
        Adicionar Curso
      </Button>
    </View>
  );
};

export default Registrar;
