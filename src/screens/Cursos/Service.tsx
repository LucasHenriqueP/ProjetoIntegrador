import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
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
      { text: "Remover", onPress: () => ref.doc(item.id).delete() }
    ],
    { cancelable: true }
  );
}

export async function favoritaCurso(id, favs) {
  var user = auth().currentUser.uid;

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
  var user = auth().currentUser.uid;
  let arr = favs;
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
