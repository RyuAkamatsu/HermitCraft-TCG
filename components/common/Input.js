import React, { Component } from 'react';
import { TextInput, View } from 'react-native';

import { Fonts, FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';

class Input extends Component {

    componentDidMount() {
        const { value, field, onChangeText } = this.props;

        if (value) {
            onChangeText(field, value);
        }
    }

    render() {
        const { placeholder, value, onChangeText, secureTextEntry, keyboardType, halfWidth, field } = this.props;
        const { inputStyle, containerStyle } = InputStyles;

        return (
            <View style={ containerStyle }>
                <TextInput
                    secureTextEntry={ secureTextEntry }
                    placeholder={ placeholder }
                    autoCorrect
                    style={{ ...inputStyle, flex: halfWidth ? 0.5 : 1 }}
                    value={ value }
                    onChangeText={ value => onChangeText(field, value) }
                    keyboardType={ keyboardType || 'default' }
                />
            </View>
        );
    }
}

// eslint-disable-next-line import/prefer-default-export
export { Input };

export const InputStyles = {
    containerStyle: {
        flex          : 1,
        flexDirection : 'row',
        marginVertical: 2
    },
    inputStyle: {
        color          : 'black',
        paddingRight   : 10,
        paddingLeft    : 10,
        fontSize       : FontSize.Small,
        fontFamily     : Fonts.Light,
        borderWidth    : 1,
        borderColor    : Colors.Grey50,
        borderRadius   : 5,
        backgroundColor: 'white',
        minHeight      : 60
    }
};
