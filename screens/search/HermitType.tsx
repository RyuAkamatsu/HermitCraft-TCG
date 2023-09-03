import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { PressableButton } from '../../components/common';
import { Text } from '../../components/Themed';

import { SearchStackScreenProps } from '../../navigation/types';
import { Fonts, FontSize } from '../../constants/Fonts';
import { CARD_TYPES, ITEM_TYPES } from '../../constants';
import { BackButton } from '../../components';

function HermitType({ navigation }: SearchStackScreenProps<'HermitType'>) {

    return (
        <View style={{ flex: 1 }}>
            <BackButton
                navigation={ navigation }
                color='white'
            />
            {
                ITEM_TYPES.map(item => (
                    <PressableButton
                        onPress={ () => navigation.navigate('SearchResults', { cardType: 'Hermits', itemType: item.Code }) }
                    >
                        <View style={ styles.buttonInnerContainer }>
                            <Text style={ styles.buttonText }>{ item.Name }</Text>
                            <Image source={ item.Icon } />
                        </View>
                    </PressableButton>
                ))
            }
        </View>
    );
}


export default HermitType;

const styles = StyleSheet.create({
    buttonInnerContainer: {
        justifyContent: 'space-between',
        flexDirection : 'row'
    },
    buttonText: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium
    }
});
