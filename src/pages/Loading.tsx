import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

const Loading = () => (
    <View style={styles.container}>
        <ActivityIndicator animating={true} size={"large"} color={"#000"} />
        <Text>Carregando...</Text>
    </View>
);
export default Loading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})