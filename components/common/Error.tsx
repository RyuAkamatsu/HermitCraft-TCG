import React from 'react';
import Message from './Message';

interface Props {
    heading ?: string | null,
    text ?: string | null,
    onPress ?: () => void
}

function Error({ heading = null, text = null, onPress }: Props) {
    return <Message heading={ heading } text={ text } onPress={ onPress } />;
}

export default Error;
