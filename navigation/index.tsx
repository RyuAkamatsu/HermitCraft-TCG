import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Collection from '../screens/collection/Collection';

import { RootTabParamList, SearchStackParamList, InfoStackParamList, DecksStackParamList } from './types';
import HermitType from '../screens/search/HermitType';
import SearchHome from '../screens/search/SearchHome';
import AdvancedSearch from '../screens/search/AdvancedSearch';
import SearchResults from '../screens/search/SearchResults';
import { FontAwesome5 } from '@expo/vector-icons';

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
        <Tabs.Navigator
            screenOptions={ ({ route }) => ({
                headerShown: false,
                tabBarIcon : ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Search':
                            iconName = 'search';
                            break;
                        case 'MyCollection':
                            iconName = 'boxes';
                            break;
                        case 'MyDecks':
                            iconName = 'box-open';
                            break;
                        case 'Information':
                            iconName = 'info-circle';
                            break;
                        default:
                            iconName = null;
                    }

                    // You can return any component that you like here!
                    return <FontAwesome5 name={ iconName } size={ size } color={ color } />;
                },
                tabBarActiveTintColor  : 'cyan',
                tabBarInactiveTintColor: 'gray',
            }) }
        >
            <Tabs.Screen name="Search" component={ SearchNavigator } />
            <Tabs.Screen name="MyCollection" component={ Collection } />
            <Tabs.Screen name="MyDecks" component={ DeckNavigator } />
            <Tabs.Screen name="Information" component={ InfoNavigator } />
        </Tabs.Navigator>
    );
}

function SearchNavigator() {
    return (
        <SearchStack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <SearchStack.Screen name="SearchHome" component={ SearchHome } />
            <SearchStack.Screen name="HermitType" component={ HermitType } />
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
