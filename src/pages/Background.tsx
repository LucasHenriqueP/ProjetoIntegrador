import React, { Component } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

export default class BackgroundImage extends Component {

    render() {
        return (
            <ImageBackground
                blurRadius={1} source={require('../../static/background.jpg')}
                style={styles.backgroundImage}>

                {this.props.children}

            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },

    text: {
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 32
    }
});