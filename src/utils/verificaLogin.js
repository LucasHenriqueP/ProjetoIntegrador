import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";

export default async function verificaLogin() {
  function onAuthStateChanged(user) {
    if (user) {
      return true;
    }
    return false;
  }

  var userGoogle = GoogleSignin.signInSilently().catch(error => {
    if (error.code === statusCodes.IN_PROGRESS) {
      return true;
    } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
      return false;
    }
  });

  var userFire = auth().onAuthStateChanged(onAuthStateChanged);
  if (userFire) return true;
  if (userGoogle) return true;

  // TO-DO Facebook
}
