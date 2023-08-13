import React, { useEffect, useState } from 'react';
import { Text, View, Platform, TouchableOpacity } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button } from '.';
import { Nullable } from '../../slices/types';
import { Fonts, FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';

interface Props {
    field: string,
    maxDate: Date,
    value: string,
    save: (field: string, dateState: Date) => void
}

export default function DateTime({ field, maxDate, value, save }: Props) {

    const isAndroid = Platform.OS === 'android';

    const [dateState, setDateState] = useState(value ? new Date(value) : new Date());
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        save(field, dateState);
    }, [dateState]);

    function setDate(date: Date) {
        if (isAndroid) {
            setModalVisible(false);
        }

        if (date) {
            setDateState(date);
        }
    }

    function formatDate(date: Nullable<Date>) {
        if (!date) {
            return 'DD-MM-YYYY';
        }

        if (isAndroid) {
            moment.locale('en');
            return moment(date).format('DD MMMM YYYY');
        }

        return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function toggleModal() {
        const newModalState = !modalVisible;

        setModalVisible(newModalState);

        if (!newModalState && !dateState) {
            setDate(new Date());
        }
    }

    function dateTimePicker() {
        if (!modalVisible) {
            return null;
        }

        return (
            <DateTimePicker
                mode="date"
                value={ dateState }
                onChange={ (event: any, date: any) => setDate(date) }
                maximumDate={ maxDate || new Date() }
            />
        );
    }

    return (
        <TouchableOpacity style={ styles.dateContainer } onPress={ () => toggleModal() }>
            <Text style={ styles.chosenDateText }>{ formatDate(dateState) }</Text>
            <FontAwesome5 name="chevron-down" size={ 18 } style={ styles.datePickerIcon } />
            { isAndroid ?
                dateTimePicker() :
                (
                    <Modal isVisible={ modalVisible } onBackdropPress={ () => toggleModal() }>
                        <View style={{ backgroundColor: 'white', height: 'auto' }}>
                            { dateTimePicker() }
                            <View style={{ margin: 10 }}>
                                <Button onPress={ () => toggleModal() } upperCase={ false }>Save</Button>
                            </View>
                        </View>
                    </Modal>
                ) }
        </TouchableOpacity>
    );
}

const styles = {
    dateContainer: {
        borderWidth    : 2,
        borderColor    : Colors.Grey40,
        paddingVertical: 5,
        marginVertical : 5
    },
    chosenDateText: {
        paddingVertical  : 8,
        paddingHorizontal: 10,
        paddingRight     : 22,
        fontFamily       : Fonts.Standard,
        fontSize         : FontSize.Tiny,
        color            : Colors.Grey40
    },
    datePickerIcon: {
        position: 'absolute',
        top     : '40%',
        right   : 15,
        color   : Colors.PrimaryColor
    },
    pickerStyle: {
        width    : '100%',
        height   : 34,
        minHeight: 34,
        color    : 'black'
    },
    itemStyle: {
        height    : '100%',
        flex      : 1,
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium,
        color     : Colors.PrimaryColor
    }
};
