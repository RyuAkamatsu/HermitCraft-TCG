import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Fonts, FontSize } from '../../constants/Fonts';
import Colors from '../../constants/Colors';
import { updateConnection } from '../../../actions';

class BrandedHeader extends Component {

    renderConnectivityToggle() {
        if (Constants.manifest.releaseChannel) {
            return null;
        }

        if (this.props.hasConnection) {
            return (
                <View>
                    <TouchableOpacity style={ styles.headerIconContainer } onPress={ () => this.props.updateConnection(false) }>
                        <MaterialIcons name="wifi" size={ 24 } color="black" />
                        <Text style={ styles.text }>Connected</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View>
                <TouchableOpacity style={ styles.headerIconContainer } onPress={ () => this.props.updateConnection(true) }>
                    <MaterialIcons name="wifi-off" size={ 24 } color="black" />
                    <Text style={ styles.text }>Disconnected</Text>
                </TouchableOpacity>
            </View>
        );

    }

    handleConnectionLoss() {
        // If user is logged in but has no internet connection, display a banner
        if (!this.props.hasConnection) {
            return (
                <View style={{ backgroundColor: Colors.Grey40, height: 25 }}>
                    <Text style={{ textAlign: 'center', color: Colors.Grey95, paddingTop: 1, fontFamily: Fonts.Medium, alignSelf: 'center' }}>No internet connection</Text>
                </View>
            );
        }
    }

    renderHeader() {
        if (this.props.backButton) {
            return (
                <View style={ styles.headerContainer }>
                    <View style={ styles.containerStyle }>
                        <Text style={{ ...styles.text, ...styles.headerIconContainer, ...{ paddingTop: 10 } }} onPress={ () => NavigationService.reset('login') }>Back</Text>
                        <Text style={ styles.logo }>REGULATION 38</Text>
                        <View style={ styles.headerIconContainer } />
                    </View>
                    {this.handleConnectionLoss()}
                </View>
            );
        }
        if (!this.props.accessToken) {
            return (
                <View style={ styles.headerContainer }>
                    <View style={ styles.containerStyle }>
                        <Text style={ styles.logo }>REGULATION 38</Text>
                    </View>
                    {this.handleConnectionLoss()}
                </View>
            );
        }

        return (
            <View style={ styles.headerContainer }>
                <View style={ styles.containerStyle }>
                    <Text style={ styles.logo }>Pose</Text>
                    <Pressable
                        onPress={ () => navigation.navigate('Modal') }
                        style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }) }
                    >
                        <FontAwesome5
                            name="user-circle"
                            size={ 24 }
                            color="black"
                            style={{ marginRight: 15 }}
                        />
                    </Pressable>
                    { this.renderConnectivityToggle() }
                </View>
                {this.handleConnectionLoss()}
            </View>
        );

    }

    render() {
        return (
            <View>
                {this.renderHeader()}
            </View>
        );
    }
}

const styles = {
    headerContainer: {
        flexDirection  : 'column',
        backgroundColor: Colors.Grey95
    },
    containerStyle: {
        flexDirection    : 'row',
        paddingHorizontal: 10,
        paddingVertical  : 10,
        justifyContent   : 'center',
        alignItems       : 'stretch'
    },
    logo: {
        flex           : 3,
        fontSize       : 25,
        fontFamily     : Fonts.Logo,
        color          : Colors.PrimaryColor,
        textAlign      : 'center',
        flexWrap       : 'nowrap',
        paddingVertical: 5
    },
    imageStyle      : { flex: 1 },
    imageStyleCenter: {
        alignSelf     : 'center',
        justifyContent: 'center'
    },
    textStyle: {
        fontSize  : 16,
        fontWeight: '600',
        color     : Colors.Grey70,
        alignSelf : 'flex-end',
        fontFamily: Fonts.Standard,
    },
    textDetails: {
        fontSize  : 12,
        color     : Colors.Grey60,
        fontFamily: Fonts.Standard,
        alignSelf : 'flex-end'
    },
    detailValue: {
        fontSize  : 12,
        color     : Colors.Grey40,
        fontFamily: Fonts.Medium
    },
    headerIconContainer: {
        flex      : 1,
        alignItems: 'center'
    },
    text: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Small,
        color     : Colors.PrimaryColor
    }
};

const mapStateToProps = ({ auth, userProfile }) => {
    const { accessToken } = auth;
    const { hasConnection } = userProfile;
    return { accessToken, hasConnection };
};

export default connect(mapStateToProps, { updateConnection })(BrandedHeader);
