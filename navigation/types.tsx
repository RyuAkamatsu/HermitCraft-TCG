/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootTabParamList {
        }
    }
}

export type RootTabParamList = {
    Search: NavigatorScreenParams<SearchStackParamList> | undefined;
    MyCollection: undefined;
    MyDecks: NavigatorScreenParams<DecksStackParamList> | undefined;
    Information: NavigatorScreenParams<InfoStackParamList> | undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = DrawerScreenProps<RootTabParamList, Screen>;

export type SearchStackScreenProps<Screen extends keyof SearchStackParamList> = CompositeScreenProps<NativeStackScreenProps<SearchStackParamList, Screen>,
    DrawerScreenProps<RootTabParamList>>;

export type SearchStackParamList = {
    SearchHome: undefined;
    HermitType: undefined;
    AdvancedSearch: undefined;
    SearchResults: any;
};

export type DecksStackScreenProps<Screen extends keyof DecksStackParamList> = CompositeScreenProps<NativeStackScreenProps<DecksStackParamList, Screen>,
    DrawerScreenProps<RootTabParamList>>;

export type DecksStackParamList = {
    DecksHome: undefined;
    DeckView: undefined;
};

export type InfoStackScreenProps<Screen extends keyof InfoStackParamList> = CompositeScreenProps<NativeStackScreenProps<InfoStackParamList, Screen>,
    DrawerScreenProps<RootTabParamList>>;

export type InfoStackParamList = {
    InfoHome: undefined;
};
