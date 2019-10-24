import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import { showMessage } from "react-native-flash-message";

const ref = firestore().collection("cursos");

export function getRef() {
  return ref;
}

export const logaCursos = async () => {
  const querySnapshot = await ref.get();
  console.log("Cursos Totais", querySnapshot.size);
  console.log("Documentos de Cursos", querySnapshot.docs);
};

export function removeCurso(item) {
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
          .doc(auth().currentUser.uid)
          .update("cursosOferecidos", firestore.FieldValue.arrayRemove(id));
      });
  }
}

export async function favoritaCurso(id, favs) {
  const user = auth().currentUser.uid;

  if (favs.indexOf(id) == -1) {
    await firestore()
      .collection("usuarios")
      .doc(user)
      // Caso for para deixar uma referência (não sei o que muda, mas ok né)
      //                   firestore.FieldValue.arrayUnion(firestore().doc(`cursos/${id}`)));
      // no banco vai ficar /cursos/id_aqui
      // acho que é pra pegar o caminho absoluto mais fácil ???
      .update("favoritos", firestore.FieldValue.arrayUnion(`${id}`));
    var arr = [].concat(favs);
    arr.push(id);
    return arr;
  }
}

export async function unfavoritaCurso(id, favs) {
  const user = auth().currentUser.uid;
  var arr = [].concat(favs);
  arr.splice(favs.indexOf(id), 1);
  await firestore()
    .collection("usuarios")
    .doc(user)
    .update("favoritos", firestore.FieldValue.arrayRemove(id));
  return arr;
}

export async function modifyCurso(data) {
  const { ID, Curso, Desc, Rat, Preco } = data;
  await ref.doc(ID).set(
    {
      nome: Curso,
      descricao: Desc,
      rating: parseInt(Rat),
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
  const user = auth().currentUser.uid;

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
