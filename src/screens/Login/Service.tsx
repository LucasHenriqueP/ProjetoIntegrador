import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { showMessage } from "react-native-flash-message";
const ref = firestore().collection("usuarios");

export function catchErros(e) {
  switch (e.code) {
    case "auth/email-already-in-use":
      showMessage({
        message: "Erro, este E-mail já está em uso",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
      break;
    case "auth/invalid-email":
      showMessage({
        message: "Erro, E-mail inválido ou incorreto",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
      break;
    case "auth/weak-password":
      showMessage({
        message: "Erro, Senha deve ter pelo menos 6 caracteres",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
      break;
    case "auth/user-not-found":
      showMessage({
        message: "Erro, E-mail não cadastrado",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
      break;
    case "auth/wrong-password":
      showMessage({
        message: "Erro, Senha inválida",
        type: "danger",
        icon: "danger",
        duration: 1500
      });
      break;

    default:
      showMessage({
        message: "Tente novamente mais tarde",
        type: "danger",
        icon: "danger",
        duration: 2500
      });
      console.log(e);
      break;
  }
}

export function verificaGoogle(Celular) {
  if (!Celular) {
    showMessage({
      message: "Erro, O número de celular é obrigatório:",
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

export function verifica(data) {
  const { Email, Senha, Nome, Sobrenome, Celular } = data;
  if (!Email || !Senha || !Nome || !Sobrenome || !Celular) {
    var campos = [];
    if (!Email) campos.push("Email");
    if (!Senha) campos.push("Senha");
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
  if (Senha.toString().length < 6) {
    showMessage({
      message: "Erro, Senha deve ter pelo menos 6 caracteres",
      type: "danger",
      icon: "danger",
      duration: 1500
    });
    return false;
  }
  return true;
}

export async function registraFirebase(data) {
  const { Email, Senha } = data;
  if (!Email || !Senha) {
    return;
  }

  var userInfo = await auth()
    .createUserWithEmailAndPassword(Email, Senha)
    .catch(e => {
      throw e;
    });
  return userInfo;
}

export async function criaUser(data) {
  const { Email, ID, Nome, Sobrenome, Celular } = data;

  await ref
    .doc(ID)
    .set({
      nome: Nome,
      sobrenome: Sobrenome,
      celular: Celular,
      email: Email,
      cursosOferecidos: [],
      favoritos: [],
      historico: []
    })
    .catch(e => {
      throw e;
    });
}

export async function sendEmail() {
  auth()
    .currentUser.sendEmailVerification()
    .catch(e => {
      throw e;
    });
}
