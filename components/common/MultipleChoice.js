import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Fonts, FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';

/**         COMPONENT PROPS
 * oneOption    - If true, only one selection is allowed
 * field        - The field that this multiple choice will be saved to in the JSON structure.
 * options      - The JSON structure to construct the options. ExpectingL ('text' - string, 'value' - string, 'selected' - bool).
 * save         - The parent component's save method. Returns an array of the strings of 'value' where 'selected' is true.
 */
class MultipleChoice extends Component {

    constructor(props) {
        super(props);

        let selectedValue = [];
        if (this.props.values) {
            selectedValue = this.props.values.map(val => this.props.options.find(o => o.value === val));
        } else if (this.props.options.find(o => o.default)) {
            selectedValue = [this.props.options.find(o => o.default)];
        }

        this.state = {
            options: this.props.options,
            selected: selectedValue
        };
    }

    makeSelection(val) {
        let {selected, options} = this.state;

        //Get the option that was chosen
        let option = options.find(o => o.value === val);

        //If option is already selected
        if (this.state.selected.includes(option)) {
            //Remove it from the selected array
            this.setState({selected: selected.filter(s => s.value !== option.value)}, () => {
                //Save to parent component
                this.props.save(this.props.field, this.state.selected.map(s => s.value));
            });
        } else {
            //If one option only, clear the selected array to ensure only the chosen option is added
            if (this.props.oneOption) {
                selected = [];
            }
            //Add chosen option to the selected array
            this.setState({selected: [...selected, option]}, () => {
                //Save to parent component
                this.props.save(this.props.field, this.state.selected.map(s => s.value));
            });
        }
    }

    render() {
        return (
            <View>
                {this.state.options.map((option, i) => {
                    let selectedValue = this.state.selected.find(s => s.value === option.value);
                    if (selectedValue) {
                        return (
                            <TouchableOpacity key={i} style={{...styles.multipleChoiceOption, ...styles.selectedOption}} onPress={() => this.makeSelection(option.value)}>
                                <Text style={{...styles.optionText, ...styles.selectedOptionText}}>{option.display}</Text>
                            </TouchableOpacity>
                        )
                    } else {
                        return (
                            <TouchableOpacity key={i} style={styles.multipleChoiceOption} onPress={() => this.makeSelection(option.value)}>
                                <Text style={styles.optionText}>{option.display}</Text>
                            </TouchableOpacity>
                        )
                    }
                })}
            </View>
        )
    }
}

export { MultipleChoice };

const styles = {
    multipleChoiceOption: {
        backgroundColor: 'white',
        marginVertical: 5,
        borderWidth: 2,
        borderColor: Colors.Grey50

    },
    optionText: {
        paddingVertical: 10,
        textAlign: 'center',
        fontFamily: Fonts.Standard,
        fontSize: FontSize.Small,
        color: Colors.TextColor
    },
    selectedOption: {
        backgroundColor: Colors.ButtonColor,
        borderColor    : Colors.Grey40
    },
    selectedOptionText: {
        color: 'white'
    }
};
