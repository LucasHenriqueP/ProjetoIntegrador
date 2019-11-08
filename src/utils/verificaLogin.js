import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";
import AsyncStorage from "@react-native-community/async-storage";

export async function pegaID() {
  try {
    const value = await AsyncStorage.getItem("@ID");
    return value;
  } catch (e) {
    // save error
  }
}

//async-storage
export async function verificaLogin() {
  // Firebase
  var user = false;
  auth().onAuthStateChanged(onAuthStateChanged);

  function onAuthStateChanged(fire) {
    if (fire) {
      user = fire;
      console.log("Logado Firebase");
      return fire;
    } else {
      return false;
    }
  }

  // Google
  GoogleSignin.isSignedIn().then(google => {
    if (google) {
      console.log("Logado Google");
      return google;
    } else {
      return false;
    }
  });
  console.log(user);
  return user;
  // TO-DO Facebook
}

export const isGoogle = async () => {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    return userInfo;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_REQUIRED) {
      console.log("erro1VL");
      return false;
    } else {
      console.log("erro2VL");
      return false;
      // some other error
    }
  }
};

export async function userVerified() {
  var user = auth().currentUser.emailVerified;
  if (user) {
    return true;
  }
  return false;
}
