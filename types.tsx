/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootTabParamList {}
    }
}

export type RootTabParamList = {
    Search: NavigatorScreenParams<SearchStackParamList> | undefined;
    MyCollection: undefined;
    MyDecks: undefined;
    Information: NavigatorScreenParams<InfoStackParamList> | undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = DrawerScreenProps<
    RootTabParamList,
    Screen
>;

export type SearchStackParamList = {
    SearchHome: undefined;
    AdvancedSearch: undefined;
    SearchResults: undefined;
};

export type SearchStackScreenProps<Screen extends keyof SearchStackParamList> = CompositeScreenProps<
    NativeStackScreenProps<SearchStackParamList, Screen>,
    BottomTabScreenProps<RootTabParamList>
>;

export type InfoStackParamList = {
    InfoHome: undefined;
};

export type InfoStackScreenProps<Screen extends keyof InfoStackParamList> = CompositeScreenProps<
    NativeStackScreenProps<InfoStackParamList, Screen>,
    BottomTabScreenProps<RootTabParamList>
>;