/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList, SearchStackParamList, InfoStackParamList } from '../types';

export default function Navigation() {
    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
}

const Tabs = createBottomTabNavigator<RootTabParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
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
        <SearchStack.Navigator />
    );
}

function InfoNavigator() {
    return (
        <InfoStack.Navigator>
            <InfoStack.Screen name="InfoHome" component={ InfoHome } />
        <InfoStack.Navigator />
    );
}