import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import FileSystem from 'expo-file-system';
import csv from 'csvtojson';
import { executeTransaction } from '../services/SQLClient';

export async function loadFonts() {
    // Load fonts
    await Font.loadAsync({
        ...FontAwesome.font,
        minecraft: require('../assets/fonts/MinecraftTen-VGORe.ttf')
    });
}

export function cacheImages(images: any[]) {
    return images.map(image => Asset.fromModule(image).downloadAsync());
}

export async function importDataFromCSV() {

    const hermitCSV = require('./assets/sql/TCG Database - Hermits.csv');
    const hermitFileInfo = await FileSystem.getInfoAsync(hermitCSV.localUri);

    csv({ output: 'csv' })
        .fromString(hermitCSV)
        .then(async csvRow => {

            for (const row of csvRow) {
                const [Id, Name, Type, Rarity, Health, PrimaryAtkName, PrimaryAtkValue, PrimaryAtkCost, PrimaryAtkDescription,
                    SecondaryAtkName, SecondaryAtkCost, SecondaryAtkValue, SecondaryAtkDescription, Tags] = row;
                
                const card = await executeTransaction('SELECT * FROM cards WHERE id = ?', [Id]);

                if (card && card.lastModified < hermitFileInfo?.modificationTime) {
                    await executeTransaction(
                        `UPDATE cards SET id = ?, name = ?, itemType = ?, rarity = ?, health = ?,
                        primaryAttackName = ?, primaryAttackCost = ?, primaryAttackPower = ?, primaryAttackDescription = ?,
                        secondaryAttackName = ?, secondaryAttackCost = ?, secondaryAttackPower = ?, secondaryAttackDescription = ?,
                        tags = ?, errata = ?, lastModified = ? WHERE id = ?`,
                        [
                            Id, Name, Type, Rarity, Health,
                            PrimaryAtkName, PrimaryAtkCost, PrimaryAtkValue, PrimaryAtkDescription,
                            SecondaryAtkName, SecondaryAtkCost, SecondaryAtkValue, SecondaryAtkDescription,
                            Tags, '', new Date(), Id
                        ]
                    );
                } else {
                    await executeTransaction(
                        `INSERT INTO cards (id, name, cardType, itemType, rarity, description, health,
                        primaryAttackName, primaryAttackCost, primaryAttackPower, primaryAttackDescription,
                        secondaryAttackName, secondaryAttackCost, secondaryAttackPower, secondaryAttackDescription,
                        tags, errata, numberOwned, lastModified)
                        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            Id, Name, 'Hermit', Type, Rarity, '', Health,
                            PrimaryAtkName, PrimaryAtkCost, PrimaryAtkValue, PrimaryAtkDescription,
                            SecondaryAtkName, SecondaryAtkCost, SecondaryAtkValue, SecondaryAtkDescription,
                            Tags, '', 0, new Date()
                        ]
                    );
                }
            }
        });

    const effectCSV = require('./assets/sql/TCG Database - Effects.csv');
    const effectFileInfo = await FileSystem.getInfoAsync(effectCSV.localUri);

    csv({ output: 'csv' })
        .fromString(effectCSV)
        .then(async csvRow => {

            for (const row of csvRow) {
                const [Id, Name, Type, Rarity, Description, Tags] = row;

                const card = await executeTransaction('SELECT * FROM cards WHERE id = ?', [Id]);

                if (card && card.lastModified < effectFileInfo?.modificationTime) {
                    await executeTransaction(
                        `UPDATE cards SET id = ?, name = ?, itemType = ?, rarity = ?, description = ?, tags = ?, lastModified = ?
                        WHERE id = ?`,
                        [
                            Id, Name, Type, Rarity, Description, Tags, new Date(), Id
                        ]
                    );
                } else {
                    await executeTransaction(
                        `INSERT INTO cards (
                            id, name, cardType, itemType, rarity, description, tags, numberOwned, lastModified
                        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            Id, Name, 'Effect', Type, Rarity, '', Tags, 0, new Date()
                        ]
                    );
                }
            }
        });

    const itemCSV = require('./assets/sql/TCG Database - Items.csv');
    const itemFileInfo = await FileSystem.getInfoAsync(itemCSV.localUri);

    csv({ output: 'csv' })
        .fromString(itemCSV)
        .then(async csvRow => {

            for (const row of csvRow) {
                const [Id, Name, Type, Rarity] = row;

                const card = await executeTransaction('SELECT * FROM cards WHERE id = ?', [Id]);

                if (card && card.lastModified < itemFileInfo?.modificationTime) {
                    await executeTransaction(
                        'UPDATE cards SET id = ?, name = ?, itemType = ?, rarity = ?, lastModified = ? WHERE id = ?',
                        [Id, Name, Type, Rarity, new Date(), Id]
                    );
                } else {
                    await executeTransaction(
                        `INSERT INTO cards (id, name, cardType, itemType, rarity, numberOwned, lastModified)
                        values (?, ?, ?, ?, ?, ?, ?)`,
                        [Id, Name, 'Item', Type, Rarity, 0, new Date()]
                    );
                }
            }
        });
}
