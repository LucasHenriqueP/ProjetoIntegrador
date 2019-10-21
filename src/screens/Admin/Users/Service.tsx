import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { showMessage } from "react-native-flash-message";
const ref = firestore().collection("usuarios");

export async function logaUsuario() {
  const querySnapshot = await ref.get();
  console.log("Usuários Totais:", querySnapshot.size);
  console.log("Documentos de Usuários", querySnapshot.docs);
}

export async function removeUser(item) {
  const { id, nome, email, celular, sobrenome, uid } = item;
  Alert.alert(
    `Remover User UID: ${uid} ?`,
    `ID: ${id}\nNome: ${nome}\nSobrenome: ${sobrenome}\nE-mail: ${email}\nCelular: ${celular}`,
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      { text: "Remover", onPress: () => remove(item.id) }
    ],
    { cancelable: true }
  );

  async function remove(ID) {
    await ref.doc(ID).set(
      {
        disabled: true
      },
      { merge: true }
    );
  }
}

export async function modifyUser(data) {
  const { Nome, Sobrenome, Celular, ID, Email } = data;
  await ref.doc(ID).set(
    {
      nome: Nome,
      sobrenome: Sobrenome,
      celular: Celular,
      email: Email
    },
    { merge: true }
  );
}

export function verifica(data) {
  const { Email, Nome, Sobrenome, Celular } = data;
  if (!Email || !Nome || !Sobrenome || !Celular) {
    var campos = [];
    if (!Email) campos.push("Email");
    if (!Nome) campos.push("Nome");
    if (!Sobrenome) campos.push("Sobrenome");
    if (!Celular) campos.push("Celular");
    showMessage({
      message: "Erro, o(s) seguinte(s) campos são obrigatórios:",
      description: campos.toString(),
      type: "danger",
      icon: "danger",
      duration: 1500
    });
    return false;
  }
  if (Celular.toString().length != 15) {
    showMessage({
      message: "Erro, celular inválido",
      type: "danger",
      icon: "danger",
      duration: 1500
    });
    return false;
  }
  return true;
}

export async function addUser(data) {
  const { Nome, Sobrenome, Email, Celular } = data;
  await ref.add({
    nome: Nome,
    sobrenome: Sobrenome,
    celular: Celular,
    email: Email,
    cursosOferecidos: {},
    favoritos: {},
    historico: {}
  });
}

export async function habilita(ID) {
  await ref.doc(ID).set(
    {
      disabled: false
    },
    { merge: true }
  );
}

export async function removerMesmo(item) {
  const { id, nome, email, celular, sobrenome } = item;
  Alert.alert(
    `ATENÇÃO, quer remover MESMO o usuário?`,
    `ID: ${id}\nNome: ${nome}\nSobrenome: ${sobrenome}\nE-mail: ${email}\nCelular: ${celular}`,
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      { text: "Remover", onPress: () => confirma(item) }
    ],
    { cancelable: true }
  );

  async function confirma(item) {
    Alert.alert(
      `ATENÇÃO, ESSA AÇÃO NÃO PODE SER DESFEITA`,
      `Tem certeza mesmo do que está fazendo? \nTodos os cursos do usuário serão removidos!`,
      [
        {
          text: "Não remover",
          style: "cancel"
        },
        { text: "Remover", onPress: () => remove(item.id) }
      ],
      { cancelable: true }
    );
  }

  async function remove(ID) {
    await ref.doc(ID).delete();

    await firestore()
      .collection("cursos")
      .where("criador", "==", ID)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
        });
      });
    auth().currentUser.delete();
  }
}
