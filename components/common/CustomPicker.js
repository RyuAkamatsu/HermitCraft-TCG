import React, { Component } from 'react';
import { Text, View, Platform, Image } from "react-native";
import {Picker} from '@react-native-community/picker';
import Modal from 'react-native-modal';
import { CustomPicker as CPicker } from 'react-native-custom-picker';
import { PICKER_ICON } from '../../../../assets/images';
import _ from 'lodash';
import { Fonts, FontSize, Colors } from "../../../styles";

export default class CustomPicker extends Component {

    constructor(props) {
        super(props);

        let selectedValue = null;

        if (this.props.value && Array.isArray(this.props.value)) {
            selectedValue = this.props.value[0];
        } else if (this.props.default) {
            selectedValue = typeof this.props.default === "object" ? this.props.default.value : this.props.default;
        }

        this.state = {
            isModalVisible: false,
            selectedValue
        };
    }

    componentDidMount() {
        if (this.state.selectedValue) {
            this.props.onValueChange(this.props.field, this.state.selectedValue);
        }
    }


    onChange(field, value) {
        if (value !== this.state.selectedValue) {
            this.setState({selectedValue: value}, () => {
                this.props.onValueChange(field, value);
            });
        }
    }

    //Render each option in the picker modal
    renderOption(settings) {
        const { item, getLabel } = settings;
        let { pickerOptionContainer, pickerOptionText } = styles;

        return (
            <View style={pickerOptionContainer}>
                <Text style={pickerOptionText}>{getLabel(item)}</Text>
            </View>
        );
    }

    //Render the actual field on the page
    renderField(settings) {
        const { selectedItem, getLabel } = settings;
        let { imagePicker, pickerFieldContainer, pickerFieldText } = styles;
        let label = getLabel(selectedItem);

        if (!label) {
            label = "Select an option...";
        }

        return (
            <View style={pickerFieldContainer}>
                <Text numberOfLines={1} style={pickerFieldText}>{label}</Text>
                <Image style={{...imagePicker, top: 13}} source={PICKER_ICON} />
            </View>
        )
    }

    getLabel(item) {
        let pickerOptions = _.map(_.flattenDeep(this.props.children), (child => {
            return {value: child.props.value, label: child.props.label};
        }));

        return _.get(_.find(pickerOptions, opt => opt.value === item), 'label');
    }

    //This is primarily used to enable selection of the first item in a list. It fixes a bug where
    //you were previously unable to load the picker modal and just press 'Done' to select the first item. 
    handleDone() {
        if (!this.state.selectedValue) {
            this.setState({isModalVisible: false, selectedValue: this.props.children[0].props.value}, () => {
                this.props.onValueChange(this.props.field, this.state.selectedValue);
            });
        } else {
            this.setState({isModalVisible: false});
        }
    }

    renderPicker() {
        let { pickerStyle, imagePicker, iosPickerText } = styles;
        if (Platform.OS === 'android') {
            //Get the values for the picker
            let pickerValues = _.map(_.flattenDeep(this.props.children), (child => child.props.value));

            return (
                <CPicker
                    options={pickerValues}
                    modalStyle={{width: '85%', alignSelf: 'center'}}
                    containerStyle={styles.pickerContainer}
                    getLabel={item => this.getLabel(item)} //Find the picker value in pickerOptions array and return its label
                    fieldTemplate={this.renderField}
                    optionTemplate={this.renderOption}
                    value={this.state.selectedValue}
                    defaultValue={this.state.selectedValue}
                    onValueChange={value => value && this.onChange(this.props.field, value)} />
            )
        } else {
            const children = _.flatten(this.props.children);
            const name = _.get(_.find(children, c => c.props.value === this.state.selectedValue), 'props.label');

            return (
                <View style={styles.pickerContainer}>
                    <Text style={iosPickerText} onPress={() => this.setState({isModalVisible: true})} numberOfLines={1}>{name || "Select an option..."}</Text>
                    <Image style={imagePicker} source={PICKER_ICON} />
                    <Modal isVisible={this.state.isModalVisible}>
                        <View style={{backgroundColor: 'white', height: '40%'}}>
                            <Text style={styles.buttonStyle} onPress={() => this.handleDone()}>Done</Text>
                            <Picker
                                style={{...pickerStyle, height: '100%'}}
                                itemStyle={styles.itemStyle}
                                selectedValue={this.state.selectedValue}
                                mode={'dropdown'}
                                onValueChange={value => this.onChange(this.props.field, value)}>

                                {this.props.children}

                            </Picker>
                        </View>
                    </Modal>
                </View>
            )
        }
    }

    toggleModal() {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    render() {
        return (
            <View>
                {this.renderPicker()}
            </View>
        )
    }
}

const styles = {
    pickerStyle: {
        width: '100%',
        height: 34,
        minHeight: 34,
        color: 'black'
    },
    imagePicker: {
        height: 12,
        width: 12,
        position: 'absolute',
        top: 18,
        right: 15,
        zIndex: 90
    },
    iosPickerText: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        paddingRight: 22,
        fontFamily: Fonts.Standard,
        fontSize: FontSize.Tiny,
        color: Colors.MainColour
    },
    pickerFieldContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    pickerFieldText: {
        marginVertical: 8,
        marginLeft: 10,
        marginRight: 28,
        fontFamily: Fonts.Standard,
        color: Colors.MainColour
    },
    pickerOptionContainer: {
        margin: 15
    },
    pickerOptionText: {
        fontSize: FontSize.Tiny,
        fontFamily: Fonts.Standard,
        color: Colors.MainColour
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.MainColour,
        paddingVertical: 5,
        marginVertical: 5
    },
    itemStyle: {
        height: '100%',
        flex: 1,
        fontFamily: Fonts.Standard,
        fontSize: FontSize.Medium,
        color: Colors.MainColour
    },
    buttonStyle: {
        textAlign: "right",
        color: Colors.ButtonColour,
        paddingTop: 10,
        paddingRight: 10,
        fontFamily: Fonts.Standard,
        fontSize: FontSize.Medium,
    }
};