import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect, Component } from 'react';
import { Button } from 'react-native-paper';
import { Text, FlatList, View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Overlay, Input } from 'react-native-elements';

// import { Container } from './styles';

const Login = () => {
    const [Email, setEmail] = useState('');
    const [Senha, setSenha] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.input}>

                <Input
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCompleteType="email"
                    inputContainerStyle={styles.input}
                    style={styles.input}
                    value={Email} onChangeText={setEmail}
                    label={'E-mail'}
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    placeholder={'email@endereco.com.br'}></Input>
                <Input
                    secureTextEntry={true}
                    textContentType="password"
                    autoCompleteType="password"
                    autoCapitalize="none"
                    inputContainerStyle={styles.input2}
                    value={Senha} onChangeText={setSenha}
                    label={'Senha'}
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    placeholder={'senha'}
                ></Input>
            </View>
            <Button style={styles.button} color="#000" onPress={() => null}>Login</Button>
            <TouchableOpacity style={styles.touch} onPress={() => null}>
                <Text>Ainda não é cadastrado? Registre-se</Text>
            </TouchableOpacity>
            {/* <Text>Ou faça login como uma das opções abaixo</Text> */}

        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        backgroundColor: "#ffffff",
        width: "100%",
        height: "auto"
    },
    input2: {
        backgroundColor: "#ffffff",
        width: "100%",
        height: "auto",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#da277a",
        marginTop: 10,
    },
    touch: {
        margin: 10
    },
});

export default Login;
