import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
import { showMessage } from "react-native-flash-message";
import * as Login from "../../../utils/verificaLogin";

const ref = firestore().collection("cursos");

export function getRef() {
  return ref;
}

export const logaCursos = async () => {
  const querySnapshot = await ref.get();
  console.log("Cursos Totais", querySnapshot.size);
  console.log("Documentos de Cursos", querySnapshot.docs);
};

export async function removeCurso(item) {
  let user = await Login.pegaID();
  const { nome, id, descricao, rating } = item;
  Alert.alert(
    "Remover Curso",
    `ID: ${id}\nNome: ${nome}\nDescrição: ${descricao}\nRating: ${rating}`,
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      { text: "Remover", onPress: () => remove() }
    ],
    { cancelable: true }
  );
  function remove() {
    ref
      .doc(item.id)
      .delete()
      .then(() => {
        firestore()
          .collection("usuarios")
          .doc(user)
          .update("cursosOferecidos", firestore.FieldValue.arrayRemove(id));
      });
  }
}

export async function modifyCurso(data) {
  const { ID, Curso, Desc, Rat, Preco } = data;
  await ref.doc(ID).set(
    {
      nome: Curso,
      descricao: Desc,
      rating: parseFloat(Rat),
      preco: Preco
    },
    { merge: true }
  );
}

export async function pegaCriador(criador) {
  var usuario: { [key: string]: any };
  await firestore()
    .collection("usuarios")
    .doc(criador)
    .get()
    .then(async function(doc) {
      if (doc.exists) {
        usuario = doc.data();
      }
    })
    .catch(function(error) {
      showMessage({
        message: "Ocorreu um erro:",
        description: error,
        type: "danger",
        duration: 2500
      });
    });
  return usuario;
}

export async function addCurso(data) {
  let user = await Login.pegaID();
  const { Curso, Desc, Preco } = data;
  await ref
    .add({
      nome: Curso,
      descricao: Desc,
      rating: 0,
      preco: Preco,
      criador: user
    })
    .then(function(doc) {
      firestore()
        .collection("usuarios")
        .doc(user)
        .update("cursosOferecidos", firestore.FieldValue.arrayUnion(doc.id));
    });
}
