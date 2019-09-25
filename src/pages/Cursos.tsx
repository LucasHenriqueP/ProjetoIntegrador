import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Button, TextInput, Appbar } from 'react-native-paper';
import { ScrollView, Text, FlatList } from 'react-native';
import Show from './Curso';

const logaCursos = async () => {
  const querySnapshot = await firestore()
    .collection('cursos')
    .get();
  console.log('Cursos Totais', querySnapshot.size);
  console.log('Documentos de Cursos', querySnapshot.docs);
}



function cursos() {
  const ref = firestore().collection('cursos');
  const [Curso, setCurso] = useState('');
  const [Desc, setDesc] = useState('');
  const [Rating, setRating] = useState('');
  const [loading, setLoading] = useState(true); // Set loading to true on component mount 
  const [Cursos, setCursos] = useState([]); // Initial empty array of Cursos


  async function addCurso() {
    await ref.add({
      nome: Curso,
      descricao: Desc,
      rating: Rating
    });
    setCurso('');
    setDesc(''); 
    setRating('');
  }

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { nome, descricao, rating } = doc.data();
        list.push({
          id: doc.id,
          nome,
          descricao,
          rating
        });
        console.log(doc.data())
      });
      setCursos(list);
      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return null; // or a spinner
  }
  return (
    <>
     <Appbar>
        <Appbar.Content title={'Lista de Cursos'} />
      </Appbar>
      <ScrollView style={{ flex: 1 }}>
      <FlatList 
        style={{flex: 1}}
        data={Cursos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Show {...item} />}
      />
      </ScrollView>
      <TextInput label={'Nome'} value={Curso} onChangeText={setCurso} />
      <TextInput label={'Descrição'} value={Desc} onChangeText={setDesc} />
      <TextInput label={'Rating'} value={Rating} onChangeText={setRating} />
      <Button onPress={() => addCurso()}>Add Curso</Button>
    </>
  );
}

export default cursos;
