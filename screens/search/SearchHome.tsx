import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableButton } from '../../components/common';

import { SearchStackScreenProps } from '../../navigation/types';
import { Fonts, FontSize, CARD_TYPES, Colors, Layout } from '../../constants';

function SearchHome({ navigation }: SearchStackScreenProps<'SearchHome'>) {

    function navigateToCardType(cardType: string) {
        if (cardType === 'Hermits') {
            navigation.navigate('HermitType');
        } else {
            navigation.navigate('SearchResults', { cardType });
        }
    }

    return (
        <SafeAreaView style={ [Layout.SafeArea, { gap: 40, justifyContent: 'center' }] }>
            {
                CARD_TYPES.map(type => (
                    <PressableButton
                        key={ type.Name }
                        onPress={ () => navigateToCardType(type.Name) }
                        style={{ ...styles.buttonContainer, backgroundColor: Colors.Grey70 }}
                    >
                        <Text style={ styles.buttonText }>{ type.Name }</Text>
                    </PressableButton>
                ))
            }
            <PressableButton
                onPress={ () => navigation.navigate('AdvancedSearch') }
                style={{ ...styles.buttonContainer, backgroundColor: Colors.SecondaryColor }}
            >
                <Text style={ styles.buttonText }>Advanced Search</Text>
            </PressableButton>
        </SafeAreaView>
    );
}


export default SearchHome;

const styles = StyleSheet.create({
    buttonContainer: {
        paddingVertical : 20,
        marginHorizontal: 20,
        borderRadius    : 0,
        borderStyle     : 'solid',
        borderColor     : 'black',
        borderWidth     : 2
    },
    buttonText: {
        color     : 'white',
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Heading,
    }
});
