import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect, Component } from 'react';
import { Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Text, FlatList, View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { Overlay, Input } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
// import { Container } from './styles';
const ref = firestore().collection('usuarios');



const Login = () => {
    const [Nome, setNome] = useState('');
    const [Sobrenome, setSobrenome] = useState('');
    const [Celular, setCelular] = useState('');
    const [Email, setEmail] = useState('');
    const [Senha, setSenha] = useState('');
    const [modalCadastro, setmodalCadastro] = useState(false);

    async function register(email, password, Nome, Sobrenome, Celular) {
        try {
            setmodalCadastro(false);
            const userInfo = await auth().createUserWithEmailAndPassword(email, password);
            console.log(userInfo);
            await ref.add({
                uid: userInfo.user.uid,
                nome: Nome,
                sobrenome: Sobrenome,
                celular: Celular,
                email: email,
            });
        } catch (e) {
            console.error(e.message);
        }
    }

    const openmodalCadastro = () => {
        setmodalCadastro(true);
    }
    const closemodalCadastro = () => {
        setmodalCadastro(false);
    }

    return (
        <View style={styles.container}>
            <Overlay
                isVisible={modalCadastro}
                windowBackgroundColor="rgba(255, 255, 255, 0)"
                width="100%"
                onBackdropPress={closemodalCadastro}
                height="auto"
            >
                <KeyboardAwareScrollView >
                    <Input label={'Nome'} value={Nome} placeholder={"João"} onChangeText={setNome} />
                    <Input label={'Sobrenome'} value={Sobrenome} placeholder={"Da Silva"} onChangeText={setSobrenome} />
                    <Input keyboardType="numeric" label={'Celular'} value={Celular} placeholder={"(xx)9xxxx-xxxx"} onChangeText={setCelular} />
                    <Input keyboardType="email-address"
                        autoCapitalize="none"
                        autoCompleteType="email"
                        inputContainerStyle={styles.input}
                        style={styles.input}
                        value={Email} onChangeText={setEmail}
                        label={'E-mail'}
                        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                        placeholder={'email@endereco.com.br'} />
                    <Input secureTextEntry={true}
                        textContentType="password"
                        autoCompleteType="password"
                        autoCapitalize="none"
                        inputContainerStyle={styles.input2}
                        value={Senha} onChangeText={setSenha}
                        label={'Senha'}
                        leftIcon={{ type: 'font-awesome', name: 'lock' }}
                        placeholder={'senha'} />
                    <Button color="#202a31" onPress={() => register(Email, Senha, Nome, Sobrenome, Celular)}>Cadastrar</Button>
                </KeyboardAwareScrollView>
            </Overlay>
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
            <Button style={styles.touch} onPress={openmodalCadastro} mode="contained">
                Ainda não é cadastrado? Registre-se
            </Button>
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
        backgroundColor: "#7986CB",
        marginTop: 10,
    },
    touch: {
        margin: 10,
        backgroundColor: "#1DE9B6"
    },
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
});

export default Login;
