/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { KeyboardTypeOptions, StyleSheet, TextInput, TextInputProps } from 'react-native';

import { Fonts, FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';

interface Props {
    placeholder: string,
    value: string,
    onChangeText: (value: string) => void,
    secureTextEntry?: boolean,
    keyboardType?: KeyboardTypeOptions,
    halfWidth?: boolean,
    overrideStyle?: any,
    editable?: boolean,
    behaviour?: 'text' | 'email' | 'username' | 'number' | 'phone' | 'password' | 'newPassword',
    maxLength?: number
}

// eslint-disable-next-line max-len
function Input({ placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default', halfWidth = false, overrideStyle = {}, editable = true, behaviour = 'text', maxLength = 1000 }: Props) {

    const { inputStyle } = InputStyles(editable);

    const [currentValue, setCurrentValue] = useState(value);

    useEffect(() => {
        if (onChangeText) {
            onChangeText(currentValue);
        }
    }, [currentValue]);

    useEffect(() => {
        if (currentValue !== value) {
            setCurrentValue(value);
        }
    }, [value]);

    const textInputProps: TextInputProps = { keyboardType };

    switch (behaviour) {
        case 'number':
            textInputProps.keyboardType = 'numeric';
            break;
        case 'email':
            textInputProps.autoComplete = 'email';
            textInputProps.textContentType = 'emailAddress';
            textInputProps.autoCapitalize = 'none';
            textInputProps.keyboardType = 'email-address';
            break;
        case 'username':
            textInputProps.autoComplete = 'username-new';
            textInputProps.textContentType = 'username';
            textInputProps.autoCapitalize = 'none';
            break;
        case 'phone':
            textInputProps.autoComplete = 'tel';
            textInputProps.textContentType = 'telephoneNumber';
            textInputProps.keyboardType = 'phone-pad';
            break;
        case 'password':
            textInputProps.textContentType = 'password';
            textInputProps.autoComplete = 'current-password';
            break;
        case 'newPassword':
            textInputProps.textContentType = 'newPassword';
            textInputProps.passwordRules = 'minlength: 6; required: lower; required: upper; required: digit; required: special;';
            textInputProps.autoComplete = 'new-password';
            break;
        default:
            break;
    }

    return (
        <TextInput
            secureTextEntry={ secureTextEntry }
            placeholder={ placeholder }
            autoCorrect
            style={{ ...inputStyle, ...overrideStyle, width: halfWidth ? '50%' : '100%' }}
            value={ currentValue }
            onChangeText={ v => setCurrentValue(v) }
            editable={ editable }
            maxLength={ maxLength }
            { ...textInputProps }
        />
    );
}

export default Input;

export const InputStyles = (editable: boolean) => StyleSheet.create({
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
    }
});
