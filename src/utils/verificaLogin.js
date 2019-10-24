import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";

export async function verificaLogin() {
  auth().onAuthStateChanged(onAuthStateChanged);

  function onAuthStateChanged(user) {
    if (user) {
      console.log("1");
      return Promise.resolve();
    }
    console.log("2");
    return Promise.reject("erro");
  }

  await GoogleSignin.isSignedIn().then(user => {
    if (user) {
      console.log("3");
      return Promise.resolve();
    }
    console.log("4");
    return Promise.reject("erro");
  });

  // TO-DO Facebook
}

export async function userVerified() {
  var user = auth().currentUser.emailVerified;
  if (user) {
    return true;
  }
  return false;
}
