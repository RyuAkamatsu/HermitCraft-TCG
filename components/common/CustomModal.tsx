import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import Button from './Button';

import { Colors, Fonts, FontSize } from '../../constants';

interface Props {
    isVisible?: boolean,
    buttons: any[],
    onChange: (visible: boolean) => void
}

function CustomModal({ children, isVisible = false, buttons, onChange }: React.PropsWithChildren<Props>) {

    const [visible, setVisible] = useState(isVisible);

    useEffect(() => {
        if (onChange) {
            onChange(visible);
        }
    }, [visible]);

    return (
        <Modal
            isVisible={ visible }
            onBackdropPress={ () => setVisible(false) }
            style={{ gap: 10 }}
        >
            <>
                { children }
                <View style={{ padding: 15 }}>
                    { buttons.map(button => (
                        <View style={ styles.button } key={ button.buttonText }>
                            <Button
                                backgroundColor={ button.backgroundColor }
                                onPress={ () => button.onClick() }
                            >
                                { button.buttonText }
                            </Button>
                        </View>
                    )) }
                </View>
            </>
        </Modal>
    );
}

export default CustomModal;

const styles = {
    title: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium,
        color     : Colors.PrimaryColor
    },
    description: {
        fontFamily  : Fonts.Standard,
        fontSize    : FontSize.Tiny,
        color       : Colors.PrimaryColor,
        marginTop   : 10,
        marginBottom: 20
    },
    button: { marginVertical: 5 }
};
