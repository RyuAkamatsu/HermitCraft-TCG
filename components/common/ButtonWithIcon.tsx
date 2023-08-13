import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

interface Props {
    onPress: () => void,
    buttonIcon ?: any,
    iconSide ?: string,
    iconType ?: string | null,
    iconColor ?: string | null,
    backgroundColor ?: string | null,
    overrideContainerStyle?: object,
    disabled?: boolean
}


// eslint-disable-next-line max-len
function ButtonWithIcon({ onPress, children, buttonIcon = null, iconSide = 'right', iconType = null, iconColor = null, backgroundColor = null, overrideContainerStyle = {}, disabled = false }: React.PropsWithChildren<Props>) {

    const { containerStyle, buttonStyle, iconContainer, iconStyle } = ButtonWithIconStyles;

    const bg = disabled ? Colors.Grey70 : (backgroundColor ?? buttonStyle.backgroundColor);
    const iconColour = iconColor ?? 'black';

    iconSide = iconSide?.toLowerCase();

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

    return (
        <View style={{ ...containerStyle, ...overrideContainerStyle }}>
            <Pressable
                style={ ({ pressed }) => [
                    {
                        ...buttonStyle,
                        backgroundColor: bg,
                        justifyContent : (iconSide === 'left' ? 'flex-end' : 'flex-start'),
                        opacity        : pressed ? 0.5 : 1.0
                    }
                ] }
                onPress={ onPress }
                disabled={ disabled }
            >
                { iconSide === 'left' && <View style={ iconContainer }>{ icon }</View> }
                <View style={{ justifyContent: 'center' }}>
                    { children }
                </View>
                { iconSide !== 'left' && <View style={ iconContainer }>{ icon }</View> }
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
        backgroundColor: Colors.ButtonColor,
        justifyContent : 'center',
        borderRadius   : 40
    },
    iconContainer: {
        flexDirection   : 'row',
        alignSelf       : 'center',
        width           : 25,
        marginHorizontal: 15
    },
    iconStyle: {
        width  : 10,
        height : 10,
        opacity: 1
    }
});
