import firebase from '@react-native-firebase/app';

const androidConfig = {
    clientId: '832067946495-9vgi9uomr5pr2kh3fsjn1oi376a2nosm.apps.googleusercontent.com',
    appId: '1:832067946495:android:6b76f8c2aab78def5549ca',
    apiKey: 'AIzaSyCT_er0lwsUSyTdw_lAvCsxjX-roihgmMU',
    databaseURL: 'https://u-cursos.firebaseio.com',
    storageBucket: 'u-cursos.appspot.com',
    messagingSenderId: '832067946495',
    projectId: 'u-cursos',
    // enable persistence by adding the below flag
    persistence: true,
};

export default !firebase.apps.length ? firebase.initializeApp(androidConfig) : firebase.app();
