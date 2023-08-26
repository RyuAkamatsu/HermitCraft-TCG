import React, { useState } from 'react';
import { FlatList, ScrollView, SectionList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import { RootTabScreenProps } from '../../navigation/types';
import { SortButton } from '../../components';

const [hermitSort, setHermitSort] = useState('name');
const [effectSort, setEffectSort] = useState('name');
const [itemSort, setItemSort] = useState('name');

const numColumns = 3;

interface ListProps {
    sortItems: { label: string, value: string }[],
    sortVal: string,
    sortCallback: (val: string) => void
}

const renderSection = data => <Section { ...data } />;

const renderSectionItem = ({ section, index }) => {

    if (index % numColumns !== 0) return null;

    const items = [];

    for (let i = index; i < index + numColumns; i++) {
        if (i >= section.data.length) {
            break;
        }

        items.push(<Item item={ section.data[i] } />);
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

function ListLayout({ sortItems, sortVal, sortCallback }: ListProps) {
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
                    data={ dummyData }
                    renderItem={ renderItem }
                    numColumns={ numColumns }
                    keyExtractor={ (item) => item._id }
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

const renderScene = SceneMap({
    hermits: HermitView,
    effects: EffectView,
    items  : ItemView
});

function Collection({ navigation }: RootTabScreenProps<'MyCollection'>) {

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'hermits', title: 'Hermits' },
        { key: 'effects', title: 'Effects' },
        { key: 'items', title: 'Items' },
    ]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={ renderScene }
            onIndexChange={ setIndex }
            initialLayout={{ width: layout.width }}
        />
    );
}


export default Collection;

const styles = StyleSheet.create({});
