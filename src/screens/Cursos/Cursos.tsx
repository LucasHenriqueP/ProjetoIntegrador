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
  Picker
} from "react-native";
import { Overlay, Input, Rating, Icon, SearchBar } from "react-native-elements";
import Loading from "../../components/Loading";
import MLoading from "../../components/ModalLoading";
import { showMessage } from "react-native-flash-message";
import { TextInputMask } from "react-native-masked-text";
import * as Service from "./Service";
import * as Login from "../../utils/verificaLogin";
import _ from "lodash";

const ref = Service.getRef();

const cursos = () => {
  //essa porra ta muito feia, certeza que to fazendo algo de errado
  const [ID, setID] = useState("");
  const [Curso, setCurso] = useState("");
  const [Preco, setPreco] = useState("R$0,00");
  const [Desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [Cursos, setCursos] = useState([]); // Initial empty array of Cursos
  const [ModalAdicionar, setModalAdicionar] = useState(false);
  const [ModalEditar, setModalEditar] = useState(false);
  const [ModalVer, setModalVer] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [Nome, setNome] = useState("");
  const [Sobrenome, setSobrenome] = useState("");
  const [Celular, setCelular] = useState("");
  const [Email, setEmail] = useState("");
  const [favs, setFavs] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [valor, setValor] = useState("");
  const [filtro, setFiltro] = useState("");
  const [listCursos, setListCursos] = useState([]);
  const [user, setUser] = useState("");

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
      Desc: Desc,
      Preco: Preco
    };
    Service.modifyCurso(data);
    setCurso("");
    setDesc("");
    setID("");
    setPreco("R$0,00");
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
          {item.criador == user && (
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
          Professor: <Text style={styles.curso}>{item.criadorNome}</Text>
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
    Login.pegaID().then(valor => {
      setUser(valor);
      setModalLoading(true);
      firestore()
        .collection("usuarios")
        .doc(valor)
        .get()
        .then(function(doc) {
          let { favoritos, historico } = doc.data();
          if (!favoritos) {
            favoritos = [];
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
          setModalLoading(false);
        });
    });
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {
          nome,
          descricao,
          rating,
          criador,
          preco,
          criadorNome
        } = doc.data();
        list.push({
          id: doc.id,
          nome,
          descricao,
          rating,
          criador,
          preco,
          criadorNome
        });
      });
      setCursos(list);
      setListCursos(list);
      if (loading) {
        setLoading(false);
      }
      setModalLoading(false);
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

  const pesquisa = texto => {
    setValor(texto);
    const formatado = texto.toLowerCase();
    var filtrado = _.filter(Cursos, dados => {
      if (
        dados.descricao.toLowerCase().includes(formatado) ||
        dados.nome.toLowerCase().includes(formatado) ||
        dados.criadorNome.toLowerCase().includes(formatado)
      ) {
        return true;
      }
      return false;
    });
    if (!texto) {
      setCursos(listCursos);
    } else {
      setCursos(filtrado);
    }
  };

  const filtragem = opcao => {
    setFiltro(opcao);
    var novoArray = [];

    switch (opcao) {
      case "fav":
        var favoritos = [];
        var naoFavoritos = [];
        _.filter(Cursos, dados => {
          if (favs.indexOf(dados.id) !== -1) {
            favoritos.push(dados);
          } else {
            naoFavoritos.push(dados);
          }
        });
        var result = [].concat(favoritos).concat(naoFavoritos);
        setCursos(result);
        break;
      case "precoB":
        novoArray = _.orderBy(Cursos, ["preco"], ["asc"]);
        break;
      case "preco":
        novoArray = _.orderBy(Cursos, ["preco"], ["desc"]);
        break;
      case "ratingB":
        novoArray = _.orderBy(Cursos, ["rating"], ["asc"]);
        break;
      case "rating":
        novoArray = _.orderBy(Cursos, ["rating"], ["desc"]); // Use Lodash to sort array by 'name'
        break;
      case "none":
        setCursos(listCursos);
        console.log(listCursos);
        break;
    }
    if (opcao != "fav" && opcao != "none") {
      setCursos(novoArray);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <MLoading ModalLoading={modalLoading} />

        <SearchBar
          placeholder="Buscar"
          lightTheme
          round
          onChangeText={pesquisa}
          autoCorrect={false}
          value={valor}
        />
        <Picker
          selectedValue={filtro}
          style={styles.dropdown}
          onValueChange={(itemValue, itemIndex) => filtragem(itemValue)}
        >
          <Picker.Item label="Ordenar por..." value="none" />
          <Picker.Item label="Favoritos" value="fav" />
          <Picker.Item label="Menor Preço" value="precoB" />
          <Picker.Item label="Maior Preço" value="preco" />
          <Picker.Item label="Menor Avaliação" value="ratingB" />
          <Picker.Item label="Maior Avaliação" value="rating" />
        </Picker>

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
  dropdown: {
    width: "auto"
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
  iconStar: {
    color: "#ffff1c"
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
