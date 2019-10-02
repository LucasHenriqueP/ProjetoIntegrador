import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Background from './Background'
import Login from './Login';

const Page1 = ({ navigation }) => (

    <Background>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
            <Login />
            <Button
                style={{ marginBottom: 10 }}
                mode="contained"
                onPress={() => navigation.navigate('Cursos')}
            >Cursos</Button>
            <Button
                style={{ margin: 5 }}
                mode="contained"
                onPress={() => navigation.navigate('Users')}
            >Usuários</Button>
        </View>
    </Background>
);


export default Page1;
