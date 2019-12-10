import firestore from "@react-native-firebase/firestore";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Input, Icon, Button, Text } from "react-native-elements";
import { TextInputMask } from "react-native-masked-text";
import * as Login from "../../utils/verificaLogin";
import { showMessage } from "react-native-flash-message";
import { Container, Header, Content, Tab, Tabs } from "native-base";
import * as Service from "./Service";
import Cursos from "../Cursos/Cursos";
import CursosPresenciais from "../CursosPresenciais/Cursos";
const ref = firestore().collection("usuarios");
const refCursos = firestore().collection("cursos");

const user = ({ navigation }) => {
  const [modalLoading, setModalLoading] = useState(false);
  const [Nome, setNome] = useState("");
  const [Sobrenome, setSobrenome] = useState("");
  const [Celular, setCelular] = useState("");
  const [Email, setEmail] = useState("");
  const [favs, setFavs] = useState([]);
  const [oferecidos, setOferecidos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [IsEditable, setIsEditable] = useState(true);
  const [ModalVer, setModalVer] = useState(false);
  const [cursosFavs, setCursosFavs] = useState([]);
  const [cursosHist, setCursosHist] = useState([]);
  useEffect(() => {
    Login.pegaID().then(user => {
      let usuarioAtual = ref.doc(user);
      usuarioAtual.get().then(doc => {
        // console.log(doc.data());

        const { nome, sobrenome, email, celular } = doc.data();
        setNome(nome);
        setSobrenome(sobrenome);
        setCelular(celular);
        setEmail(email);
        let { favoritos, historico, cursosOferecidos } = doc.data();
        // console.log(favoritos, historico);

        if (!favoritos) {
          favoritos = [];
        }
        if (!cursosOferecidos) {
          cursosOferecidos = [];
        }
        if (!historico) {
          historico = [];
        }
        var arr = [];
        historico.forEach(element => {
          arr.push(element.id);
        });
        setHistorico(arr);
        setFavs(favoritos);
        setOferecidos(cursosOferecidos);
      });
    });
    refCursos.onSnapshot(querySnapshot => {
      const listFav = [];
      const listHist = [];
      // console.log({ favs });

      querySnapshot.forEach(doc => {
        const {
          id,
          nome,
          descricao,
          rating,
          criador,
          preco,
          criadorNome
        } = doc.data();
        favs.forEach(f => console.log(f));
        if (favs.some(favoritos => favoritos.id == id)) {
          // console.log("Tem historico");

          listFav.push({
            id: doc.id,
            nome,
            descricao,
            rating,
            criador,
            preco,
            criadorNome
          });
        }
        if (historico.some(histo => histo.id == id)) {
          listHist.push({
            id: doc.id,
            nome,
            descricao,
            rating,
            criador,
            preco,
            criadorNome
          });
        }
      });
      setCursosFavs(listFav);
      setCursosHist(listHist);
      setModalLoading(false);
    });
  }, []);

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

  function inscreverse(cursoID) {
    setModalLoading(true);

    Service.increverse(cursoID).then(() => {
      setModalLoading(false);
      let hist = [].concat(historico).concat(cursoID);
      setHistorico(hist);
      return;
    });
  }

  function desinscreverse(cursoID) {
    setModalLoading(true);
    Service.desincreverse(cursoID).then(() => {
      let arr = historico;
      arr.splice(historico.indexOf(cursoID), 1);
      setHistorico(arr);
      setModalLoading(false);
      return;
    });
  }

  const changeEditable = () => {
    setIsEditable(!IsEditable);
  };

  const editarUsuario = () => {
    Login.pegaID().then(user => {
      let usuarioAtual = ref.doc(user);
      usuarioAtual.get().then(doc => {
        let dados = doc.data();
        dados.nome = Nome;
        dados.sobrenome = Sobrenome;
        dados.celular = Celular;
        usuarioAtual.set(dados).then(() => {
          showMessage({
            message: "Atualizado com sucesso!",
            type: "success",
            icon: "success",
            duration: 2500
          });
        });
      });
    });
  };

  function renderItem(item) {
    item = item.item;
    return (
      <View style={styles.cursoContainer}>
        <View style={styles.row}>
          <Text style={styles.cursoId}>Nome: {item.nome}</Text>

          {/* se não for o criador do curso */}
          {item.criador !== user && favs.indexOf(item.id) !== -1 && (
            <TouchableOpacity onPress={() => unfavoritaCurso(item.id)}>
              <Icon style={{ color: "red" }} name="star" type="font-awesome" />
            </TouchableOpacity>
          )}
          {item.criador !== user && favs.indexOf(item.id) == -1 && (
            <TouchableOpacity onPress={() => favoritaCurso(item.id)}>
              <Icon
                style={styles.editarButtonText}
                name="star-o"
                type="font-awesome"
              />
            </TouchableOpacity>
          )}

          {/* se for o criador do curso */}
        </View>
        <Text>
          Professor: <Text style={styles.curso}>{item.criadorNome}</Text>
        </Text>
        <Text>
          Descrição: <Text style={styles.curso}>{item.descricao}</Text>
        </Text>
        <Text>
          Preço: <Text style={styles.curso}>{item.preco}</Text>
        </Text>
        {/* <Rating imageSize={20} readonly startingValue={parseFloat(item.rating)} /> */}
        <TouchableOpacity
          onPress={() => showCriador(item.criador)}
          style={styles.criadorButton}
        >
          <Text style={styles.criadorButtonText}>Criador</Text>
        </TouchableOpacity>
        {item.criador !== user && historico.indexOf(item.id) == -1 && (
          <TouchableOpacity
            onPress={() => inscreverse(item.id)}
            style={styles.criadorButton}
          >
            <Text style={styles.criadorButtonText}>Quero este curso!</Text>
          </TouchableOpacity>
        )}
        {item.criador !== user && historico.indexOf(item.id) !== -1 && (
          <TouchableOpacity
            onPress={() => desinscreverse(item.id)}
            style={styles.criadorButton}
          >
            <Text style={styles.criadorButtonText}>
              Não quero mais este curso!
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <Container>
      <Tabs initialPage={0}>
        <Tab heading="Perfil">
          <View style={styles.container}>
            <Text h1 style={styles.headerText}>
              Informações do usuario
            </Text>
            <Input
              onChangeText={e => setNome(e)}
              label="Nome"
              value={Nome}
              disabled={IsEditable}
              rightIcon={
                <Icon name="edit" type="material" onPress={changeEditable} />
              }
            />
            <Input
              onChangeText={e => setSobrenome(e)}
              label="Sobrenome"
              value={Sobrenome}
              disabled={IsEditable}
              rightIcon={
                <Icon name="edit" type="material" onPress={changeEditable} />
              }
            />

            <Input
              onChangeText={e => setCelular(e)}
              label="Telefone"
              options={{
                maskType: "BRL",
                withDDD: true,
                dddMask: "(99) "
              }}
              type={"cel-phone"}
              keyboardType="phone-pad"
              value={Celular}
              inputComponent={TextInputMask}
              disabled={IsEditable}
              rightIcon={
                <Icon name="edit" type="material" onPress={changeEditable} />
              }
            />

            <Input label="Email" value={Email} disabled={true} />
            <Button
              buttonStyle={styles.botaoAtualizar}
              title="Atualizar"
              disabled={IsEditable}
              onPress={editarUsuario}
            />
          </View>
        </Tab>
        <Tabs heading="Histórico">
          <Tab heading="Online">
            <Cursos
              navigation={navigation}
              userCursos={historico}
              isCriador={false}
              isInscrito = {true}
            />
          </Tab>
          <Tab heading="Presenciais">
            <CursosPresenciais
              navigation={navigation}
              userCursos={historico}
              isCriador={false}
              isInscrito = {true}
            />
          </Tab>
        </Tabs>
        <Tabs heading="Favoritos">
          <Tab heading="Online">
            <Cursos
              navigation={navigation}
              userCursos={favs}
              isCriador={false}
            />
          </Tab>
          <Tab heading="Presenciais">
            <CursosPresenciais
              navigation={navigation}
              userCursos={favs}
              isCriador={false}
            />
          </Tab>
        </Tabs>
        <Tabs heading="Cursos Oferecidos">
          <Tab heading="Online">
            <Cursos
              navigation={navigation}
              userCursos={oferecidos}
              isCriador={true}
            />
          </Tab>
          <Tab heading="Presenciais">
            <CursosPresenciais
              navigation={navigation}
              userCursos={oferecidos}
              isCriador={true}
            />
          </Tab>
        </Tabs>
      </Tabs>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6b93b"
  },
  containerBotao: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20
  },
  botao: {
    marginLeft: "20%"
  },
  headerText: {
    textAlign: "center"
  },
  botaoAtualizar: {
    alignSelf: "center",
    width: "80%",
    marginTop: 5
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
  list: {
    padding: 10
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
  cursoContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  }
});

export default user;
