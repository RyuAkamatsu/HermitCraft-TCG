import React, { useCallback, useState } from 'react';
import { View,  } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { ImageBackground, RefreshControl, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import moment from 'moment';
import { Input, Spinner, ButtonWithIcon, Error } from '../../components/common';
import { Text } from '../../components/Themed';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { lastAnsweredChanged } from '../../slices/UserSlice';
import { getQuestion, QuestionState } from '../../slices/QuestionSlice';

import { RootStackScreenProps } from '../../navigation/types';
import Layout from '../../constants/Layout';
import { Fonts, FontSize } from '../../constants/Fonts';
import { executeTransaction } from '../../services/SQLClient';
import Colors from '../../constants/Colors';


const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
});

function DailyQuestion({ navigation }: RootStackScreenProps<'DailyQuestion'>) {

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
    ]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
}


export default DailyQuestion;

const styles = StyleSheet.create({
});
