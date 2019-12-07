import firestore from "@react-native-firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  YellowBox,
  Linking
} from "react-native";
import Loading from "../../components/Loading";

// Melhor forma de se resolver uma warning, ignorando ela completamente =)
YellowBox.ignoreWarnings(["Warning: State updates"]);

const ref = firestore().collection("usuarios");

const Users = ({ navigation }) => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [Users, setUsers] = useState([]); // Initial empty array of Users
  const [curso, setCurso] = useState("");
  const [usuarios, setUsuarios] = useState([""]);

  function renderItem(item) {
    item = item.item;
    if (usuarios) {
      let verifica = false;
      usuarios.forEach(valor => {
        if (item.id === valor) {
          verifica = true;
        }
      });
      if (!verifica) {
        return;
      }
    }
    return (
      <View style={styles.UserContainer}>
        <View style={styles.row}>
          <Text style={styles.UserId}>Nome: {item.nome}</Text>
        </View>
        <Text>
          Sobrenome: <Text style={styles.User}>{item.sobrenome}</Text>
        </Text>
        <Text>
          Celular: <Text style={styles.User}>{item.celular}</Text>
        </Text>
        <Text>
          Email: <Text style={styles.User}>{item.email}</Text>
        </Text>
        <TouchableOpacity
          style={styles.criadorButton}
          onPress={() =>
            Linking.openURL(
              `mailto:${item.email}?subject=Olá ${item.nome}! É o professor do "${curso}"&body=Olá, gostaria de conversar melhor contigo, por favor entre em contato comigo!`
            )
          }
        >
          <Text style={styles.criadorButtonText}>Mandar Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.criadorButton}
          onPress={() =>
            Linking.openURL(
              `whatsapp://send?text=Olá ${item.nome}, É o professor do "${curso}", gostaria de conversar melhor!&phone=+55${item.celular}`
            )
          }
        >
          <Text style={styles.criadorButtonText}>
            Mandar Mensagem no Whatsapp
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    // console.log(navigation.getParam("curso"));
    // console.log(navigation.getParam("usuarios"));
    setCurso(navigation.getParam("curso"));
    setUsuarios(navigation.getParam("usuarios"));
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
    return <Loading />;
  }

  return (
    <>
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.list}
          style={{ flex: 1 }}
          data={Users}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
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
  }
});

export default Users;
