import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '../../components';
import { PressableButton } from '../../components/common';

import { SearchStackScreenProps } from '../../navigation/types';

import {
    Colors,
    Fonts,
    FontSize,
    ITEM_TYPES, Layout,
} from '../../constants';


function HermitType({ navigation }: SearchStackScreenProps<'HermitType'>) {

    return (
        <SafeAreaView style={ [Layout.SafeArea, { gap: 20, justifyContent: 'center' }] }>
            <BackButton
                navigation={ navigation }
                color="white"
                text="Back"
            />
            <Text style={ styles.headingText }>Pick an Item Type</Text>
            <ScrollView>
                {
                    ITEM_TYPES.map(item => (
                        <PressableButton
                            key={ item.Name }
                            onPress={ () => navigation.navigate('SearchResults', { cardType: 'Hermits', itemType: item.Code }) }
                            style={ styles.buttonContainer }
                        >
                            <View style={ styles.buttonInnerContainer }>
                                <Text style={ styles.buttonText }>{ item.Name }</Text>
                                <Image source={ item.Icon } style={ styles.iconStyle } />
                            </View>
                        </PressableButton>
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    );
}


export default HermitType;

const styles = StyleSheet.create({
    headingText: {
        color     : Colors.TextColor,
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.XLarge,
        alignSelf : 'center'
    },
    buttonInnerContainer: {
        justifyContent  : 'space-between',
        flexDirection   : 'row',
        marginHorizontal: 20
    },
    buttonContainer: {
        backgroundColor : Colors.Grey70,
        paddingVertical : 10,
        marginVertical  : 10,
        marginHorizontal: 20,
        borderRadius    : 0,
        borderStyle     : 'solid',
        borderColor     : 'black',
        borderWidth     : 2
    },
    buttonText: {
        flex             : 1,
        color            : 'white',
        fontFamily       : Fonts.Standard,
        fontSize         : FontSize.XLarge,
        textAlignVertical: 'center'
    },
    iconStyle: {
        height: 50,
        width : 50
    }
});
