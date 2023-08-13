import React, { useCallback, useState } from 'react';
import { ImageBackground, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import moment from 'moment';
import { Input, Spinner, ButtonWithIcon, Error } from '../../components/common';
import { Text } from '../../components/Themed';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { lastAnsweredChanged } from '../../slices/UserSlice';
import { getQuestion, QuestionState } from '../../slices/QuestionSlice';

import { RootStackScreenProps } from '../../types';
import Layout from '../../constants/Layout';
import { Fonts, FontSize } from '../../constants/Fonts';
import { executeTransaction } from '../../services/SQLClient';
import Colors from '../../constants/Colors';

const questionBackground = require('../../assets/question_background.png');

function DailyQuestion({ navigation }: RootStackScreenProps<'DailyQuestion'>) {

    const [answer, setAnswer] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useAppDispatch();
    const { question, questionCount, questionStatus } = useAppSelector(state => state.question) as QuestionState;
    const { accessToken } = useAppSelector(state => state.auth) as { accessToken: string };
    const userId = parseInt(accessToken);

    const onRefresh = useCallback(async () => {
        const randNum: (limit: number) => number = (limit: number) => {
            const num = Math.floor(Math.random() * limit) + 1;
            return (num === question.id ? randNum(limit) : num);
        };

        setRefreshing(true);
        setAnswer('');

        await dispatch(getQuestion(randNum(questionCount)));
        setRefreshing(false);
    }, []);

    async function submitAnswer() {
        console.log('questionId:', question.id);

        await executeTransaction(
            'INSERT INTO answers (userId, questionId, answer, date) values (?, ?, ?, ?)',
            [userId, question.id, answer, moment().startOf('d').unix()]
        );

        const answerData = await executeTransaction(
            'SELECT * FROM answers WHERE userId = ? AND questionId = ? AND date = ? ORDER BY id DESC LIMIT 1',
            [userId, question.id, moment().startOf('d').unix()]
        );

        await executeTransaction(
            'INSERT INTO uservotes (userId, answerId) values (?, ?)',
            [userId, answerData.rows.item(0).id]
        );

        dispatch(lastAnsweredChanged());
    }

    return (
        <View style={ Layout.SafeArea }>
            <ImageBackground source={ questionBackground } resizeMode="cover" style={{ flex: 1 }}>
                <ScrollView
                    keyboardShouldPersistTaps="never"
                    keyboardDismissMode="on-drag"
                    refreshControl={ <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }
                >
                    <View style={ Layout.pageContainer }>
                        <Text style={ styles.questionText }>{ question.text }</Text>

                        <View style={ styles.answerContainer }>
                            <Text style={ styles.helpText }>ANSWER IN 7 WORDS OR LESS!</Text>
                            <View style={ styles.inputBlock }>
                                <Text style={ Layout.labelStyle }>Your Answer</Text>
                                <Input
                                    label="Your Answer"
                                    onChangeText={ (field: any, value: string) => {
                                        let words = value.split(' ');

                                        if (words.length > 7) {
                                            words = words.slice(0, 7);
                                        }

                                        setAnswer(words.join(' '));
                                    } }
                                    value={ answer }
                                />
                            </View>

                            <View>{ questionStatus === 'failed' ? <Error text="There was a problem something something" /> : null }</View>
                            <View>
                                { questionStatus === 'loading' ?
                                    <Spinner /> : (
                                        <ButtonWithIcon
                                            iconType="MaterialIcons"
                                            buttonIcon="arrow-right-alt"
                                            iconColor="white"
                                            onPress={ () => submitAnswer() }
                                        >
                                            <Text style={ Layout.iconButtonTextStyle }>Submit answer</Text>
                                        </ButtonWithIcon>
                                    )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}


export default DailyQuestion;

const styles = StyleSheet.create({
    questionText: {
        fontSize       : FontSize.Question,
        fontFamily     : Fonts.Standard,
        color          : 'white',
        textAlign      : 'center',
        paddingVertical: 15
    },
    helpText: {
        fontFamily       : Fonts.Light,
        color            : Colors.Grey60,
        fontSize         : FontSize.Medium,
        textAlign        : 'center',
        marginTop        : 5,
        marginBottom     : 15,
        paddingHorizontal: 20
    },
    answerContainer: {
        backgroundColor: 'white',
        marginVertical : 40,
        padding        : 20,
        borderRadius   : 20
    },
    inputBlock: { marginBottom: 25 }
});
