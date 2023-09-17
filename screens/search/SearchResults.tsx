import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SearchStackScreenProps } from '../../navigation/types';

import { Fonts, FontSize } from '../../constants';

function SearchResults({ navigation }: SearchStackScreenProps<'SearchResults'>) {

    return (
        <View style={{ flex: 1, gap: 10 }}>
            <Text>Search Results</Text>
        </View>
    );
}


export default SearchResults;

const styles = StyleSheet.create({
    buttonText: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium
    }
});
