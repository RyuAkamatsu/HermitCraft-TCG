import { SharedValue } from 'react-native-reanimated';
import React from 'react';

type Field = {
    label: string;
    value: string;
};

export type CardContentProps = {
    title: string;
    bg: string;
};

export type CardProps = {
    item: CardContentProps;
    index: number;
    height: number;
    selectedCard: SharedValue<number>;
};
