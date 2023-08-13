import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import { DailyAnswerBlock } from '../../components/DailyAnswerBlock';
import { Text } from '../../components/Themed';

import { executeTransaction } from '../../services/SQLClient';

import Layout from '../../constants/Layout';
import { Fonts, FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';

import { RootStackScreenProps } from '../../types';
import getProfilePic from '../../assets/profiles';

const { orderBy } = require('lodash');

export default function Profile({ route, navigation }: RootStackScreenProps<'Profile'>) {

    const { userId, editable } = route.params;

    const [user, setUser] = useState({
        id            : null,
        firstname     : '',
        lastname      : '',
        username      : '',
        profilePicture: ''
    });
    const [answers, setAnswers] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);

    async function getProfileData(uId: number) {

        const userData = await executeTransaction('SELECT * from users WHERE id = ?', [uId]);
        setUser(userData.rows.item(0));

        const answerData = await executeTransaction(
            'SELECT * from answers WHERE userId = ?',
            [uId]
        );
        let answersArr = answerData.rows._array;

        let votes = 0;

        for (const answer of answersArr) {
            await Promise.all([
                executeTransaction('SELECT * from questions WHERE id = ?', [answer.questionId]),
                executeTransaction('SELECT COUNT(*) from uservotes WHERE answerId = ?', [answer.id])
            ]).then(([questionData, voteData]) => {
                answer.question = questionData.rows.item(0);
                answer.votes = voteData.rows.item(0)['COUNT(*)'];
            });

            votes += answer.votes;
        }
        answersArr = orderBy(answersArr, ['votes'], ['desc']);

        setAnswers(answersArr);
        setTotalVotes(votes);
    }

    useEffect(() => {
        (async function () {
            await getProfileData(userId);
        }());
    }, [userId]);

    if (!user) {
        return null;
    }

    // @ts-ignore
    const renderItem = ({ item }) => (
        <DailyAnswerBlock
            answerId={ item.id }
            showQuestion
            enabled={ false }
            votesUpdated={ () => getProfileData(userId) }
        />
    );

    return (
        <View style={ Layout.SafeArea }>
            <View style={{ flex: 1, backgroundColor: '#333' }}>
                <View style={ styles.iconContainer }>
                    <Pressable
                        onPress={ () => navigation.goBack() }
                        style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1, flexDirection: 'row' }) }
                    >
                        <MaterialIcons
                            name="arrow-left"
                            size={ 30 }
                            color="white"
                        />
                        <Text style={ styles.backText }>Back</Text>
                    </Pressable>
                    { editable && (
                        <View style={ styles.editUser }>
                            <Text style={ styles.editText }>Edit</Text>
                            <FontAwesome name="pencil" size={ 16 } color="white" />
                        </View>
                    ) }
                </View>
                <View style={ styles.infoContainer }>
                    { editable && <Text style={ styles.userNames }>{ user.firstname } { user.lastname }</Text> }
                    <Text style={ styles.username }>@{ user.username }</Text>
                    <View style={ styles.imageContainer }>
                        <Image source={ getProfilePic(user.profilePicture) } resizeMode="contain" height={ 150 } width={ 150 } style={{ borderRadius: 75 }} />
                    </View>
                    <View style={ styles.votesContainer }>
                        <MaterialIcons name="swap-vertical-circle" size={ 20 } color="white" />
                        <Text style={ styles.votesText }>{ totalVotes }</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={ styles.userAnswersBlock }>
                        <View style={ styles.userAnswersHeader }>
                            <View style={ styles.userAnswersRule } />
                            <View><Text style={ styles.userAnswersText }>USER ANSWERS</Text></View>
                            <View style={ styles.userAnswersRule } />
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        padding       : 5,
        flexDirection : 'row',
        justifyContent: 'space-between'
    },
    backText: {
        alignSelf : 'center',
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Small,
        color     : 'white'
    },
    editUser: {
        flexDirection: 'row',
        alignSelf    : 'center',
        marginRight  : 5
    },
    editText: {
        color             : 'white',
        fontFamily        : Fonts.Light,
        fontSize          : FontSize.Tiny,
        textDecorationLine: 'underline',
        marginRight       : 5
    },
    infoContainer: { alignItems: 'center' },
    userNames    : {
        color     : 'white',
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium
    },
    username: {
        color     : Colors.Grey80,
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium
    },
    imageContainer: {
        justifyContent: 'center',
        padding       : 10
    },
    votesContainer: {
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'center',
        backgroundColor: 'black',
        borderRadius   : 20,
        width          : 100,
        marginTop      : -25
    },
    votesText: {
        color           : 'white',
        fontFamily      : Fonts.Standard,
        fontSize        : FontSize.Small,
        textAlign       : 'center',
        paddingVertical : 5,
        marginHorizontal: 5
    },

    userAnswersBlock: {
        backgroundColor     : Colors.Grey70,
        flex                : 1,
        borderTopLeftRadius : 20,
        borderTopRightRadius: 20,
        bottom              : -15
    },
    userAnswersHeader: {
        flexDirection: 'row',
        alignItems   : 'center',
        padding      : 25
    },
    userAnswersRule:  {
        flex           : 1,
        height         : 1,
        backgroundColor: Colors.Grey40
    },
    userAnswersText: {
        color            : Colors.Grey40,
        fontSize         : FontSize.Medium,
        textAlign        : 'center',
        paddingHorizontal: 16
    }
});

