import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Text } from './common/Themed';
import { Fonts, FontSize } from '../constants/Fonts';
import Colors from '../constants/Colors';

interface Props {
    cardInfo: any
}

function CardThumb({ cardInfo } : Props) {

    return (
        <View style={ styles.Container }>
            <Text>Card code</Text>
            <Image source={} />
            <View>
                <Pressable
                    onPress={ () => decreaseQuantity() }
                    style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1, flexDirection: 'row', alignSelf: 'center' }) }
                >
                    <FontAwesome5
                        name="minus"
                        size={ 30 }
                        color="white"
                    />
                </Pressable>
                <Text>{ cardInfo.Quantity }</Text>
                <Pressable
                    onPress={ () => increaseQuantity() }
                    style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1, flexDirection: 'row', alignSelf: 'center' }) }
                >
                    <FontAwesome5
                        name="plus"
                        size={ 30 }
                        color="white"
                    />
                </Pressable>
            </View>
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
