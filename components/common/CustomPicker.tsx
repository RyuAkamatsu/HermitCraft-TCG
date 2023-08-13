import React, { useEffect, useState } from 'react';
import { Text, View, Platform, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { CustomPicker as CPicker } from 'react-native-custom-picker';
import { flatten, flattenDeep, get } from 'lodash';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import { Fonts, FontSize } from '../../constants/Fonts';

interface Props {
    placeholder?: string
    value?: any,
    defaultVal?: { value: any } | any,
    onChange: (selectedValue: any) => void
    children: any
}

function CustomPicker({ placeholder, value, defaultVal, onChange, children }: Props) {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    const pickerOptions = flattenDeep(children).map(
        (child: { props: { value: any; label: any; }; }) => ({ value: child.props.value, label: child.props.label })
    );

    useEffect(() => {
        let selectedVal = null;

        if (value) {
            selectedVal = Array.isArray(value) ? value[0] : value;
        } else if (defaultVal) {
            selectedVal = typeof defaultVal === 'object' ? defaultVal.value : defaultVal;
        }

        setSelectedValue(selectedVal);
    }, []);

    useEffect(() => {
        if (onChange) {
            onChange(selectedValue);
        }
    }, [selectedValue]);

    function renderAndroid() {
        function getLabel(item: any) {
            return get(pickerOptions.find((opt: { value: any; }) => opt.value === item), 'label');
        }

        // Render the actual field on the page
        function renderField(settings: { selectedItem: any; }) {
            const { selectedItem } = settings;
            let label = getLabel(selectedItem);

            if (!label) {
                if (placeholder) {
                    label = placeholder;
                } else {
                    label = 'Select an option...';
                }
            }

            return (
                <View style={ styles.pickerFieldContainer }>
                    <Text numberOfLines={ 1 } style={ styles.pickerFieldText }>{ label }</Text>
                    <FontAwesome name="angle-down" size={ 18 } color="black" style={ styles.imagePicker } />
                </View>
            );
        }

        function renderOption(settings: { item: any; getLabel: any; }) {
            const { item, getLabel } = settings;
            const { pickerOptionContainer, pickerOptionText } = styles;

            return (
                <View style={ pickerOptionContainer }>
                    <Text style={ pickerOptionText }>{getLabel(item)}</Text>
                </View>
            );
        }

        return (
            <CPicker
                options={ pickerOptions.map((opt: { value: any; }) => opt.value) }
                modalStyle={{ width: '85%', alignSelf: 'center' }}
                containerStyle={ styles.pickerContainer }
                getLabel={ item => getLabel(item) } // Find the picker value in pickerOptions array and return its label
                fieldTemplate={ renderField }
                optionTemplate={ renderOption }
                value={ selectedValue }
                defaultValue={ selectedValue }
                onValueChange={ v => setSelectedValue(v) }
            />
        );
    }

    function renderIOS() {
        const childProps = flatten(children);

        let label = get(childProps.find((c: { props: { value: null; }; }) => c.props.value === selectedValue), 'props.label');

        if (!label) {
            if (placeholder) {
                label = placeholder;
            } else {
                label = 'Select an option...';
            }
        }

        // This is primarily used to enable selection of the first item in a list. It fixes a bug where
        // you were previously unable to load the picker modal and just press 'Done' to select the first item.
        function handleDone() {
            if (!selectedValue) {
                setSelectedValue(children[0].props.value);
            }
            setModalVisible(false);
        }

        return (
            <View style={ styles.pickerContainer }>
                <Pressable
                    onPress={ () => setModalVisible(true) }
                    style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1, flexDirection: 'row', justifyContent: 'space-between' }) }
                >
                    <Text style={ styles.iosPickerText } numberOfLines={ 1 }>{ label }</Text>
                    <FontAwesome name="angle-down" size={ 18 } color="black" style={ styles.imagePicker } />
                </Pressable>
                <Modal isVisible={ modalVisible }>
                    <View style={{ backgroundColor: 'white', height: '40%' }}>
                        <Text style={ styles.buttonStyle } onPress={ () => handleDone() }>Done</Text>
                        <Picker
                            style={{ ...styles.pickerStyle, height: '100%' }}
                            itemStyle={ styles.itemStyle }
                            selectedValue={ selectedValue }
                            mode="dropdown"
                            onValueChange={ v => setSelectedValue(v) }
                        >
                            { children }
                        </Picker>
                    </View>
                </Modal>
            </View>
        );
    }

    return (
        <View>
            { Platform.OS === 'android' ? renderAndroid() : renderIOS() }
        </View>
    );
}

export { CustomPicker };


const styles = {
    pickerContainer: {
        borderWidth    : 2,
        borderColor    : Colors.Grey50,
        paddingVertical: 5,
        marginVertical : 5,
        minWidth       : 75
    },

    imagePicker: {
        marginRight: 8,
        zIndex     : 90,
        alignSelf  : 'center'
    },
    pickerFieldContainer: {
        justifyContent: 'space-between',
        flexDirection : 'row'
    },
    pickerFieldText: {
        marginVertical: 8,
        marginLeft    : 10,
        marginRight   : 28,
        fontFamily    : Fonts.Standard,
        color         : Colors.TextColor
    },
    pickerOptionContainer: { margin: 15 },
    pickerOptionText     : {
        fontSize  : FontSize.Tiny,
        fontFamily: Fonts.Standard,
        color     : Colors.TextColor
    },

    pickerStyle: {
        width    : '100%',
        height   : 34,
        minHeight: 34,
        color    : 'black'
    },
    iosPickerText: {
        paddingVertical  : 8,
        paddingHorizontal: 10,
        paddingRight     : 22,
        fontFamily       : Fonts.Standard,
        fontSize         : FontSize.Tiny,
        color            : Colors.TextColor
    },
    itemStyle: {
        height    : '100%',
        flex      : 1,
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium,
        color     : Colors.TextColor
    },
    buttonStyle: {
        textAlign   : 'right',
        color       : Colors.ButtonColor,
        paddingTop  : 10,
        paddingRight: 10,
        fontFamily  : Fonts.Standard,
        fontSize    : FontSize.Medium,
    }
};
