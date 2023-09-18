import React, { useEffect, useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { Colors, Fonts, FontSize } from '../../constants';

interface Props {
    options: {
        text: string,
        value: string | number,
        default?: boolean
    }[],
    values: string[] | number[],
    layout: 'List' | 'Checkboxes',
    oneOption?: boolean,
    save: (values: any[]) => void
}

function MultipleChoice({ options, values = [], layout = 'List', oneOption = false, save }: Props) {

    const initialVal = values.length > 0 ?
        values :
        options.filter(opt => opt.default).map(opt => opt.value);

    const [selectedValues, setSelectedValues] = useState<string[]>(initialVal);

    useEffect(() => {
        if (save) {
            save(selectedValues);
        }
    }, [selectedValues]);

    function makeSelection(val: string) {
        if (selectedValues.includes(val)) {
            const idx = selectedValues.findIndex(selectedVal => selectedVal === val);
            setSelectedValues(selectedValues.splice(idx, 1));
        } else if (oneOption) {
            setSelectedValues([val]);
        } else {
            setSelectedValues([...selectedValues, val]);
        }
    }

    if (layout === 'List') {
        return (
            <View style={ styles.boxesContainer }>
                {
                    options.map(opt => (
                        <TouchableOpacity
                            key={ opt.value }
                            onPress={ () => makeSelection(opt.value) }
                            style={ [
                                styles.multipleChoiceOption,
                                selectedValues.indexOf(opt.value) > -1 ? styles.selectedOption : {}
                            ] }
                        >
                            <Text style={ styles.optionText }>{opt.text}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        );
    }

    if (layout === 'Checkboxes') {
        return (
            <View style={ styles.checkboxesContainer }>
                {
                    options.map(opt => (
                        <Pressable
                            onPress={ () => makeSelection(opt.value) }
                            style={{ flex: 1, flexDirection: 'row', margin: 5, gap: 10 }}
                        >
                            <Checkbox
                                style={{ margin: 8, padding: 10 }}
                                value={ selectedValues.includes(opt.value) }
                                color={ selectedValues.includes(opt.value) ? '#4630EB' : undefined }
                            />
                            <Text style={ styles.optionText }>{ opt.text }</Text>
                        </Pressable>
                    ))
                }
            </View>
        );
    }

    return null;
}

export default MultipleChoice;

const styles = {
    boxesContainer: {

    },
    checkboxesContainer: {
        flex: 1,
    },
    multipleChoiceOption: {
        backgroundColor: 'white',
        marginVertical : 5,
        borderWidth    : 2,
        borderColor    : Colors.Grey50,
        alignItems     : 'center'
    },
    optionText: {
        paddingVertical: 10,
        fontFamily     : Fonts.Standard,
        fontSize       : FontSize.Large,
        color          : Colors.TextColor
    },
    selectedOption: {
        backgroundColor: Colors.ButtonColor,
        borderColor    : Colors.Grey40
    },
    selectedOptionText: { color: 'white' }
};
