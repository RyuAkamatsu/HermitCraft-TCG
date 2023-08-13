import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

import Layout from '../../constants/Layout';
import { Fonts } from '../../constants/Fonts';

const mixedStyles = {
    h2: { fontFamily: Fonts.Heavy },
    p   : { fontFamily: Fonts.Standard }
};

function RenderWYSIWYG({ text = '' } : { text: string }) {

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

export { RenderWYSIWYG };
