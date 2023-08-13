import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, View } from 'react-native';
import moment from 'moment';
import { DailyAnswerBlock } from '../../components/DailyAnswerBlock';
import { Text } from '../../components/Themed';

import { useAppSelector } from '../../hooks/useRedux';
import { executeTransaction } from '../../services/SQLClient';
import { QuestionState } from '../../slices/QuestionSlice';

import { RootStackScreenProps } from '../../types';
import Layout from '../../constants/Layout';
import { Fonts, FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';

const { orderBy } = require('lodash');
const questionBackground = require('../../assets/question_background.png');

function AllAnswers({ navigation }: RootStackScreenProps<'QuestionAnswered'>) {

    const [answers, setAnswers] = useState([]);

    const { question } = useAppSelector(state => state.question) as QuestionState;

    useEffect(() => {
        (async function () {
            const data = await executeTransaction(
                'SELECT * from answers WHERE questionId = ? AND date = ?',
                [question.id, moment().startOf('d').unix()]
            );
            let answersArr = data.rows._array;

            for (const answer of answersArr) {
                const voteData = await executeTransaction('SELECT COUNT(*) from uservotes WHERE answerId = ?', [answer.id]);
                answer.votes = voteData.rows.item(0)['COUNT(*)'];
            }
            answersArr = orderBy(answersArr, ['votes'], ['desc']);

            setAnswers(answersArr);
        }());
    }, [question.id]);

    // @ts-ignore
    const renderItem = ({ item }) => <DailyAnswerBlock answerId={ item.id } enabled />;

    return (
        <View style={ Layout.SafeArea }>
            <ImageBackground source={ questionBackground } resizeMode="cover" style={{ flex: 1 }}>
                <View style={{ marginTop: 20, flex: 1 }}>
                    <Text style={ styles.questionText }>{ question.text }</Text>
                    <View style={ styles.trendingAnswersBlock }>
                        <View style={ styles.trendingAnswersHeader }>
                            <View style={ styles.trendingAnswersRule } />
                            <View><Text style={ styles.trendingAnswersText }>TRENDING ANSWERS</Text></View>
                            <View style={ styles.trendingAnswersRule } />
                        </View>
                        {
                            answers.length > 0 ? (
                                <FlatList
                                    style={{ marginBottom: 20 }}
                                    data={ answers }
                                    renderItem={ renderItem }
                                    keyExtractor={ item => item.id }
                                />
                            ) :
                                null
                        }
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

export default AllAnswers;

const styles = StyleSheet.create({
    questionText: {
        fontFamily     : Fonts.Standard,
        fontSize       : FontSize.Question,
        color          : 'white',
        textAlign      : 'center',
        paddingVertical: 15,
        marginBottom   : 20
    },
    trendingAnswersBlock: {
        backgroundColor     : Colors.Grey70,
        flex                : 1,
        borderTopLeftRadius : 20,
        borderTopRightRadius: 20,
        bottom              : -15
    },
    trendingAnswersHeader: {
        flexDirection: 'row',
        alignItems   : 'center',
        padding      : 25
    },
    trendingAnswersRule:  {
        flex           : 1,
        height         : 1,
        backgroundColor: Colors.Grey40
    },
    trendingAnswersText: {
        color            : Colors.Grey40,
        fontSize         : FontSize.Medium,
        textAlign        : 'center',
        paddingHorizontal: 16
    }
});
