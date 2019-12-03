import React, { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import { View } from "react-native";
import { Input } from "react-native-elements";
import MLoading from "../../../components/ModalLoading";
import { TextInputMask } from "react-native-masked-text";
import { showMessage } from "react-native-flash-message";
import * as Service from "./Service";
import _ from "lodash";

const RegistrarP = ({ navigation }) => {
  const [Curso, setCurso] = useState("");
  const [Rating, setRating] = useState("");
  const [Preco, setPreco] = useState("R$0,00");
  const [Local, setLocal] = useState("");
  const [Desc, setDesc] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  async function addCurso() {
    if (Curso && Desc) {
      setModalLoading(true);
      Service.addCurso({ Curso, Desc, Preco, Local, Rating });
      setCurso("");
      setDesc("");
      setRating("");
      setPreco("R$0,00");
      setLocal("");
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
        label={"Avaliação"}
        keyboardType="numeric"
        value={Rating}
        onChangeText={setRating}
      />
      <Input label={"Localização"} value={Local} onChangeText={setLocal} />
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

export default RegistrarP;
