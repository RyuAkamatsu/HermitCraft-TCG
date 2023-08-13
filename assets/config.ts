import { Dimensions } from 'react-native';
import { CardContentProps } from './types';
import Colors from '../constants/Colors';

const windowHeight = Dimensions.get('window').height;

export const CARD_HEADER_HEIGHT = Math.floor(windowHeight * 0.1);
export const CARD_HEIGHT_CLOSED = Math.floor(windowHeight * 0.15);
export const CARD_HEIGHT_OPEN = windowHeight - CARD_HEADER_HEIGHT - 15;

export const SPRING_CONFIG = {
    OPEN: {
        mass     : 0.8,
        stiffness: 80,
    },
    CLOSE: {
        mass     : 0.8,
        damping  : 11,
        stiffness: 87,
    }
};

export const CARDS: CardContentProps[] = [
    {
        title: 'Poser',
        bg   : Colors.PrimaryColor
    },
    {
        title: 'Friends',
        bg   : Colors.PrimaryColor
    },
    {
        title: 'Leaderboard',
        bg   : Colors.PrimaryColor
    },
    {
        title: 'Trending',
        bg   : Colors.PrimaryColor
    },
    {
        title: 'Discover',
        bg   : Colors.PrimaryColor
    },
];
