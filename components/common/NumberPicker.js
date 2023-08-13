import React, { Component } from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CustomPicker from './CustomPicker';
import {ButtonStyles} from "../../../styles";
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome } from '@expo/vector-icons';
import Layout from '../../constants/Layout';

class NumberPicker extends Component {

    constructor(props) {
        super(props);

        this.numbers = [];

        for (let i = this.props.min || 0; i < this.props.max + 1; i++) {
            this.numbers.push(i);
        }

        this.props.save(this.props.field, this.props.value || this.numbers[0]);
    }

    render() {
        const { value, field, save } = this.props;
        const { numbers } = this;

        return (
            <View style={ButtonStyles.containerStyle}>
                {/*<CustomPicker
                    value={value ? [value] : null}
                    field={field}
                    onValueChange={save.bind(this)}
                    default={numbers[0]}>
                    {numbers.map(number => <Picker.Item key={number.toString()} label={number.toString()} value={number.toString()} />)}
                    </CustomPicker>*/}
                <RNPickerSelect
                    onValueChange={ save.bind(this) }
                    items={ numbers.map(num => (
                        { key: num.toString(), label: num.toString(), value: num.toString() }
                    )) }
                    value={ value ? [value] : null }
                    Icon={ () => <FontAwesome name="angle-down" size={ 18 } color="black" /> }
                    style={ Layout.pickerStyle }
                />
            </View>
        );
    }
}

export { NumberPicker };
