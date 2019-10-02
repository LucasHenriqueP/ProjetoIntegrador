import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-paper';
import { Text, FlatList, View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Overlay, Input } from 'react-native-elements';
import Loading from './Loading';

const ref = firestore().collection('usuarios');

async function logaUsuario() {
  const querySnapshot = await ref.get();
  console.log('Usuários Totais:', querySnapshot.size);
  console.log('Documentos de Usuários', querySnapshot.docs);
}

function editaUser(item) {


}

function removeUser(item) {
  Alert.alert(
    'Remover User',
    "ID: " + item.id + "\n" + "Nome: " + item.nome + "\n" + "Sobrenome: " + item.Sobrenome +
    "\n" + "E-mail: " + item.email + "\n" + "Celular: " + item.celular,
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

const renderItem = ({ item }) => (

  <View style={styles.UserContainer}>
    <View style={styles.row}>
      <Text style={styles.UserId}>ID: {item.id}</Text>
      <TouchableOpacity onPress={() => editaUser(item)}>
        <Text style={styles.editarButtonText}>Editar {" "}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeUser(item)}>
        <Text style={styles.removerButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>

    <Text>
      Nome:{" "}
      <Text style={styles.User}>{item.nome}</Text>
    </Text>
    <Text>
      Sobrenome:{" "}
      <Text style={styles.User}>{item.sobrenome}
      </Text>
    </Text>
    <Text>
      Celular:{" "}
      <Text style={styles.User}>{item.celular}
      </Text>
    </Text>
    <Text>
      Email:{" "}
      <Text style={styles.User}>{item.email}
      </Text>
    </Text>
  </View>
)

const Users = () => {
  const [Nome, setNome] = useState('');
  const [Sobrenome, setSobrenome] = useState('');
  const [Celular, setCelular] = useState('');
  const [Email, setEmail] = useState('');
  const [loading, setLoading] = useState(true); // Set loading to true on component mount 
  const [Users, setUsers] = useState([]); // Initial empty array of Users
  const [modalAdicionar, setModalAdicionar] = useState(false);


  async function addUser() {
    if (Nome != '' && Sobrenome != '') {
      await ref.add({
        nome: Nome,
        sobrenome: Sobrenome,
        celular: Celular,
        email: Email,
      });
      setNome('');
      setSobrenome('');
      setCelular('');
      setEmail('');
      closeModalAdicionar();
    }
  }

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { nome, sobrenome, celular, email } = doc.data();
        list.push({
          id: doc.id,
          nome,
          sobrenome,
          celular,
          email
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
    return <Loading />
  }

  const openModalAdicionar = () => {
    setModalAdicionar(true);
  }
  const closeModalAdicionar = () => {
    setModalAdicionar(false);
  }

  return (
    <>
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.list}
          style={{ flex: 1 }}
          data={Users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
        <Button onPress={openModalAdicionar} style={styles.criar} >Criar um Usuário</Button>
        <View>
          <Overlay
            isVisible={modalAdicionar}
            windowBackgroundColor="rgba(255, 255, 255, .95)"
            width="100%"
            onBackdropPress={closeModalAdicionar}
            height="auto"
          >
            <>
              <Input label={'Nome'} value={Nome} placeholder={"João"} onChangeText={setNome} />
              <Input label={'Sobrenome'} value={Sobrenome} placeholder={"Da Silva"} onChangeText={setSobrenome} />
              <Input label={'Celular'} value={Celular} placeholder={"(xx)9xxxx-xxxx"} onChangeText={setCelular} />
              <Input label={'E-mail'} value={Email} placeholder={"joao@dasilva.com"} onChangeText={setEmail} />
              <Button color="#202a31" onPress={() => addUser()}>Adicionar Usuário</Button>
            </>
          </Overlay>
        </View>


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
  UserContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
    borderWidth: 4,
  },
  containerModal: {

  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

export default Users;
