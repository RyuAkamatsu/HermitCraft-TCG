import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { QuantityChanger } from './common';

import { executeTransaction } from '../services/SQLClient';

import { Colors, Fonts, FontSize } from '../constants';

interface Props {
    isVisible: boolean,
    cardInfo: any
    onHide: () => void,
    setQuantity: (value: number) => void
}

function FullCardView({ isVisible, cardInfo, onHide, setQuantity }: Props) {
    let quantity = cardInfo?.numberOwned | 0;

    useEffect(() => {
        quantity = cardInfo?.numberOwned | 0;
    }, [cardInfo?.numberOwned]);

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
                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <Text style={{ flex: 1, textAlign: 'center', fontFamily: Fonts.Standard, fontSize: FontSize.Exclamation }}>
                        { cardInfo?.name }
                    </Text>
                </View>
                {/* <Image
                    source={{ uri: cardInfo.uri }}
                    style={ [
                        styles.imageStyle,
                        { opacity: cardInfo.quantity > 0 ? 1 : 0.7 }
                    ] }
                /> */}
                <View>
                    
                </View>
                { quantityChanger }
            </View>
        </Modal>
    );
}

export default FullCardView;

const styles = StyleSheet.create({
    container: {
        flex           : 1,
        backgroundColor: Colors.CardBack,
        margin: 10
    },
    imageStyle: {

    }
});
