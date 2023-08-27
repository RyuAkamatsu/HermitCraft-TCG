import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { PressableButton } from './index';
import { Text } from './Themed';

interface Props {
    quantity: number,
    onChange: (value:number) => void,
    min?: number,
    max?: number,
    step?: number,
    style?: any
}

function QuantityChanger(props: Props) {

    const { min = 0, max = 999, step = 1 } = props;

    const [quantity, setQuantity] = useState(props.quantity);

    useEffect(() => {
        if (props.onChange) {
            props.onChange(quantity);
        }
    }, [quantity]);

    function changeQuantity(delta: number) {
        const newQuantity = quantity + delta;

        if (newQuantity >= min && newQuantity <= max) {
            setQuantity(newQuantity);
        }
    }

    return (
        <View style={ styles.container }>
            <PressableButton
                onPress={ () => changeQuantity(-step) }
                disabled={ quantity === min }
            >
                <FontAwesome5
                    name="minus"
                    size={ 30 }
                    color="white"
                />
            </PressableButton>
            <Text>{ quantity }</Text>
            <PressableButton
                onPress={ () => changeQuantity(step) }
                disabled={ quantity === max }
            >
                <FontAwesome5
                    name="plus"
                    size={ 30 }
                    color="white"
                />
            </PressableButton>
        </View>
    );
}

export default QuantityChanger;

const styles = StyleSheet.create({
    container: {
        flexDirection : 'row',
        marginVertical: 10,
        gap           : 5
    }
});
