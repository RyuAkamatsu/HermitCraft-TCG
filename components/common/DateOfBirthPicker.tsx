import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome } from '@expo/vector-icons';
import { CustomPicker } from './CustomPicker';
import { Nullable } from '../../slices/types';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface Props {
    dateVal: Nullable<Date>,
    minAge: number,
    onChange: (value: Date) => void
}

function DateOfBirthPicker({ dateVal, minAge, onChange }: Props) {

    const minYear = new Date().getFullYear() - minAge;

    const dates = [...Array(31).keys()].map(i => i + 1);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const years: number[] = [];
    for (let i = minYear; i >= 1900; i--) { years.push(i); }

    const [date, setDate] = useState<Nullable<number>>(null);
    const [month, setMonth] = useState<Nullable<number>>(null);
    const [year, setYear] = useState<Nullable<number>>(null);

    useEffect(() => {
        if (onChange && date !== null && month !== null && year !== null) {
            const dateValue = new Date(year, month, date);
            onChange(dateValue);
        }
    }, [date, month, year]);

    return (
        <View style={ styles.containerStyle }>
            {/* <CustomPicker
                value={ dateVal?.getDate() ?? null }
                placeholder="Date"
                onChange={ (v: number) => setDate(v) }
            >
                { dates.map(d => (
                    <Picker.Item
                        key={ d.toString() }
                        label={ d.toString() }
                        value={ d }
                    />
                )) }
            </CustomPicker> */}
            <RNPickerSelect
                onValueChange={ (v: number) => setDate(v) }
                items={ dates.map(d => (
                    { key: d.toString(), label: d.toString(), value: d }
                )) }
                placeholder={{ label: 'Date', value: null }}
                value={ dateVal?.getDate() ?? date }
                Icon={ () => <FontAwesome name="angle-down" size={ 18 } color="black" /> }
                style={ Layout.pickerStyle }
            />

            {/* <CustomPicker
                value={ dateVal?.getMonth() ?? null }
                placeholder="Month"
                onChange={ (v: number) => setMonth(v) }
            >
                { months.map((m, i) => (
                    <Picker.Item
                        key={ m }
                        label={ m }
                        value={ i }
                    />
                )) }
            </CustomPicker> */}
            <RNPickerSelect
                onValueChange={ (v: number) => setMonth(v) }
                items={ months.map((m, i) => (
                    { key: m.substring(0,3), label: m, value: i }
                )) }
                placeholder={{ label: 'Month', value: null }}
                value={ dateVal?.getMonth() ?? month }
                Icon={ () => <FontAwesome name="angle-down" size={ 18 } color="black" /> }
                style={ Layout.pickerStyle }
            />

            {/* <CustomPicker
                value={ dateVal?.getFullYear() ?? null }
                placeholder="Year"
                onChange={ (v: number) => setYear(v) }
            >
                { years.map(y => (
                    <Picker.Item
                        key={ y.toString() }
                        label={ y.toString() }
                        value={ y }
                    />
                )) }
            </CustomPicker> */}
            <RNPickerSelect
                onValueChange={ (v: number) => setYear(v) }
                items={ years.map((y: number) => (
                    { key: y.toString(), label: y.toString(), value: y }
                )) }
                placeholder={{ label: 'Year', value: null }}
                value={ dateVal?.getFullYear() ?? year }
                Icon={ () => <FontAwesome name="angle-down" size={ 18 } color="black" /> }
                style={ Layout.pickerStyle }
            />

        </View>
    );
}

export { DateOfBirthPicker };

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        gap          : 10
    }
});
