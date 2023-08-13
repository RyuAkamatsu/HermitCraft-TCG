import React, { Component } from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import { ARROW } from '../../../../assets/images';
import {ButtonWithIconStyles} from "../../../styles";

/**
 * Props: backgroundColor = "", title = "", accordionVisible = callback fn(), icon = imageURI
 */
export default class Accordion extends Component {

    constructor(props) {
        super(props);

        //open by default
        this.state = {
            show: true
        };
        this.bg = this.props.backgroundColor || ButtonWithIconStyles.buttonStyle.backgroundColor;
        this.icon = this.props.buttonIcon || ARROW;
    }

    toggleAccordion() {
        this.setState({show: !this.state.show}, () => {
            // This gives you the optional ability to pass back a boolean to the parent component, stating whether
            // the accordion is visible or not
            if (this.props.accordionVisible) {
                this.props.accordionVisible(this.state.show);
            }
        });
    }

    renderAccordionChildren() {
        return this.state.show ? <View style={styles.accordionItemContainer}>{this.props.children}</View> : null;
    }

    render() {
        let { containerStyle, buttonStyle, imageContainer, iconStyle, textStyle } = ButtonWithIconStyles;
        let { title } = this.props;

        return (
            <View style={containerStyle}>
                <TouchableOpacity style={{...buttonStyle, backgroundColor: this.bg}} onPress={this.toggleAccordion.bind(this)}>
                    <View style={{justifyContent: 'center'}}>
                        <Text style={textStyle}>{title}</Text>
                    </View>
                    <View style={imageContainer}>
                        <Image source={this.icon} style={{...iconStyle, transform: [{ rotate: `${this.state.show ? "90deg" : "0deg"}`}]}} />
                    </View>
                </TouchableOpacity>

                {this.renderAccordionChildren()}
            </View>
        )
    }
}

const styles = {
    accordionItemContainer: {
        marginTop: 15,
        width: '90%',
        alignSelf: 'flex-end'
    }
};