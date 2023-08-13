import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';
import { Text } from './common/Themed';

import { Fonts, FontSize } from '../constants/Fonts';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { QuestionBlock, UserBlock } from '../slices/types';
import { AvatarImage } from './AvatarImage';

type propTypes = {
    question: QuestionBlock,
    user: UserBlock
}

function DailyQuestionBlock(props: propTypes) {
    const { question, user } = props;

    if (!question || !user) {
        return null;
    }

    const cacheDate = useMemo(() => moment(question.ScheduledDate).format('DD/MM/YY'), [question.ScheduledDate]);

    return (
        <>
            <View style={ styles.questionContainer }>
                <View style={ styles.avatarContainer }>
                    <AvatarImage avatar={ user?.Avatar } />
                </View>
                <View style={{ flex: 6 }}>
                    <Text style={ styles.questionText }>{ question.Question }</Text>
                    <Text style={ styles.usernameText }>@{ user?.Username }</Text>
                </View>
            </View>
            <View>
                <Text style={ styles.questionDate }>{ cacheDate }</Text>
            </View>
        </>
    );
}
// eslint-disable-next-line import/prefer-default-export
export { DailyQuestionBlock };

const styles = StyleSheet.create({
    questionContainer: {
        backgroundColor : 'white',
        flexDirection   : 'row',
        marginHorizontal: 10,
        padding         : 10,
        borderRadius    : 10,
        borderColor     : Colors.Grey70,
        borderWidth     : 2,
        borderStyle     : 'solid'
    },
    avatarContainer: {
        marginRight   : 5,
        justifyContent: 'center'
    },
    questionText: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium,
        color     : Colors.TextColor,
        lineHeight: 25
    },
    usernameText: {
        ...Layout.link,
        color     : Colors.Grey50,
        fontSize  : FontSize.Small,
        fontFamily: Fonts.Light
    },
    questionDate: {
        fontSize    : FontSize.Tiny,
        color       : Colors.Grey70,
        paddingLeft : 20,
        marginBottom: 15
    },
});
