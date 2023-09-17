import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome5 } from '@expo/vector-icons';
import { BackButton } from '../../components';
import { Input, MultipleChoice, PressableButton } from '../../components/common';

import { SearchStackScreenProps } from '../../navigation/types';

import {
    Fonts,
    FontSize,
    CARD_TYPES,
    ITEM_TYPES,
    RARITIES,
    TAGS
} from '../../constants';

const cardTypeArr = CARD_TYPES.map(type => ({ text: type, value: type }));
const itemTypeArr = ITEM_TYPES.map(type => ({ text: type.Name, value: type.Name }));
const rarityArr = RARITIES.map(rarity => ({ text: rarity, value: rarity }));
const healthArr = [250, 260, 270, 280, 290, 300].map(health => ({ text: health.toString(), value: health }));
const costArr = [0, 1, 2, 3].map(cost => ({ text: cost.toString(), value: cost }));
const primaryPowerArr = [0, 30, 40, 50, 60].map(power => ({ text: power.toString().padStart(2, '0'), value: power }));
const secondaryPowerArr = [0, 70, 80, 90, 100].map(power => ({ text: power.toString().padStart(2, '0'), value: power }));
const tagsArr = TAGS.map(tag => ({ text: tag, value: tag }));

function AdvancedSearch({ navigation }: SearchStackScreenProps<'AdvancedSearch'>) {

    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [cardTypes, setCardTypes] = useState<string[]>([]);
    const [itemTypes, setItemTypes] = useState<string[]>([]);
    const [rarities, setRarities] = useState<string[]>([]);
    const [healths, setHealths] = useState<number[]>([]);
    const [primaryCost, setPrimaryCost] = useState<number[]>([]);
    const [primaryPower, setPrimaryPower] = useState<number[]>([]);
    const [secondaryCost, setSecondaryCost] = useState<number[]>([]);
    const [secondaryPower, setSecondaryPower] = useState<number[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    function navigateToSearch() {
        navigation.navigate('SearchResults');
    }

    return (
        <View style={{ flex: 1, gap: 10 }}>
            <BackButton navigation={ navigation } text="Back to Login" />
            <KeyboardAwareScrollView
                contentContainerStyle={{ paddingBottom: 15 }}
                extraScrollHeight={ 150 }
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={ false }
            >
                <View>
                    <Text>Card Name</Text>
                    <Input
                        onChangeText={ (value: string) => setName(value) }
                        placeholder=""
                        value={ name }
                    />
                </View>
                <View>
                    <Text>Card Text</Text>
                    <Input
                        onChangeText={ (value: string) => setText(value) }
                        placeholder=""
                        value={ text }
                    />
                    <Text>Help text</Text>
                </View>
                <View>
                    <Text>Card Type</Text>
                    <MultipleChoice
                        options={ cardTypeArr }
                        values={ cardTypes }
                        layout="Checkboxes"
                        save={ (values: string[]) => setCardTypes(values) }
                    />
                </View>
                <View>
                    <Text>Item Type</Text>
                    <MultipleChoice
                        options={ itemTypeArr }
                        values={ itemTypes }
                        layout="Checkboxes"
                        save={ (values: string[]) => setItemTypes(values) }
                    />
                </View>
                <View>
                    <Text>Rarity</Text>
                    <MultipleChoice
                        options={ rarityArr }
                        values={ rarities }
                        layout="Checkboxes"
                        save={ (values: string[]) => setRarities(values) }
                    />
                </View>
                <View>
                    <Text>Health</Text>
                    <MultipleChoice
                        options={ healthArr }
                        values={ healths }
                        layout="Checkboxes"
                        save={ (values: number[]) => setHealths(values) }
                    />
                </View>
                <View>
                    <Text>Primary Attack</Text>
                    <View>
                        <Text>Cost</Text>
                        <MultipleChoice
                            options={ costArr }
                            values={ primaryCost }
                            layout="Checkboxes"
                            save={ (values: number[]) => setPrimaryCost(values) }
                        />
                    </View>
                    <View>
                        <Text>Power</Text>
                        <MultipleChoice
                            options={ primaryPowerArr }
                            values={ primaryPower }
                            layout="Checkboxes"
                            save={ (values: number[]) => setPrimaryPower(values) }
                        />
                    </View>
                </View>
                <View>
                    <Text>Secondary Attack</Text>
                    <View>
                        <Text>Cost</Text>
                        <MultipleChoice
                            options={ costArr }
                            values={ secondaryCost }
                            layout="Checkboxes"
                            save={ (values: number[]) => setSecondaryCost(values) }
                        />
                    </View>
                    <View>
                        <Text>Power</Text>
                        <MultipleChoice
                            options={ secondaryPowerArr }
                            values={ secondaryPower }
                            layout="Checkboxes"
                            save={ (values: number[]) => setSecondaryPower(values) }
                        />
                    </View>
                </View>
                <View>
                    <Text>Tags</Text>
                    <MultipleChoice
                        options={ tagsArr }
                        values={ tags }
                        layout="Checkboxes"
                        save={ (values: string[]) => setTags(values) }
                    />
                </View>
                <View>
                    <Text>In Collection Only?</Text>
                    //Multi choice
                </View>
            </KeyboardAwareScrollView>
            <View>
                <PressableButton onPress={ navigateToSearch }>
                    <Text>Search</Text>
                    <FontAwesome5
                        name="search"
                        size={ 24 }
                        color="white"
                    />
                </PressableButton>
            </View>
        </View>
    );
}


export default AdvancedSearch;

const styles = StyleSheet.create({
    buttonText: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium
    }
});
