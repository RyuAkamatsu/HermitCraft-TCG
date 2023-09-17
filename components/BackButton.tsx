import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PressableButton } from './common';

import { Colors, Fonts, FontSize } from '../constants';

interface Props {
    navigation: any,
    text?: string,
    color?: string
}

function BackButton({ navigation, text, color = Colors.TextColor } : Props) {

    return (
        <View style={ styles.iconContainer }>
            <PressableButton
                onPress={ () => navigation.goBack(null) }
                style={{ flexDirection: 'row', alignSelf: 'center' }}
            >
                <MaterialIcons
                    name="arrow-left"
                    size={ 30 }
                    color={ color }
                    style={{ marginTop: -3 }}
                />
                { text && <Text style={{ ...styles.backText, color }}>{ text }</Text> }
            </PressableButton>
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        marginTop  : 20,
        paddingLeft: 5,
        alignSelf  : 'flex-start',
    },
    backText: {
        fontFamily  : Fonts.Standard,
        fontSize    : FontSize.Medium,
        paddingRight: 15,
        paddingVertical: 10
    },
});

export default BackButton;
