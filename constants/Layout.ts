import { Dimensions } from 'react-native';
import { Fonts, FontSize } from './Fonts';
import Colors from './Colors';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default {
    window: {
        width,
        height,
    },
    isSmallDevice: width < 375,

    SafeArea: {
        flex             : 1,
        backgroundColor  : 'white',
        gap              : 20,
        paddingHorizontal: 20,
    },
    labelStyle: {
        color     : Colors.Grey50,
        fontFamily: Fonts.Light,
        fontSize  : FontSize.Tiny
    },
    pickerStyle: {
        viewContainer: {
            flex          : 1,
            borderWidth   : 2,
            borderColor   : Colors.Grey50,
            marginVertical: 5,
            minWidth      : 75
        },
        iconContainer: { position: 'relative', justifyContent: 'center' },
        placeholder  : { color: Colors.TextColor },

        inputIOSContainer: {
            flex           : 1,
            paddingVertical: 20,
            paddingLeft    : 10,
            paddingRight   : 5,
            flexDirection  : 'row',
            justifyContent : 'space-between'
        },
        inputIOS: { color: Colors.TextColor },

        modalViewTop   : {},
        modalViewMiddle: {},
        modalViewBottom: {},

        inputAndroidContainer: {
            flex           : 1,
            borderWidth    : 2,
            borderColor    : Colors.Grey50,
            marginTop      : 5,
            paddingVertical: 10,
            paddingLeft    : 10,
            paddingRight   : 10,
            flexDirection  : 'row',
            justifyContent : 'space-between',
        },
        inputAndroid            : { color: Colors.TextColor, paddingRight: 15 },
        headlessAndroidContainer: { }
    }
};
