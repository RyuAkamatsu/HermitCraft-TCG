import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

import Colors from '../constants/Colors';
import { Fonts, FontSize } from '../constants/Fonts';

interface Props {
    sorting: string
    onChange: (val: string) => void
}

function SortButton({ sorting, onChange }: Props) {

    let sortDirection = 'desc';
    if (sorting) {
        // eslint-disable-next-line prefer-destructuring
        sortDirection = sorting.split(',')[1];
    }

    return (
        <View style={ styles.buttonContainer }>
            <RNPickerSelect
                onValueChange={ (value: string) => onChange(value) }
                placeholder={{ label: 'Newest', value: 'Date,desc' }}
                items={ [
                    { label: 'Oldest', value: 'Date,asc' },
                    { label: 'Most Votes', value: 'VotesSum,desc' },
                    { label: 'Least Votes', value: 'VotesSum,asc' },
                ] }
                Icon={ () => { return <FontAwesome5 name={ sortDirection === 'desc' ? 'sort-amount-up' : 'sort-amount-down-alt' } size={ 24 } color={ Colors.TextColor } /> } }
                value={ sorting }
                style={ styles.pickerStyle }
            />
        </View>
    );
}

export { SortButton };

const styles = StyleSheet.create({
    buttonContainer: { paddingHorizontal: 0 },
    pickerStyle: {
        viewContainer: {
            backgroundColor  : Colors.Grey80,
            marginVertical   : 5,
            paddingHorizontal: 10,
            borderRadius     : 40,
            alignSelf: 'flex-start'
        },
        iconContainer: {
            position         : 'relative',
            paddingHorizontal: 5,
            justifyContent   : 'center'
        },
        placeholder: { color: Colors.TextColor },

        inputIOSContainer: {
            paddingVertical  : 15,
            paddingHorizontal: 5,
            flexDirection    : 'row',
        },
        inputIOS: {
            fontFamily: Fonts.Standard,
            fontSize  : FontSize.Small,
            color     : Colors.TextColor
        },

        inputAndroidContainer: {
            paddingVertical  : 15,
            paddingHorizontal: 5,
            flexDirection    : 'row',
        },
        inputAndroid: {
            fontFamily: Fonts.Standard,
            fontSize  : FontSize.Small,
            color     : Colors.TextColor
        },
        headlessAndroidContainer: {}
    }
});
