import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { QuantityChanger } from './common';
import FullCardView from './FullCardView';

import { executeTransaction } from '../services/SQLClient';

import { Colors, Fonts, FontSize } from '../constants';

interface Props {
    cardInfo: any
}

function CardThumb({ cardInfo }: Props) {
    const { width } = useWindowDimensions();

    const [showCardModal, setShowCardModal] = useState(false);
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
        <>
            <View style={{ ...styles.container, width: width / 2, height: width / 2, margin: 10 }}>
                <Pressable
                    style={ ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0, flex: 1 }] }
                    onPress={ () => setShowCardModal(!showCardModal) }
                >
                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                        <Text style={{ flex: 1, textAlign: 'center', fontFamily: Fonts.Standard, fontSize: FontSize.XLarge }}>
                            { cardInfo?.name }
                        </Text>
                    </View>
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
            <FullCardView
                isVisible={ showCardModal }
                cardInfo={ cardInfo }
                onHide={ () => setShowCardModal(false) }
                setQuantity={ setQuantity }
            />
        </>
    );
}

export default CardThumb;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.CardBack,
        borderRadius   : 10
    }
});
