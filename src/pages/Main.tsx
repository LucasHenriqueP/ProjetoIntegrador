import React from 'react';
import { View, Text, Button } from 'react-native';
import Background from './Background'

const Page1 = ({ navigation }) => (

    <Background>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button
                title="Cursos"
                onPress={() => navigation.navigate('Cursos')}
            />
            <Text>
                {"\n"}
            </Text>
            <Button
                title="Users"
                onPress={() => navigation.navigate('Users')}
            />
        </View>
    </Background>
);


export default Page1;
