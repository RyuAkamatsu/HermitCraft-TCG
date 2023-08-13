import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from './common/Themed';
import { Fonts, FontSize } from '../constants/Fonts';
import Colors from '../constants/Colors';

interface Props {
    navigation: any,
    text?: string,
    color?: string
}

function BackButton({ navigation, text = 'Back', color = Colors.TextColor } : Props) {

    return (
        <View style={ styles.iconContainer }>
            <Pressable
                onPress={ () => navigation.goBack(null) }
                style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1, flexDirection: 'row', alignSelf: 'center' }) }
            >
                <MaterialIcons
                    name="arrow-left"
                    size={ 30 }
                    color={ color }
                    style={{ marginTop: -3 }}
                />
                <Text style={{ ...styles.backText, color }}>{ text }</Text>
            </Pressable>
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
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Small
    },
});

export { BackButton };
