import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Fonts, FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';

interface Props {
    heading ?: string | null,
    text ?: string | null,
    onPress ?: () => void
}

function Error({ heading = null, text = null, onPress }: Props) {
    if (onPress) {
        return (
            <TouchableOpacity onPress={ onPress }>
                <View style={ styles.containerStyle }>
                    { heading && <Text style={ styles.errorHeading }>{heading}</Text> }
                    <Text style={ styles.errorText }>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={ styles.containerStyle }>
            { heading && <Text style={ styles.errorHeading }>{heading}</Text> }
            <Text style={ styles.errorText }>{text}</Text>
        </View>
    );
}

// eslint-disable-next-line import/prefer-default-export
export { Error };

const styles = {
    containerStyle: {
        marginVertical : 5,
        padding        : 10,
        backgroundColor: Colors.SecondaryErrorColor
    },
    errorHeading: {
        fontFamily  : Fonts.Standard,
        fontSize    : FontSize.Small,
        color       : Colors.ErrorColor,
        marginBottom: 0
    },
    errorText: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Tiny,
        color     : Colors.ErrorColor
    }
};
