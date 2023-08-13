import React, { Component } from 'react';
import { TextInput, View, Text } from 'react-native';

import { Button } from './Button';

import { GlobalStyles, InputWithButtonStyles, Colors } from "../../../styles";

class InputWithButton extends Component {

    state = {
        borderColor: Colors.Grey75
    };

    onFocus() {
        this.setState({
            borderColor: Colors.Grey60
        })
    };

    onBlur() {
        this.setState({
            borderColor: Colors.Grey75
        })
    };

    render() {
        let { containerStyle, inputGroupStyle, inputStyle } = InputWithButtonStyles;

        const { label, labelUpperCase, placeholder, value, onChangeText, secureTextEntry, button, buttonUpperCase, buttonPress } = this.props;
        const labelText = labelUpperCase != null && !labelUpperCase ? label : label.toUpperCase();
        const buttonText = buttonUpperCase != null && !buttonUpperCase ? button : button.toUpperCase();

        return (
            <View style={containerStyle}>
                <Text style={GlobalStyles.labelStyle}>{labelText}</Text>
                <View style={inputGroupStyle}>
                    <TextInput
                        secureTextEntry={secureTextEntry}
                        placeholder={placeholder}
                        autoCorrect={true}
                        onBlur={() => this.onBlur()}
                        onFocus={() => this.onFocus()}
                        style={[inputStyle, { borderColor: this.state.borderColor }]}
                        value={value}
                        onChangeText={onChangeText}
                    />
                    <Button onPress={buttonPress} overrideStyle={{ marginHorizontal: -2, marginRight: 0, flex: 1, flexDirection: 'row', alignSelf: 'center'}}>
                        { buttonText }
                    </Button>
                </View>
            </View>
        );
    }
}

export { InputWithButton };