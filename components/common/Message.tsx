import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSize } from '../../constants';

interface Props {
    type ?: 'Success' | 'Error',
    heading ?: string | null,
    text ?: string | null,
    onPress ?: () => void
}

function Message({ type = 'Error', heading = null, text = null, onPress }: Props) {

    const {
        containerStyle,
        headingText,
        messageText
    } = styles(type);

    const messageContainer = (
        <View style={ containerStyle }>
            { heading && <Text style={ headingText }>{ heading }</Text> }
            <Text style={ messageText }>{ text }</Text>
        </View>
    );

    return onPress ? <TouchableOpacity onPress={ onPress }>{ messageContainer }</TouchableOpacity> : messageContainer;
}

export default Message;

const styles = (type: string) => StyleSheet.create({
    containerStyle: {
        marginVertical : 15,
        padding        : 10,
        backgroundColor: type === 'Success' ? Colors.SecondarySuccessColor : Colors.SecondaryErrorColor
    },
    headingText: {
        fontFamily  : Fonts.Standard,
        fontSize    : FontSize.Small,
        color       : type === 'Success' ? Colors.SuccessColor : Colors.ErrorColor,
        marginBottom: 0
    },
    messageText: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Tiny,
        color     : type === 'Success' ? Colors.SuccessColor : Colors.ErrorColor
    }
});
