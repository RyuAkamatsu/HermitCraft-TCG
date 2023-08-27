import React from 'react';
import { Pressable, StyleSheet, Switch, Text } from 'react-native';
import Colors from '../../constants/Colors';
import { Fonts, FontSize } from '../../constants/Fonts';

interface Props {
    label: string,
    enabled: boolean,
    callback: (value: boolean) => void
}

function SwitchBlock({ label, enabled, callback }: Props) {
    return (
        <Pressable
            onPress={ () => callback(!enabled) }
            style={ styles.toggleButton }
        >
            <Text style={ styles.toggleButtonText }>{ label }</Text>
            <Switch
                trackColor={{ true: Colors.PrimaryColor, false: Colors.Grey70 }}
                thumbColor={ enabled ? 'white' : Colors.Grey90 }
                ios_backgroundColor={ Colors.SecondaryColor }
                value={ enabled }
                onValueChange={ () => callback(!enabled) }
            />
        </Pressable>
    );
}

export default SwitchBlock;

const styles = StyleSheet.create({
    toggleButton: {
        paddingVertical  : 15,
        paddingHorizontal: 20,
        marginVertical   : 10,
        flexDirection    : 'row',
        alignItems       : 'center',
        justifyContent   : 'space-between'
    },
    toggleButtonText: {
        color     : Colors.TextColor,
        fontSize  : FontSize.Medium,
        fontFamily: Fonts.Standard,
    }
});
