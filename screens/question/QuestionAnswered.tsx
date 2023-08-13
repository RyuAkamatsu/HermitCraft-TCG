import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { ButtonWithIcon } from '../../components/common';
import { Text } from '../../components/Themed';
import { RootStackScreenProps } from '../../types';

import Layout from '../../constants/Layout';
import { FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';

const questionBackground = require('../../assets/question_background.png');

function QuestionAnswered({ navigation }: RootStackScreenProps<'QuestionAnswered'>) {
    return (
        <View style={ Layout.SafeArea }>
            <ImageBackground source={ questionBackground } resizeMode="cover" style={{ flex: 1 }}>
                <View style={{ ...Layout.pageContainer, flex: 1, justifyContent: 'center' }}>
                    <View style={ styles.answerContainer }>
                        <Text style={ styles.helpText }>POSE OF THE DAY</Text>
                        <View style={ styles.textBlock }>
                            <Text style={ styles.exclamation }>Awesome!</Text>
                            <Text style={ styles.exclamation }>You&apos;ve answered today&apos;s Pose.</Text>
                        </View>
                        <View style={ styles.viewAnswersBlock }>
                            <ButtonWithIcon
                                iconType="MaterialIcons"
                                buttonIcon="arrow-right-alt"
                                iconColor="white"
                                onPress={ () => navigation.navigate('AllAnswers') }
                            >
                                <Text style={ Layout.iconButtonTextStyle }>View all answers</Text>
                            </ButtonWithIcon>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

export default QuestionAnswered;

const styles = StyleSheet.create({
    questionText: {
        fontSize       : FontSize.Question,
        color          : 'white',
        textAlign      : 'center',
        paddingVertical: 15
    },
    helpText: {
        color            : Colors.Grey60,
        fontSize         : FontSize.Medium,
        textAlign        : 'center',
        marginTop        : 5,
        marginBottom     : 15,
        paddingVertical  : 10,
        paddingHorizontal: 20
    },
    answerContainer: {
        backgroundColor: 'white',
        marginVertical : 40,
        paddingVertical: 20,
        borderRadius   : 20
    },
    textBlock: {
        backgroundColor: Colors.Grey95,
        paddingVertical: 20
    },
    exclamation: {
        fontSize  : FontSize.Exclamation,
        fontWeight: 'bold',
        textAlign : 'center'
    },
    viewAnswersBlock: {
        marginTop        : 15,
        marginBottom     : 5,
        paddingVertical  : 10,
        paddingHorizontal: 20
    }
});
