import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PressableButton } from '../../components/common';
import { Text } from '../../components/Themed';

import { SearchStackScreenProps } from '../../navigation/types';
import { Fonts, FontSize } from '../../constants/Fonts';
import { CARD_TYPES } from '../../constants';

function SearchHome({ navigation }: SearchStackScreenProps<'SearchHome'>) {

    const [cardType, setCardType] = useState('');

    useEffect(() => {
        if (cardType === 'Hermit') {
            navigation.navigate('HermitType');
        } else {
            navigation.navigate('SearchResults', { cardType });
        }
    }, [cardType]);

    return (
        <View style={{ flex: 1, gap: 10 }}>
            {
                CARD_TYPES.map(type => (
                    <PressableButton
                        onPress={ () => setCardType(type) }
                    >
                        <Text style={ styles.buttonText }>{ type }</Text>
                    </PressableButton>
                ))
            }
            <PressableButton
                onPress={ () => navigation.navigate('AdvancedSearch') }
            >
                <Text style={ styles.buttonText }>Advanced Search</Text>
            </PressableButton>
        </View>
    );
}


export default SearchHome;

const styles = StyleSheet.create({
    buttonText: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium
    }
});
