import firestore from '@react-native-firebase/firestore';


const logaUsuarios = async () => {
    const querySnapshot = await firestore()
      .collection('usuarios')
      .get();
    console.log('Usuários Totais:', querySnapshot.size);
    console.log('Documentos de Usuários', querySnapshot.docs);
  }