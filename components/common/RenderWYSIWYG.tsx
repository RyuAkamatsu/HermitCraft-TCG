import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

import { Layout } from '../../constants';

/* const mixedStyles = {
    h2: { fontFamily: Fonts.Heavy },
    p   : { fontFamily: Fonts.Standard }
}; */

function RenderWYSIWYG({ text = '', mixedStyles = {} } : { text: string, mixedStyles: any }) {

    const { width } = useWindowDimensions();

    return (!text ? null : (
        <ScrollView
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={ false }
            style={ Layout.pageContainer }
        >
            <RenderHtml
                contentWidth={ width - 20 }
                source={{ html: text }}
                tagsStyles={ mixedStyles }
            />
        </ScrollView>
    ));
}

export default RenderWYSIWYG;
