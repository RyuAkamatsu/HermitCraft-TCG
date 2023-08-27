import React, { useState } from 'react';
import { FlatList, ScrollView, SectionList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import { RootTabScreenProps } from '../../navigation/types';
import { SortButton } from '../../components';
import { CardThumb } from '../../components/CardThumb';
import { SwitchBlock } from '../../components/common';
import { useFocusEffect } from '@react-navigation/native';
import { executeTransaction } from '../../services/SQLClient';

interface ListProps {
    sortItems: { label: string, value: string }[],
    sortVal: string,
    sortCallback: (val: string) => void
}

const numColumns = 3;

function Collection({ navigation }: RootTabScreenProps<'MyCollection'>) {

    const layout = useWindowDimensions();

    const [showOwnedOnly, setShowOwnedOnly] = useState(false);

    const [hermitRows, setHermitRows] = useState([]);
    const [hermitSort, setHermitSort] = useState('name');

    const [effectRows, setEffectRows] = useState([]);
    const [effectSort, setEffectSort] = useState('name');

    const [itemRows, setItemRows] = useState([]);
    const [itemSort, setItemSort] = useState('name');

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'hermits', title: 'Hermits' },
        { key: 'effects', title: 'Effects' },
        { key: 'items', title: 'Items' },
    ]);

    const renderScene = SceneMap({
        hermits: HermitView,
        effects: EffectView,
        items  : ItemView
    });


    useFocusEffect(() => {
        async function getData() {
            const collectionData = await executeTransaction(
                'SELECT * FROM myCollection WHERE cardQuantity > ? INNER JOIN cards ON myCollection.cardId = cards.id',
                [showOwnedOnly]
            );

            const cardArray = collectionData.rows._array;

            setHermitRows(cardArray.filter(card => card.cardType === 'Hermit'));
            setEffectRows(cardArray.filter(card => card.cardType === 'Effect'));
            setItemRows(cardArray.filter(card => card.cardType === 'Item'));
        }
        getData();
    });

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

    const renderItem = ({ item }) => (
        <View>
            <CardThumb
                cardInfo={ item }
            />
        </View>
    );

    function ListLayout({ sortItems, sortVal, sortCallback, listItems }: ListProps) {
        return (
            <View>
                <SortButton
                    sortVal={ sortVal }
                    onChange={ (value: string) => sortCallback(value) }
                    items={ sortItems }
                />
                { sortVal === 'rarity' ? (
                    <SectionList
                        sections={ dummyData }
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

    function HermitView() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ff4081' }}>
                <ListLayout
                    sortVal={ hermitSort }
                    sortItems={ [
                        { label: 'Name', value: 'name' },
                        { label: 'Rarity', value: 'rarity' }
                    ] }
                    sortCallback={ (value: string) => setHermitSort(value) }
                />
            </View>
        );
    }

    function EffectView() {
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
                />
            </View>
        );
    }

    function ItemView() {
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
                />
            </View>
        );
    }

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
