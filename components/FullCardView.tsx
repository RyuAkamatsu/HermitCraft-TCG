import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';

import { Text } from './common/Themed';
import { QuantityChanger } from './common';

import Colors from '../constants/Colors';
import { executeTransaction } from '../services/SQLClient';

interface Props {
    isVisible: boolean,
    cardInfo: any
    onHide: () => void
}

function FullCardView({ isVisible, cardInfo, onHide }: Props) {

    const [quantity, setQuantity] = useState(cardInfo.Quantity);

    useEffect(() => {
        async function updateDBQuantity() {
            await executeTransaction('UPDATE myCollection SET cardQuantity = ? WHERE id = ?', [cardInfo.Quantity, cardInfo.Id]);
        }
        updateDBQuantity();
    }, [quantity]);

    const quantityChanger = useMemo(() => (
        <QuantityChanger
            quantity={ quantity }
            min={ 0 }
            onChange={ (value:number) => setQuantity(value) }
        />
    ), [quantity]);

    return (
        <Modal
            isVisible={ isVisible }
            backdropOpacity={ 0.4 }
            onBackdropPress={ onHide }
        >
            <View style={ styles.container }>
                <Text>{ cardInfo.Name }</Text>
                <Image
                    source={{ uri: cardInfo.uri }}
                    style={ [
                        styles.imageStyle,
                        { opacity: cardInfo.quantity > 0 ? 1 : 0.7 }
                    ] }
                />
                { quantityChanger }
            </View>
        </Modal>
    );
}

export default FullCardView;

const styles = StyleSheet.create({
    container: {
        flex           : 1,
        backgroundColor: Colors.Grey50
    },
    imageStyle: {

    }
});
