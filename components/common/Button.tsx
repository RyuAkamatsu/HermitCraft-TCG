import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Colors } from '../../constants';

interface Props {
    onPress: () => void,
    backgroundColor?: string | null,
    disabled?: boolean
}

function Button({ onPress, children, backgroundColor = null, disabled = false }: React.PropsWithChildren<Props>) {

    const { buttonStyle } = ButtonStyles;
    const bg = disabled ? Colors.Grey70 : (backgroundColor ?? Colors.ButtonColor);

    return (
        <Pressable
            style={ ({ pressed }) => [{ ...buttonStyle, backgroundColor: bg, opacity: pressed ? 0.5 : 1.0 }] }
            onPress={ onPress }
            disabled={ disabled }
        >
            { children }
        </Pressable>
    );
}

export default Button;

const ButtonStyles = StyleSheet.create({
    buttonStyle: {
        flexDirection : 'row',
        justifyContent: 'center',
        borderRadius  : 40
    }
});
