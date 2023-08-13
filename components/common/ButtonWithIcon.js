import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

// eslint-disable-next-line max-len
function ButtonWithIcon({ onPress, children, iconSide = 'right', iconType = null, buttonIcon = null, backgroundColor = null, iconColor = null }) {

    const { containerStyle, buttonStyle, iconContainer, iconStyle } = ButtonWithIconStyles;

    const bg = backgroundColor || buttonStyle.backgroundColor;
    const iconColour = iconColor ?? 'black';

    let icon;
    switch (iconType) {
        case 'FontAwesome':
            icon = <FontAwesome name={ buttonIcon } size={ 24 } color={ iconColour } />;
            break;
        case 'FontAwesome5':
            icon = <FontAwesome5 name={ buttonIcon } size={ 24 } color={ iconColour } />;
            break;
        case 'MaterialIcons':
            icon = <MaterialIcons name={ buttonIcon } size={ 24 } color={ iconColour } />;
            break;
        case 'Image':
            icon = <Image source={ buttonIcon } style={ iconStyle } />;
            break;
        default:
            icon = <MaterialIcons name="arrow-right-alt" size={ 24 } color={ iconColour } />;
    }

    if (iconSide.toLowerCase() === 'left') {
        return (
            <View style={ containerStyle }>
                <Pressable style={{ ...buttonStyle, justifyContent: 'flex-end', backgroundColor: bg }} onPress={ onPress }>
                    <View style={ iconContainer }>{ icon }</View>
                    <View style={{ justifyContent: 'center' }}>
                        { children }
                    </View>
                </Pressable>
            </View>
        );
    }
    return (
        <View style={ containerStyle }>
            <Pressable style={{ ...buttonStyle, backgroundColor: bg }} onPress={ onPress }>
                <View style={{ justifyContent: 'center' }}>
                    { children }
                </View>
                <View style={ iconContainer }>{ icon }</View>
            </Pressable>
        </View>
    );
}

// eslint-disable-next-line import/prefer-default-export
export { ButtonWithIcon };

const ButtonWithIconStyles = StyleSheet.create({
    containerStyle: { alignSelf: 'stretch' },
    buttonStyle   : {
        flexDirection  : 'row',
        backgroundColor: Colors.ButtonColour,
        justifyContent : 'center',
        borderRadius   : 40
    },
    iconContainer: {
        flexDirection: 'row',
        alignSelf    : 'center',
        width        : 25,
        marginLeft   : 10
    },
    iconStyle: {
        width  : 10,
        height : 10,
        opacity: 1
    }
});
