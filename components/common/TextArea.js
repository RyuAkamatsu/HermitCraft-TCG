import React, { Component } from 'react';
import { TextInput, View } from 'react-native';

import { TextAreaStyles } from "../../../styles";

class TextArea extends Component {

    componentDidMount() {
        const { value, field, onChangeText } = this.props;

        if (value) {
            onChangeText(field, value);
        }
    }

    render() {
        const { placeholder, value, onChangeText, field } = this.props;
        const { inputStyle, containerStyle } = TextAreaStyles;

        return (
            <View style={containerStyle}>
                <TextInput
                    placeholder={placeholder}
                    autoCorrect={true}
                    style={inputStyle}
                    value={value}
                    onChangeText={value => onChangeText(field, value)}
                    multiline={true}
                    numberOfLines={4}/>
            </View>
        );
    }
}

export { TextArea };