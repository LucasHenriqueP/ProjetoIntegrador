import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-paper';
import { Text, FlatList, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Overlay, Input, Rating } from 'react-native-elements';
import Loading from './Loading';

const ref = firestore().collection('cursos');

const logaCursos = async () => {
  const querySnapshot = await ref.get();
  console.log('Cursos Totais', querySnapshot.size);
  console.log('Documentos de Cursos', querySnapshot.docs);
}

function removeCurso(item) {
  const { nome, id, descricao, rating } = item;
  Alert.alert(
    'Remover Curso',
    `ID: ${id}\nNome: ${nome}\nDescrição: ${descricao}\nRating: ${rating}`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      { text: 'Remover', onPress: () => ref.doc(item.id).delete() },
    ],
    { cancelable: true },
  )
}

const cursos = () => {
  const [ID, setID] = useState('');
  const [Curso, setCurso] = useState('');
  const [Desc, setDesc] = useState('');
  const [Rat, setRating] = useState('');
  const [loading, setLoading] = useState(true); // Set loading to true on component mount 
  const [Cursos, setCursos] = useState([]); // Initial empty array of Cursos
  const [ModalAdicionar, setModalAdicionar] = useState(false);
  const [ModalEditar, setModalEditar] = useState(false);


  function editaCurso(item) {
    setID(item.id);
    setCurso(item.nome);
    setDesc(item.descricao);
    setRating(item.rating.toString());
    setModalEditar(true);

  }

  async function modifyCurso() {
    setModalEditar(false);
    await ref.doc(ID).set({
      nome: Curso,
      descricao: Desc,
      rating: parseInt(Rat)
    })
    setCurso('');
    setDesc('');
    setRating('');
    setID('')
  }

  function renderItem(item) {
    item = item.item;
    return (
      <View style={styles.cursoContainer}>
        <View style={styles.row}>
          <Text style={styles.cursoId}>Nome: {item.nome}</Text>
          <TouchableOpacity onPress={() => editaCurso(item)}>
            <Text style={styles.editarButtonText}>Editar {" "}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeCurso(item)}>
            <Text style={styles.removerButtonText}>Remover</Text>
          </TouchableOpacity>
        </View>

        <Text>
          Id:{" "}
          <Text style={styles.curso}>{item.id}</Text>
        </Text>
        <Text>
          Descrição:{" "}
          <Text style={styles.curso}>{item.descricao}</Text>
        </Text>
        <Rating
          imageSize={20}
          readonly
          startingValue={parseInt(item.rating)}
        />
        <TouchableOpacity style={styles.criadorButton}>
          <Text style={styles.criadorButtonText}>Criador</Text>
        </TouchableOpacity>
        {/* <Text>
{"\n"}
    </Text> */}
      </View>
    )
  }

  async function addCurso() {
    setModalAdicionar(false);
    if (Curso != '' && Desc != '') {
      await ref.add({
        nome: Curso,
        descricao: Desc,
        rating: 0
      });
      setCurso('');
      setDesc('');
    }
  }

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { nome, descricao, rating } = doc.data();
        list.push({
          id: doc.id,
          nome,
          descricao,
          rating
        });
        // console.log(doc.data())
      });
      setCursos(list);
      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <Loading />
  }

  const openModalAdicionar = () => {
    setModalAdicionar(true);
  }
  const closeModalAdicionar = () => {
    setModalAdicionar(false);
  }
  const closeModalEditar = () => {
    setModalEditar(false);
    setCurso('');
    setDesc('');
  }

  return (
    <>
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.list}
          style={{ flex: 1 }}
          data={Cursos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
        <Button onPress={openModalAdicionar} style={styles.criar} >Criar um curso</Button>
        <Overlay
          isVisible={ModalAdicionar}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          width="100%"
          onBackdropPress={closeModalAdicionar}
          height="auto"
        >
          <>
            <Input label={'Nome'} value={Curso} onChangeText={setCurso} />
            <Input label={'Descrição'} value={Desc} onChangeText={setDesc} />
            <Button color="#202a31" onPress={() => addCurso()}>Adicionar Curso</Button>
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
            <Input label={'Nome'} value={Curso} onChangeText={setCurso} />
            <Input label={'Descrição'} value={Desc} onChangeText={setDesc} />
            <Input label={'Rating'} keyboardType="numeric" value={Rat} onChangeText={setRating} />
            <Button color="#202a31" onPress={() => modifyCurso()}>Modificar Curso</Button>
          </>
        </Overlay>
      </View>
    </>
  );
}

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
    marginBottom: 10,
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
    fontWeight: "bold",
  },
  removerButtonText: {
    fontSize: 16,
    color: "#ff0000",
  },
  editarButtonText: {
    fontSize: 16,
    color: "#202a31",
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
    alignItems: "center",
  },
  criar: {
    backgroundColor: "#f4f4f4",
    borderWidth: 2,
  },
  textInputStyle: {

  }
});

export default cursos;
