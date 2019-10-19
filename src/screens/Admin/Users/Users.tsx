import firestore from "@react-native-firebase/firestore";
import React, { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  YellowBox
} from "react-native";
import { Overlay, Input } from "react-native-elements";
import { TextInputMask } from "react-native-masked-text";
import Loading from "../../../components/Loading";
import MLoading from "../../../components/ModalLoading";
import * as Service from "./Service";

// Melhor forma de se resolver uma warning, ignorando ela completamente =)
YellowBox.ignoreWarnings(["Warning: State updates"]);

const ref = firestore().collection("usuarios");

const Users = () => {
  const [ID, setID] = useState("");
  const [Nome, setNome] = useState("");
  const [Sobrenome, setSobrenome] = useState("");
  const [Celular, setCelular] = useState("");
  const [Email, setEmail] = useState("");
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [Users, setUsers] = useState([]); // Initial empty array of Users
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [ModalEditar, setModalEditar] = useState(false);
  const [ModalLoading, setModalLoading] = useState(false);

  function editaUser(item) {
    setID(item.id);
    setNome(item.nome);
    setSobrenome(item.sobrenome);
    setCelular(item.celular);
    setEmail(item.email);
    setModalEditar(true);
  }

  async function modifyUser() {
    setModalLoading(true);
    setModalEditar(false);
    await Service.modifyUser({ Nome, Sobrenome, Celular, Email, ID });
    setNome("");
    setSobrenome("");
    setCelular("");
    setEmail("");
    setModalLoading(false);
  }

  async function removeUser(item) {
    setModalLoading(true);

    await Service.removeUser(item);

    setModalLoading(false);
  }

  async function habilitar(ID) {
    setModalLoading(true);

    Service.habilita(ID);

    setModalLoading(false);
  }
  async function removerMesmo(item) {
    setModalLoading(true);

    Service.removerMesmo(item);

    setModalLoading(false);
  }

  function renderItem(item) {
    item = item.item;
    if (!item.disabled) {
      return (
        <View style={styles.UserContainer}>
          <View style={styles.row}>
            <Text style={styles.UserId}>ID: {item.id}</Text>
            <TouchableOpacity onPress={() => editaUser(item)}>
              <Text style={styles.editarButtonText}>Editar </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeUser(item)}>
              <Text style={styles.removerButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
          <Text>
            Nome: <Text style={styles.User}>{item.nome}</Text>
          </Text>
          <Text>
            Sobrenome: <Text style={styles.User}>{item.sobrenome}</Text>
          </Text>
          <Text>
            Celular: <Text style={styles.User}>{item.celular}</Text>
          </Text>
          <Text>
            Email: <Text style={styles.User}>{item.email}</Text>
          </Text>
          {item.disabled && (
            <Text>
              Desabilitado:{" "}
              <Text style={styles.User}>{item.disabled.toString()}</Text>
            </Text>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.UserContainerD}>
          <View style={styles.row}>
            <Text style={styles.UserId}>ID: {item.id}</Text>
            <TouchableOpacity onPress={() => habilitar(item.id)}>
              <Text style={styles.editarButtonText}>Habilitar </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removerMesmo(item)}>
              <Text style={styles.removerFRButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
          <Text>
            Nome: <Text style={styles.User}>{item.nome}</Text>
          </Text>
          <Text>
            Sobrenome: <Text style={styles.User}>{item.sobrenome}</Text>
          </Text>
          <Text>
            Celular: <Text style={styles.User}>{item.celular}</Text>
          </Text>
          <Text>
            Email: <Text style={styles.User}>{item.email}</Text>
          </Text>
          {item.disabled && (
            <Text>
              Desabilitado:{" "}
              <Text style={styles.User}>{item.disabled.toString()}</Text>
            </Text>
          )}
        </View>
      );
    }
  }

  async function addUser() {
    if (Service.verifica({ Nome, Sobrenome, Email, Celular })) {
      setModalLoading(true);
      Service.addUser({ Nome, Sobrenome, Email, Celular });
      setNome("");
      setSobrenome("");
      setCelular("");
      setEmail("");
      closeModalAdicionar();
      setModalLoading(false);
    }
  }

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { nome, sobrenome, celular, email, uid, disabled } = doc.data();
        list.push({
          id: doc.id,
          uid,
          nome,
          sobrenome,
          celular,
          email,
          disabled
        });
        // console.log(doc.data())
      });
      setUsers(list);
      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  const openModalAdicionar = () => {
    setModalAdicionar(true);
  };
  const closeModalAdicionar = () => {
    setModalAdicionar(false);
  };
  const closeModalEditar = () => {
    setModalEditar(false);
    setNome("");
    setSobrenome("");
    setCelular("");
    setEmail("");
  };

  return (
    <>
      <MLoading ModalLoading={ModalLoading} />
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.list}
          style={{ flex: 1 }}
          data={Users}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
        <Button onPress={openModalAdicionar} style={styles.criar}>
          Criar um Usuário
        </Button>
        <View>
          <Overlay
            isVisible={modalAdicionar}
            windowBackgroundColor="rgba(255, 255, 255, .95)"
            width="100%"
            onBackdropPress={closeModalAdicionar}
            height="auto"
          >
            <>
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
                label={"Celular"}
                type={"cel-phone"}
                value={Celular}
                onChangeText={setCelular}
                options={{
                  maskType: "BRL",
                  withDDD: true,
                  dddMask: "(99) "
                }}
                placeholder={"(xx)9xxxx-xxxx"}
                inputComponent={TextInputMask}
              />
              <Input
                label={"E-mail"}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCompleteType="email"
                value={Email}
                placeholder={"joao@dasilva.com"}
                onChangeText={setEmail}
              />
              <Button color="#202a31" onPress={() => addUser()}>
                Adicionar Usuário
              </Button>
            </>
          </Overlay>
          <Overlay
            isVisible={ModalEditar}
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            width="100%"
            onBackdropPress={closeModalEditar}
            height="auto"
          >
            <>
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
                label={"E-mail"}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCompleteType="email"
                value={Email}
                placeholder={"joao@dasilva.com"}
                onChangeText={setEmail}
              />
              <Button color="#202a31" onPress={() => modifyUser()}>
                Modificar Usuário
              </Button>
            </>
          </Overlay>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA"
  },
  list: {
    padding: 10
  },
  UserContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  UserContainerD: {
    backgroundColor: "#DDD",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  UserId: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  User: {
    fontSize: 16,
    color: "#999",
    marginTop: 5,
    lineHeight: 24
  },
  removerButtonText: {
    fontSize: 16,
    color: "#ff0000"
  },
  removerFRButtonText: {
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#ff0000"
  },
  editarButtonText: {
    fontSize: 16,
    color: "#202a31"
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
  },
  criar: {
    backgroundColor: "#f4f4f4",
    borderWidth: 4
  },
  containerModal: {},
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

export default Users;
