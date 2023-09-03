import React, { useState } from 'react';
import { FlatList, SectionList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { useFocusEffect } from '@react-navigation/native';

import { CardThumb, SortButton } from '../../components';
import { SwitchBlock } from '../../components/common';

import { RootTabScreenProps } from '../../navigation/types';
import { executeTransaction } from '../../services/SQLClient';

interface ListProps {
    sortItems: { label: string, value: string }[],
    sortVal: string,
    sortCallback: (val: string) => void,
    listItems: any[],
    styles: any
}

const numColumns = 3;

const renderSection = (data) => (
    <View>
        <Text>{ data.text }</Text>
    </View>
);

const renderSectionItem = ({ section, index }) => {

    if (index % numColumns !== 0) return null;

    const items = [];

    for (let i = index; i < index + numColumns; i++) {
        if (i >= section.data.length) {
            break;
        }

        items.push(
            <View>
                <CardThumb
                    cardInfo={ section.data[i] }
                />
            </View>
        );
    }

    return (
        <View
            style={{
                flexDirection : 'row',
                justifyContent: 'space-between'
            }}
        >
            {items}
        </View>
    );
};

// @ts-ignore
const renderItem = ({ item }) => (
    <View>
        <CardThumb
            cardInfo={ item }
        />
    </View>
);

function ListLayout({ sortItems, sortVal, sortCallback, listItems, styles }: ListProps) {
    return (
        <View>
            <SortButton
                sortVal={ sortVal }
                onChange={ (value: string) => sortCallback(value) }
                items={ sortItems }
            />
            { sortVal === 'rarity' ? (
                <SectionList
                    sections={ listItems }
                    style={ styles.container }
                    renderItem={ renderSectionItem }
                    renderSectionHeader={ renderSection }
                />
            ) : (
                <FlatList
                    data={ listItems }
                    renderItem={ renderItem }
                    numColumns={ numColumns }
                    keyExtractor={ item => item.id }
                />
            )}

        </View>
    );
}

function Collection({ navigation }: RootTabScreenProps<'MyCollection'>) {

    const layout = useWindowDimensions();

    const [showOwnedOnly, setShowOwnedOnly] = useState(false);

    const [hermitData, setHermitData] = useState([]);
    const [hermitSort, setHermitSort] = useState('name');

    const [effectData, setEffectData] = useState([]);
    const [effectSort, setEffectSort] = useState('name');

    const [itemData, setItemData] = useState([]);
    const [itemSort, setItemSort] = useState('name');

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'hermits', title: 'Hermits' },
        { key: 'effects', title: 'Effects' },
        { key: 'items', title: 'Items' },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'hermits':
                return (
                    <View style={{ flex: 1, backgroundColor: '#ff4081' }}>
                        <ListLayout
                            sortVal={ hermitSort }
                            sortItems={ [
                                { label: 'Name', value: 'name' },
                                { label: 'Rarity', value: 'rarity' }
                            ] }
                            sortCallback={ (value: string) => setHermitSort(value) }
                            listItems={ hermitData }
                            styles={ styles }
                        />
                    </View>
                );
            case 'effects':
                return (
                    <View style={{ flex: 1, backgroundColor: '#673ab7' }}>
                        <ListLayout
                            sortVal={ effectSort }
                            sortItems={ [
                                { label: 'Name', value: 'name' },
                                { label: 'Rarity', value: 'rarity' },
                                { label: 'Tags', value: 'tags' }
                            ] }
                            sortCallback={ (value: string) => setEffectSort(value) }
                            listItems={ effectData }
                            styles={ styles }
                        />
                    </View>
                );
            case 'items':
                return (
                    <View style={{ flex: 1, backgroundColor: '#a7a0a0' }}>
                        <ListLayout
                            sortVal={ itemSort }
                            sortItems={ [
                                { label: 'Name', value: 'name' },
                                { label: 'Rarity', value: 'rarity' },
                                { label: 'Tags', value: 'tags' }
                            ] }
                            sortCallback={ (value: string) => setItemSort(value) }
                            listItems={ itemData }
                            styles={ styles }
                        />
                    </View>
                );
            default:
                return null;
        }
    };


    useFocusEffect(() => {
        async function getData() {
            const collectionData = await executeTransaction(
                'SELECT * FROM cards INNER JOIN myCollection ON myCollection.cardId = cards.id',
                []
            );

            const cardArray = collectionData.rows._array;

            setHermitData(cardArray.filter(
                (card: { cardType: string; cardQuantity: number; }) => card.cardType === 'Hermit' && (!showOwnedOnly || card.cardQuantity > 0)
            ));
            setEffectData(cardArray.filter(
                (card: { cardType: string; cardQuantity: number; }) => card.cardType === 'Effect' && (!showOwnedOnly || card.cardQuantity > 0)
            ));
            setItemData(cardArray.filter(
                (card: { cardType: string; cardQuantity: number; }) => card.cardType === 'Item' && (!showOwnedOnly || card.cardQuantity > 0)
            ));
        }
        getData();
    });

    return (
        <View>
            <View>
                <SwitchBlock
                    label="Only show owned"
                    enabled={ showOwnedOnly }
                    callback={ () => setShowOwnedOnly(showOwnedOnly) }
                />
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={ renderScene }
                onIndexChange={ setIndex }
                initialLayout={{ width: layout.width }}
            />
        </View>
    );
}


export default Collection;

const styles = StyleSheet.create({});
