import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList, SearchStackParamList, InfoStackParamList, DecksStackParamList } from './types';

export default function Navigation() {
    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
}

const Tabs = createBottomTabNavigator<RootTabParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const DecksStack = createNativeStackNavigator<DecksStackParamList>();
const InfoStack = createNativeStackNavigator<InfoStackParamList>();

function RootNavigator() {

    return (
        <Tabs.Navigator>
            <Tabs.Screen name="Search" component={ SearchNavigator } />
            <Tabs.Screen name="MyCollection" component={ Collection } />
            <Tabs.Screen name="MyDecks" component={ DeckNavigator } />
            <Tabs.Screen name="Information" component={ InfoNavigator } />
        </Tabs.Navigator>
    );
}

function SearchNavigator() {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen name="SearchHome" component={ SearchHome } />
            <SearchStack.Screen name="AdvancedSearch" component={ AdvancedSearch } />
            <SearchStack.Screen name="SearchResults" component={ SearchResults } />
        </SearchStack.Navigator>
    );
}

function DeckNavigator() {
    return (
        <DecksStack.Navigator>
            <DecksStack.Screen name="DecksHome" component={ DecksHome } />
        </DecksStack.Navigator>
    );
}

function InfoNavigator() {
    return (
        <InfoStack.Navigator>
            <InfoStack.Screen name="InfoHome" component={ InfoHome } />
        </InfoStack.Navigator>
    );
}
