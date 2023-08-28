import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export default {
    PrimaryColor  : '#36a9ae',
    SecondaryColor: '#75c060',

    TextColor  : '#454545',
    ButtonColor: '#36a9ae',
    BorderColor: '#000',

    SuccessColor         : '#28a745',
    SecondarySuccessColor: '#cef3d7',
    ErrorColor           : '#dc3545',
    SecondaryErrorColor  : '#f8d7da',

    Grey40: '#666666',
    Grey50: '#808080',
    Grey60: '#999',
    Grey70: '#B4B4B4',
    Grey80: '#CDCDCD',
    Grey90: '#E6E6E6',
    Grey95: '#FAFAFA',
};

export const MyLightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary     : 'rgb(255, 45, 85)',
        background  : 'rgb(242, 242, 242)',
        card        : 'rgb(255, 255, 255)',
        text        : 'rgb(28, 28, 30)',
        border      : 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)'
    }
};

export const MyDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary     : 'rgb(255, 45, 85)',
        background  : 'rgb(242, 242, 242)',
        card        : 'rgb(255, 255, 255)',
        text        : 'rgb(28, 28, 30)',
        border      : 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)'
    }
};
