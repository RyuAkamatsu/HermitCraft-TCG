import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, SectionList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { useFocusEffect } from '@react-navigation/native';

import { CardThumb, SortButton } from '../../components';
import { SwitchBlock } from '../../components/common';

import { RootTabScreenProps } from '../../navigation/types';
import { executeTransaction } from '../../services/SQLClient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ListProps {
    sortItems: { label: string, value: string }[],
    sortVal: string,
    sortCallback: (val: string) => void,
    listItems: any[],
    styles: any
}

/* const numColumns = 3;

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
} */

function Collection({ navigation }: RootTabScreenProps<'MyCollection'>) {

    // const layout = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const [showOwnedOnly, setShowOwnedOnly] = useState(false);

    const [hermitData, setHermitData] = useState([]);
    const [hermitSort, setHermitSort] = useState('name');

    /* const [effectData, setEffectData] = useState([]);
    const [effectSort, setEffectSort] = useState('name');

    const [itemData, setItemData] = useState([]);
    const [itemSort, setItemSort] = useState('name'); */

    const [showCardModal, setShowCardModal] = useState(false);

    const [index, setIndex] = React.useState(0);
    /* const [routes] = React.useState([
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
    }; */

    async function getData() {
        const collectionData = await executeTransaction('SELECT * FROM cards', []);

        const cardArray = collectionData.rows._array ?? [];

        const hermits = [];
        /* const effects = [];
        const items = []; */

        for (const card of cardArray) {
            if (!showOwnedOnly || card.numberOwned > 0) {
                switch (card.cardType) {
                    case 'Hermit':
                        hermits.push(card);
                        break;
                    /* case 'Effect':
                        effects.push(card);
                        break;
                    case 'Item':
                        items.push(card);
                        break; */
                    default:
                        break;
                }
            }
        }

        console.log('Hermits: ', hermits);

        setHermitData(hermits);
        // setEffectData(effects);
        // setItemData(items);
    }

    useEffect(() => {
        (async function () {
            getData();
        }());
    }, [index]);

    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#ff4081' }}>
            { hermitData?.map(card => (
                <CardThumb
                    key={ `card_${card?.Id}` }
                    cardInfo={ card }
                    showCardModal={ showCardModal }
                    setShowCardModal={ setShowCardModal }
                />
            )) }
        </View>
    );

    /* return (
        <View>
            <View>
                <SwitchBlock
                    label="Only show owned"
                    enabled={ showOwnedOnly }
                    callback={ () => setShowOwnedOnly(showOwnedOnly) }
                />
            </View>
            <View style={{ flex: 1, backgroundColor: '#ff4081' }}>
                { hermitData && hermitData.length > 0 && (
                    <CardThumb
                        cardInfo={ hermitData[0] }
                        showCardModal={ showCardModal }
                        setShowCardModal={ setShowCardModal }
                    />
                ) }
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={ renderScene }
                onIndexChange={ setIndex }
                initialLayout={{ width: layout.width }}
            />
            <FullCardView
                isVisible={ showCardModal }
                cardInfo={ cardInfo }
                onHide={ () => setShowCardModal(false) }
            />
        </View>
    ); */
}

export default Collection;

/* const styles = StyleSheet.create({}); */
