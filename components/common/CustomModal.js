import React from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from './Button';
import { Fonts, FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';


const CustomModal = ({ isVisible = true, title, description, buttons }) => {
    return (
        <View>
            <Modal isVisible={isVisible}>
                <View style={{backgroundColor: 'white', padding: 15}}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    {buttons.map((button, i) => {
                        return (
                            <View style={styles.button} key={i}>
                                <Button upperCase={false} backgroundColor={button.backgroundColor} onPress={() => button.onClick()}>{button.buttonText}</Button>
                            </View>
                        );
                    })}
                </View>
            </Modal>
        </View>
    )
};

export { CustomModal };

const styles = {
    title: {
        fontFamily: Fonts.Standard,
        fontSize: FontSize.Medium,
        color: Colors.PrimaryColor
    },
    description: {
        fontFamily: Fonts.Standard,
        fontSize: FontSize.Tiny,
        color: Colors.PrimaryColor,
        marginTop: 10,
        marginBottom: 20
    },
    button: {
        marginVertical: 5
    }
}
