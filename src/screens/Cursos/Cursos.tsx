import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
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

const ref = Service.getRef();

const cursos = () => {
  //essa porra ta muito feia, certeza que to fazendo algo de errado
  const [ID, setID] = useState("");
  const [Curso, setCurso] = useState("");
  const [Preco, setPreco] = useState("R$0,00");
  const [Desc, setDesc] = useState("");
  const [Rat, setRating] = useState("");
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [Cursos, setCursos] = useState([]); // Initial empty array of Cursos
  const [ModalAdicionar, setModalAdicionar] = useState(false);
  const [ModalEditar, setModalEditar] = useState(false);
  const [ModalVer, setModalVer] = useState(false);
  const [ModalLoading, setModalLoading] = useState(false);
  const [Nome, setNome] = useState("");
  const [Sobrenome, setSobrenome] = useState("");
  const [Celular, setCelular] = useState("");
  const [Email, setEmail] = useState("");
  const [favs, setFavs] = useState([]);

  async function favoritaCurso(id) {
    setModalLoading(true);
    let arr = await Service.favoritaCurso(id, favs);
    setFavs(arr);
    setModalLoading(false);
  }

  async function unfavoritaCurso(id) {
    setModalLoading(true);
    let arr = await Service.unfavoritaCurso(id, favs);
    setFavs(arr);
    setModalLoading(false);
  }

  async function showCriador(criador) {
    setModalLoading(true);
    const doc = await Service.pegaCriador(criador);
    if (doc) {
      setModalVer(true);
      const { nome, sobrenome, celular, email } = doc;
      setNome(nome);
      setSobrenome(sobrenome);
      setCelular(celular);
      setEmail(email);
    } else {
      // doc.data() will be undefined in this case
      showMessage({
        message: "Ocorreu um erro:",
        description: "Criador Inexistente",
        type: "danger",
        duration: 2500
      });
    }
    setModalLoading(false);
  }

  function editaCurso(item) {
    setID(item.id);
    setCurso(item.nome);
    setDesc(item.descricao);
    setPreco(item.preco);
    setModalEditar(true);
  }

  async function modifyCurso() {
    setModalEditar(false);
    setModalLoading(true);
    const data = {
      ID: ID,
      Curso: Curso,
      Rat: Rat,
      Desc: Desc,
      Preco: Preco
    };
    Service.modifyCurso(data);
    setCurso("");
    setDesc("");
    setRating("");
    setID("");
    setPreco("R$0,00");
    setModalLoading(false);
  }

  function renderItem(item) {
    item = item.item;
    return (
      <View style={styles.cursoContainer}>
        <View style={styles.row}>
          <Text style={styles.cursoId}>Nome: {item.nome}</Text>

          {/* se não for o criador do curso */}
          {item.criador !== auth().currentUser.uid &&
            favs.indexOf(item.id) !== -1 && (
              <TouchableOpacity onPress={() => unfavoritaCurso(item.id)}>
                <Icon
                  style={styles.editarButtonText}
                  name="star"
                  type="font-awesome"
                />
              </TouchableOpacity>
            )}
          {item.criador !== auth().currentUser.uid &&
            favs.indexOf(item.id) == -1 && (
              <TouchableOpacity onPress={() => favoritaCurso(item.id)}>
                <Icon
                  style={styles.editarButtonText}
                  name="star-o"
                  type="font-awesome"
                />
              </TouchableOpacity>
            )}

          {/* se for o criador do curso */}
          {item.criador == auth().currentUser.uid && (
            <View style={styles.rowComponent}>
              <TouchableOpacity onPress={() => editaCurso(item)}>
                <Text style={styles.editarButtonText}>Editar </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Service.removeCurso(item)}>
                <Text style={styles.removerButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text>
          Id: <Text style={styles.curso}>{item.id}</Text>
        </Text>
        <Text>
          Descrição: <Text style={styles.curso}>{item.descricao}</Text>
        </Text>
        <Text>
          Preço: <Text style={styles.curso}>{item.preco}</Text>
        </Text>
        <Rating imageSize={20} readonly startingValue={parseInt(item.rating)} />
        <TouchableOpacity
          onPress={() => showCriador(item.criador)}
          style={styles.criadorButton}
        >
          <Text style={styles.criadorButtonText}>Criador</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
    setModalAdicionar(false);
    setModalLoading(false);
  }

  useEffect(() => {
    if (Preco == "R$0,00") {
      setPreco("Gratuito");
    }
  }, [Preco]);

  useEffect(() => {
    const user = auth().currentUser.uid;
    firestore()
      .collection("usuarios")
      .doc(user)
      .get()
      .then(function(doc) {
        const { favoritos } = doc.data();
        setFavs(favoritos.toString());
      });
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { nome, descricao, rating, criador, preco } = doc.data();
        list.push({
          id: doc.id,
          nome,
          descricao,
          rating,
          criador,
          preco
        });
      });
      setCursos(list);
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
  const closeModalVer = () => {
    setModalVer(false);
  };
  const closeModalEditar = () => {
    setModalEditar(false);
    setCurso("");
    setDesc("");
    setPreco("R$0,00");
  };

  return (
    <>
      <View style={styles.container}>
        <MLoading ModalLoading={ModalLoading} />

        <FlatList
          contentContainerStyle={styles.list}
          style={{ flex: 1 }}
          data={Cursos}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
        <Button onPress={openModalAdicionar} style={styles.criar}>
          Criar um curso
        </Button>
        <Overlay
          isVisible={ModalAdicionar}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          width="100%"
          onBackdropPress={closeModalAdicionar}
          height="auto"
        >
          <>
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
            <Button color="#202a31" onPress={() => modifyCurso()}>
              Modificar Curso
            </Button>
          </>
        </Overlay>
        <Overlay
          isVisible={ModalVer}
          windowBackgroundColor="rgba(255, 255, 255, 0.7)"
          width="100%"
          onBackdropPress={closeModalVer}
          height="auto"
        >
          <View>
            <Text>Nome: {Nome}</Text>
            <Text>Sobrenome: {Sobrenome}</Text>
            <Text>Email: {Email}</Text>
            <Text>Celular: {Celular}</Text>
            <TouchableOpacity style={styles.criadorButton}>
              <Text>Enviar Mensagem</Text>
            </TouchableOpacity>
          </View>
        </Overlay>
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
  cursoContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  cursoId: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  curso: {
    fontSize: 16,
    color: "#999",
    marginTop: 5,
    lineHeight: 24
  },
  criadorButton: {
    height: 42,
    borderWidth: 2,
    borderColor: "#202a31",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  criadorButtonText: {
    fontSize: 16,
    color: "#202a31",
    fontWeight: "bold"
  },
  removerButtonText: {
    fontSize: 16,
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
    borderWidth: 2
  },
  rowComponent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  }
});

export default cursos;
