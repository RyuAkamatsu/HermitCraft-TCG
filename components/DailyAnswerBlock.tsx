import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text } from './common/Themed';

import { Fonts, FontSize } from '../constants/Fonts';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { useAppSelector } from '../hooks/useRedux';
import { AnswerBlock } from '../slices/types';
import { AvatarImage } from './AvatarImage';

type propTypes = {
    answer: AnswerBlock,
    voteUpdated: ((answer: string, voteDirection: number) => void) | undefined
    showQuestion?: boolean,
}

function DailyAnswerBlock(props: propTypes) {
    const navigation = useNavigation();

    const { loggedInUserId: userId } = useAppSelector(state => state.auth);

    const { answer, showQuestion, voteUpdated } = props;

    const cacheDate = useMemo(() => moment(answer.Date).format('DD/MM/YY [at] HH:mm'), [answer.Date]);

    const navigateToProfile = useCallback(() => {
        answer.PoseUser.UserId === userId ?
            navigation.navigate('MyProfile') :
            navigation.navigate('OtherProfile', { userId: answer.PoseUser.UserId });
    }, []);

    const voteArrow = (direction: number, voteVal: number) => (
        <Pressable
            style={ ({ pressed }) => [
                { flexDirection: 'row', opacity: pressed ? 0.5 : 1.0 }
            ] }
            onPress={ () => {
                if (voteUpdated) {
                    voteUpdated(answer._id, direction);
                }
            } }
        >
            <Text style={ styles.voteText }>
                { voteVal }
            </Text>
            <FontAwesome5
                name={ direction === 1 ? 'arrow-circle-up' : 'arrow-circle-down' }
                size={ 42 }
                color={ answer.UserVote === direction ? Colors.PrimaryColor : Colors.Grey60 }
                style={{ alignSelf: 'center' }}
            />
        </Pressable>
    );

    if (!answer || !answer.PoseUser) {
        return null;
    }

    return (
        <>
            <View style={ styles.answerContainer }>
                <View style={ styles.avatarContainer }>
                    <AvatarImage
                        avatar={ answer.PoseUser.Avatar }
                        handlePress={ navigateToProfile }
                    />
                </View>
                <View style={ styles.rightContainer }>
                    <View style={ styles.questionAnswerContainer }>
                        { showQuestion && answer.Question ?
                            <Text style={ styles.questionText }>{ answer.Question }</Text> :
                            null }
                        <Text style={ styles.answerText }>{ answer.Answer }</Text>
                        <Pressable
                            onPress={ () => navigateToProfile() }
                            style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }) }
                        >
                            <Text style={ styles.usernameText }>@{ answer.PoseUser.Username }</Text>
                        </Pressable>
                    </View>
                    <View style={ styles.buttonContainer }>
                        { voteArrow(1, answer.VotesUp) }
                        { voteArrow(-1, answer.VotesDown) }
                    </View>
                </View>
            </View>
            <View>
                <Text style={ styles.answerDate }>{ cacheDate }</Text>
            </View>
        </>
    );
}
// eslint-disable-next-line import/prefer-default-export
export { DailyAnswerBlock };

const styles = StyleSheet.create({
    answerContainer: {
        backgroundColor  : 'white',
        flexDirection    : 'row',
        paddingHorizontal: 10,
        borderRadius     : 10,
        borderColor      : Colors.Grey70,
        borderWidth      : 2,
        borderStyle      : 'solid'
    },
    avatarContainer: {
        marginRight   : 10,
        justifyContent: 'center'
    },
    rightContainer: {
        flex           : 6,
        flexDirection  : 'row',
        paddingVertical: 2
    },
    questionAnswerContainer: {
        flex          : 3,
        justifyContent: 'space-evenly'
    },
    answerDate: {
        fontSize    : FontSize.Tiny,
        color       : Colors.Grey70,
        paddingLeft : 20,
        marginBottom: 15
    },
    questionText: {
        fontFamily: Fonts.Light,
        fontSize  : FontSize.Small,
        color     : Colors.TextColor,
    },
    answerText: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Small,
        color     : Colors.TextColor,
        lineHeight: 25
    },
    usernameText: {
        ...Layout.link,
        color     : Colors.Grey50,
        fontSize  : FontSize.Small,
        fontFamily: Fonts.Light
    },
    buttonContainer: {
        flex          : 1,
        alignItems    : 'flex-end',
        justifyContent: 'center',
        gap           : 5,
        marginLeft    : 15
    },
    voteText: {
        ...Layout.iconButtonTextStyle,
        paddingVertical : 10,
        marginVertical  : 5,
        marginHorizontal: 10,
        color           : Colors.TextColor,
        fontFamily      : Fonts.Heavy,
        fontSize        : FontSize.Small
    }
});
