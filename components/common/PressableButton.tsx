import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Colors } from '../../constants';

interface Props {
    onPress: () => void,
    shadowHeight?: number,
    disabled?: boolean
    style?: any | null,
}

function PressableButton(props: React.PropsWithChildren<Props>) {

    const { onPress, children, shadowHeight = 4, disabled = false, style = {} } = props;

    const [isPressed, setIsPressed] = useState(false);

    const { buttonStyle } = styles;

    const bkgColor = style?.backgroundColor ?? buttonStyle.backgroundColor;

    return (
        <Pressable
            disabled={ disabled }
            style={ [
                buttonStyle,
                { backgroundColor: disabled ? Colors.Grey70 : bkgColor },
                { borderBottomWidth: isPressed ? shadowHeight : 0 },
                style
            ] }
            onPress={ onPress }
            onPressIn={ () => setIsPressed(true) }
            onPressOut={ () => setIsPressed(false) }
        >
            { children }
        </Pressable>
    );
}

export default PressableButton;

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor  : Colors.ButtonColor,
        borderRadius     : 8,
        borderBottomWidth: 4,
        borderLeftWidth  : 0.5,
        borderRightWidth : 0.5,
        justifyContent   : 'center',
        alignItems       : 'center',
    },
});
