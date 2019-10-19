import auth from "@react-native-firebase/auth";
import { showMessage } from "react-native-flash-message";

export async function sendEmail() {
  try {
    await auth().currentUser.sendEmailVerification();
    showMessage({
      message: "Verifique o seu E-Mail e sua caixa de Spam",
      description: "Depois disso, é necessário relogar",
      type: "warning",
      icon: "warning",
      duration: 4500
    });
  } catch (error) {
    showMessage({
      message: "Um erro ocorreu",
      description: "Tente novamente mais tarde",
      type: "danger",
      icon: "danger",
      duration: 5000
    });
  }
}

export async function sair() {
  auth().signOut();
}
