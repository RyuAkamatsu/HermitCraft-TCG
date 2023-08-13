import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import { Fonts, FontSize } from '../../constants/Fonts';

interface Props {
    placeholder: string,
    value: string,
    onChangeText: (field: string, value: string) => void,
    field: string,
    numberOfLines?: number,
    overrideStyle?: any
    editable?: boolean
}

function TextArea({ placeholder, value, onChangeText, field, numberOfLines, overrideStyle = {}, editable = true }: Props) {

    const { inputStyle } = TextAreaStyles(editable);

    const [textValue, setValue] = useState(value);
    const [height, setHeight] = useState(60);

    useEffect(() => {
        if (onChangeText) {
            onChangeText(field, textValue);
        }
    }, [textValue]);

    useEffect(() => {
        if (textValue !== value) {
            setValue(value);
        }
    }, [value]);

    return (
        <TextInput
            placeholder={ placeholder }
            autoCorrect
            style={{ ...inputStyle, ...overrideStyle, height }}
            value={ textValue }
            onChangeText={ v => setValue(v) }
            multiline
            numberOfLines={ numberOfLines ?? 4 }
            onContentSizeChange={ event => {
                setHeight(event.nativeEvent.contentSize.height);
            } }
        />
    );
}

export { TextArea };

export const TextAreaStyles = (editable: boolean) => StyleSheet.create({
    inputStyle: {
        marginVertical   : 2,
        color            : editable ? Colors.TextColor : Colors.Grey60,
        backgroundColor  : editable ? 'white' : Colors.Grey80,
        borderStyle      : 'solid',
        borderColor      : Colors.Grey50,
        borderWidth      : 2,
        paddingHorizontal: 10,
        fontSize         : FontSize.Small,
        fontFamily       : Fonts.Light,
        minHeight        : 60,
        padding          : 10,
        textAlignVertical: 'top'
    }
});
