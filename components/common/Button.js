import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '../../constants/Colors';
import { Fonts, FontSize } from '../../constants/Fonts';

function Button({ onPress, children, upperCase = null, backgroundColor = null }) {

    const text = upperCase != null && !upperCase ? children : children.toUpperCase();
    const { containerStyle, buttonStyle, textStyle } = ButtonStyles;
    const bg = backgroundColor ?? buttonStyle.backgroundColor;

    return (
        <View style={ containerStyle }>
            <Pressable style={{ ...buttonStyle, backgroundColor: bg }} onPress={ onPress }>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={ textStyle }>{text}</Text>
                </View>
            </Pressable>
        </View>
    );
}

// eslint-disable-next-line import/prefer-default-export
export { Button };

const ButtonStyles = StyleSheet.create({
    containerStyle: { alignSelf: 'stretch' },
    buttonStyle   : {
        flexDirection  : 'row',
        backgroundColor: Colors.ButtonColour,
        justifyContent : 'center',
        borderRadius   : 40
    },
    textStyle: {
        alignSelf      : 'center',
        color          : 'white',
        fontSize       : FontSize.Small,
        fontFamily     : Fonts.Light,
        paddingVertical: 15
    }
});
