import React, { Component } from 'react';
import {Text, View, DatePickerAndroid, Platform, TouchableOpacity, Image} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Fonts, FontSize, Colors} from "../../../styles";
import { Button } from '.';
import {PICKER_ICON} from "../../../../assets/images";
import Modal from 'react-native-modal';

export default class DateTime extends Component {

    constructor(props) {
        super(props);

        this.datePicker = null;

        this.state = {
            date: this.props.value ? new Date(this.props.value) : null,
            modalVisible: false
        };

        this.props.save(this.props.field, this.state.date);
    }

    setDate(date) {
        const isAndroid = Platform.OS === 'android';
        if (!date && isAndroid) {
            return this.setState({modalVisible: false});
        }

        if (isAndroid) {
            this.setState({date, modalVisible: false});
        } else {
            this.setState({date});
        }
        this.props.save(this.props.field, date);
    }

    formatDate(date) {
        if (!date) {
            return "DD-MM-YYYY";
        }

        if (Platform.OS === 'android') {
            moment.locale('en');
            return moment(date).format('DD MMMM YYYY')
        }
        else {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString("en-GB", options);
        }

    }

    async handleAndroidDate() {
        const {action, year, month, day} = await DatePickerAndroid.open({
            date: this.state.date || new Date(),
            maxDate: this.props.maxDate && typeof this.props.maxDate !== "string" ? this.props.maxDate : new Date()
        });

        if (action !== DatePickerAndroid.dismissedAction) {
            const date = new Date(year, month, day);
            this.setState({date});
            this.props.save(this.props.field, date);
        }
    }

    toggleModal() {
        this.setState({modalVisible: !this.state.modalVisible}, () => {
            if (!this.state.modalVisible && !this.state.date) {
                this.setDate(new Date());
            }
        });
    }

    renderDatePicker() {

        if (Platform.OS === 'android') {
            return (
                <TouchableOpacity style={styles.dateContainer} onPress={() => this.toggleModal()}>
                    <Text style={styles.chosenDateText}>{this.formatDate(this.state.date)}</Text>
                    <Image style={styles.datePickerIcon} source={PICKER_ICON} />
                    {this.state.modalVisible && (
                        <DateTimePicker
                            mode={"date"}
                            value={this.state.date || new Date()}
                            onChange={(event, date) => this.setDate(event, date)}
                            maximumDate={this.props.maxDate && typeof this.props.maxDate !== "string" ? this.props.maxDate : new Date()}
                        />
                    )}
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={styles.dateContainer} onPress={() => this.toggleModal()}>
                    <Text style={styles.chosenDateText}>{this.formatDate(this.state.date)}</Text>
                    <Image style={styles.datePickerIcon} source={PICKER_ICON} />
                    <Modal isVisible={this.state.modalVisible} onBackdropPress={() => this.toggleModal()}>
                        <View style={{backgroundColor: 'white', height: 'auto'}}>
                            {this.state.modalVisible && (
                                <DateTimePicker
                                    mode={"date"}
                                    value={this.state.date || new Date()}
                                    onChange={(event, date) => this.setDate(date)}
                                    maximumDate={this.props.maxDate && typeof this.props.maxDate !== "string" ? this.props.maxDate : new Date()}
                                />
                            )}
                            <View style={{margin: 10}}>
                                <Button onPress={() => this.toggleModal()} upperCase={false}>Save</Button>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
            );
        }
    }

    render() {
        return (
            <View>
                {this.renderDatePicker()}
            </View>
        )
    }
}

const styles = {
    dateContainer: {
        borderWidth: 1,
        borderColor: Colors.MainColour,
        paddingVertical: 5,
        marginVertical: 5
    },
    chosenDateText: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        paddingRight: 22,
        fontFamily: Fonts.Standard,
        fontSize: FontSize.Tiny,
        color: Colors.MainColour
    },
    datePickerIcon: {
        height: 12,
        width: 12,
        position: 'absolute',
        top: 18,
        right: 15
    },
    pickerStyle: {
        width: '100%',
        height: 34,
        minHeight: 34,
        color: 'black'
    },
    itemStyle: {
        height: '100%',
        flex: 1,
        fontFamily: Fonts.Standard,
        fontSize: FontSize.Medium,
        color: Colors.MainColour
    }
};
