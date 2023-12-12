import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { QuantityChanger } from './common';
import FullCardView from './FullCardView';

import { executeTransaction } from '../services/SQLClient';

import { Colors } from '../constants';

interface Props {
    cardInfo: any,
    showCardModal: boolean,
    setShowCardModal: (showModal: boolean) => void
}

function CardThumb({ cardInfo, showCardModal, setShowCardModal }: Props) {
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
        <View style={ styles.container }>
            <Pressable
                style={ ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }] }
                onPress={ () => setShowCardModal(!showCardModal) }
            >
                <Text>{ cardInfo?.name }</Text>
                {/* <Image
                    source={{ uri: cardInfo.uri }}
                    style={ [
                        styles.imageStyle,
                        { opacity: cardInfo.numberOwned > 0 ? 1 : 0.7 }
                    ] }
                /> */}
            </Pressable>
            { quantityChanger }
        </View>
    );
}

export default CardThumb;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.Grey50
    },
    imageStyle: {

    }
});
