import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import React, { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { Overlay, Input, Rating, Icon } from "react-native-elements";
import Loading from "../../components/Loading";
import MLoading from "../../components/ModalLoading";
import { showMessage } from "react-native-flash-message";
import { TextInputMask } from "react-native-masked-text";
import * as Service from "./Service";
const ref = firestore().collection("usuarios");

const user = ()=>{
let [Usuario, setUsuario] = useState({});
useEffect(()=>{
let usuarioAtual = ref.doc(auth().currentUser.uid);
usuarioAtual.get().then(doc =>{
    setUsuario(doc.data());

})
}, [])

console.log(Usuario);



return(
    <View>
      <Text>  Informações do usuario</Text>

      <Text>  Email: {Usuario.email? Usuario.email : ""}</Text>
      <Text>  Telefone: {Usuario.celular? Usuario.celular : ""}</Text>
    </View>
)
}
export default user