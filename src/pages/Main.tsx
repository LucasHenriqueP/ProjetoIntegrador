import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import Background from './Background'

const Page1 = ({ navigation }) => (

    <Background>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button
                title="Cursos"
                onPress={() => navigation.navigate('Cursos')}
            />
        </View>
    </Background>
);

Page1.navigationOptions = {
    title: 'Cursos',
}


export default Page1;
