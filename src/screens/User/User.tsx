import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { Overlay, Input, Rating, Icon, Divider, Button, Text } from "react-native-elements";
import Loading from "../../components/Loading";
import MLoading from "../../components/ModalLoading";
import { showMessage } from "react-native-flash-message";
import { TextInputMask } from "react-native-masked-text";
import * as Service from "./Service";
const ref = firestore().collection("usuarios");

const user = ()=>{
let [Nome, setNome] = useState('');
let [Sobrenome, setSobrenome] = useState('');
let [Celular, setCelular] = useState('');
let [Email, setEmail] = useState('');
let [IsEditable, setIsEditable] = useState(false);
useEffect(()=>{
let usuarioAtual = ref.doc(auth().currentUser.uid);
usuarioAtual.get().then(doc =>{
    const {nome, sobrenome, email, celular} = doc.data()
    setNome(nome);
    setSobrenome(sobrenome);
    setCelular(celular)
    setEmail(email)
})
}, [])



const changeEditable = () =>{
  setIsEditable(!IsEditable)
}

return(
    <View style = {styles.container}>
      <Text h2 style={styles.headerText}>  Informações do usuario</Text>
      <Input onChangeText = {(e) => setNome(e)} label= "Nome" value={Nome} disabled = {IsEditable} rightIcon={
        <Icon
        name = "edit"
        type = "material"
        onPress = {changeEditable}
        /> 
      } />
      <Input onChangeText = {(e) => setSobrenome(e)} label= "Sobrenome" value={Sobrenome} disabled = {IsEditable} rightIcon={
        <Icon
        name = "edit"
        type = "material"
        onPress = {changeEditable}
        /> 
      } />

      <Input onChangeText = {(e) => setCelular(e)} label= "Telefone" options={{
            maskType: "BRL",
            withDDD: true,
            dddMask: "(99) "
          }}  type={"cel-phone"} keyboardType="phone-pad" value={Celular} disabled = {IsEditable} rightIcon={
        <Icon
        name = "edit"
        type = "material"
        onPress = {changeEditable}
        /> 
      } />

      <Input label= "Email" value={Email} disabled = {true} />
      <Button title="Atualizar" disabled={IsEditable}/> 
      <View style={styles.containerBotao}>
      <Button buttonStyle={styles.botao} title="Ofertados"/>  
      <Button buttonStyle={styles.botao} title="Favoritos"/>
      </View>
    </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6b93b"
  },
  containerBotao: {
    flex: 1,
    flexDirection: "row"
  },
  botao:{
    marginLeft: "20%"
  },
  headerText: {
    textAlign: "center" 
  },
});

export default user