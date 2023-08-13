import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '../../constants/Colors';
import { Fonts, FontSize } from '../../constants/Fonts';

interface Props {
    onPress: () => void,
    upperCase?: boolean,
    backgroundColor?: string | null,
    overrideContainerStyle?: object,
    disabled?: boolean
}

function Button({ onPress, children, upperCase = false, backgroundColor = null, overrideContainerStyle = {}, disabled = false }: React.PropsWithChildren<Props>) {

    const text = upperCase === true && typeof children === 'string' ? children.toUpperCase() : children;
    const { containerStyle, buttonStyle, textStyle } = ButtonStyles;
    const bg = disabled ? Colors.Grey70 : (backgroundColor ?? buttonStyle.backgroundColor);

    return (
        <View style={{ ...containerStyle, ...overrideContainerStyle }}>
            <Pressable
                style={ ({ pressed }) => [{ ...buttonStyle, backgroundColor: bg, opacity: pressed ? 0.5 : 1.0 }] }
                onPress={ onPress }
                disabled={ disabled }
            >
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
        backgroundColor: Colors.ButtonColor,
        justifyContent : 'center',
        borderRadius   : 40
    },
    textStyle: {
        alignSelf : 'center',
        color     : 'white',
        fontSize  : FontSize.Small,
        fontFamily: Fonts.Light,
        padding   : 15
    }
});
