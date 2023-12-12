import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { QuantityChanger } from './common';

import { executeTransaction } from '../services/SQLClient';

import { Colors } from '../constants';

interface Props {
    isVisible: boolean,
    cardInfo: any
    onHide: () => void
}

function FullCardView({ isVisible, cardInfo, onHide }: Props) {
    const [quantity, setQuantity] = useState(cardInfo?.numberOwned | 0);

    useEffect(() => {
        async function updateDBQuantity() {
            await executeTransaction('UPDATE cards SET numberOwned = ? WHERE id = ?', [quantity, cardInfo?.id]);
        }

        if (quantity !== cardInfo.numberOwned) {
            updateDBQuantity();
        }
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
                <Text>{ cardInfo.name }</Text>
                {/* <Image
                    source={{ uri: cardInfo.uri }}
                    style={ [
                        styles.imageStyle,
                        { opacity: cardInfo.quantity > 0 ? 1 : 0.7 }
                    ] }
                /> */}
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
