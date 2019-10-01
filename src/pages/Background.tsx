import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    ImageBackground
} from 'react-native';

class BackgroundImage extends Component {

    render() {
        return (
            <ImageBackground
                blurRadius={1.2} source={require('../../static/background.jpeg')}
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

export default BackgroundImage;