import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
import { showMessage } from "react-native-flash-message";
import * as Login from "../../utils/verificaLogin";

const ref = firestore().collection("cursos");

export function getRef() {
  return ref;
}


export async function favoritaCurso(id, favs) {
    let user = await Login.pegaID();
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
    let user = await Login.pegaID();
    var arr = favs;
    arr.splice(favs.indexOf(id), 1);
    await firestore()
      .collection("usuarios")
      .doc(user)
      .update("favoritos", firestore.FieldValue.arrayRemove(id));
    return arr;
  }
  
  export async function increverse(cursoID) {
    var curso = {
      id: cursoID,
      dataInicio: firestore.Timestamp.now().toDate(),
      dataFim: null
    };
    let user = await Login.pegaID();
    firestore()
      .collection("usuarios")
      .doc(user)
      .update("historico", firestore.FieldValue.arrayUnion(curso));
  }

  export async function pegaCriador(criador) {
    var usuario: {};
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

  export async function desincreverse(cursoID) {
    let user = await Login.pegaID();
  
    await firestore()
      .collection("usuarios")
      .doc(user)
      .get()
      .then(async doc => {
        let { historico } = doc.data();
        let i = 0;
        historico.forEach(element => {
          if (element.id === cursoID) {
            historico = element;
            return;
          }
        });
        await firestore()
          .collection("usuarios")
          .doc(user)
          .update("historico", firestore.FieldValue.arrayRemove(historico));
      });
  }