import React, { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import { View } from "react-native";
import { Input } from "react-native-elements";
import MLoading from "../../components/ModalLoading";
import { TextInputMask } from "react-native-masked-text";
import * as Service from "./Service";
import _ from "lodash";

const EditarP = ({ navigation }) => {
  const [ID, setID] = useState("");
  const [Curso, setCurso] = useState("");
  const [Preco, setPreco] = useState("R$0,00");
  const [Local, setLocal] = useState("");
  const [Desc, setDesc] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  async function modifyCurso() {
    setModalLoading(true);
    const data = {
      ID: ID,
      Curso: Curso,
      Desc: Desc,
      Preco: Preco,
      Local: Local
    };
    Service.modifyCurso(data);
    setModalLoading(false);
    navigation.goBack();
  }

  useEffect(() => {
    setModalLoading(true);
    setID(navigation.getParam("id"));
    setCurso(navigation.getParam("nome"));
    setDesc(navigation.getParam("descricao"));
    setPreco(navigation.getParam("preco"));
    setLocal(navigation.getParam("local"));
    setModalLoading(false);
  }, []);

  return (
    <View>
      <MLoading ModalLoading={modalLoading} />
      <Input label={"Nome"} value={Curso} onChangeText={setCurso} />
      <Input label={"Descrição"} value={Desc} onChangeText={setDesc} />
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
      <Button color="#202a31" onPress={() => modifyCurso()}>
        Modificar Curso
      </Button>
    </View>
  );
};

export default EditarP;
