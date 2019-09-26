import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

const Page1 = ({ navigation }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
            title="Cursos"
            onPress={() => navigation.navigate('Cursos')}
        />
    </View>
);

Page1.navigationOptions = {
    title: 'Cursos',
}


export default Page1;
