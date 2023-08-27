import React from 'react';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import Colors from '../constants/Colors';
import { Fonts, FontSize } from '../constants/Fonts';

interface Props {
    sortVal: string,
    onChange: (val: string) => void,
    items?: { label: string, value: string }[]
}

function SortButton({ sortVal, onChange, items = [] }: Props) {

    return (
        <View style={ styles.buttonContainer }>
            <RNPickerSelect
                onValueChange={ (value: string) => onChange(value) }
                placeholder={{}}
                items={ [
                    ...items
                ] }
                value={ sortVal }
                style={ styles.pickerStyle }
                useNativeAndroidPickerStyle={ false }
                fixAndroidTouchableBug
            />
            <View style={{ flex: 1 }} />
        </View>
    );
}

export default SortButton;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 0,
        marginBottom: 10
    },
    pickerStyle: {
        viewContainer: {
            backgroundColor  : Colors.Grey80,
            marginVertical   : 5,
            paddingHorizontal: 10,
            borderRadius     : 40,
            alignSelf        : 'flex-start'
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

        headlessAndroidContainer: { },
        inputAndroidContainer   : {
            backgroundColor  : Colors.Grey80,
            borderRadius     : 40,
            paddingVertical  : 15,
            paddingHorizontal: 15,
            flexDirection    : 'row',
        },
        inputAndroid: {
            fontFamily: Fonts.Standard,
            fontSize  : FontSize.Small,
            color     : Colors.TextColor,
        }
    }
});
