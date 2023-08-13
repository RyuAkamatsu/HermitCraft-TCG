import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Fonts, FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';

function Error({ heading = null, text = null, onPress = null }) {
    if (onPress) {
        return (
            <TouchableOpacity onPress={ onPress } style={ styles.containerStyle }>
                { heading && <Text style={ styles.errorHeading }>{heading}</Text> }
                <Text style={ styles.errorText }>{text}</Text>
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
        marginVertical: 15,
        borderWidth   : 1,
        borderColor   : Colors.ButtonColour,
        padding       : 10
    },
    errorHeading: {
        fontFamily  : Fonts.Medium,
        fontSize    : FontSize.Small,
        color       : Colors.ButtonColour,
        marginBottom: 0
    },
    errorText: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Tiny,
        color     : Colors.MainColour
    }
};
