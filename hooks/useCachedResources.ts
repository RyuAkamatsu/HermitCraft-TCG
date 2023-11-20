import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
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

    const hermitCSV = await Asset.fromModule(require('../assets/sql/Hermits.csv')).downloadAsync();
    const hermitFileInfo = await FileSystem.getInfoAsync(hermitCSV.localUri);
    const hermitFileModTime = (hermitFileInfo?.modificationTime | 0) * 1000;
    const hermitData = await FileSystem.readAsStringAsync(hermitCSV.localUri);
    const [, ...hermitRest] = hermitData.split(/\r/);

    // console.log(hermitRest);

    for (const row of hermitRest) {
        // console.log(`${index} - ${row}`);

        const [Id, Name, Type, Rarity, Health, PrimaryAtkName, PrimaryAtkValue, PrimaryAtkCost, PrimaryAtkDescription,
            SecondaryAtkName, SecondaryAtkCost, SecondaryAtkValue, SecondaryAtkDescription, Tags] = row.split(',');

        const card = await executeTransaction('SELECT * FROM cards WHERE id = ?', [Id]);

        const existingCard = card?.rows?._array[0];
        // console.log('existingCard time', existingCard?.lastModified);

        if (!existingCard) {
            // console.log('Insert card: ', Id);

            await executeTransaction(
                `INSERT INTO cards (id, name, cardType, itemType, rarity, description, health,
                primaryAttackName, primaryAttackCost, primaryAttackPower, primaryAttackDescription,
                secondaryAttackName, secondaryAttackCost, secondaryAttackPower, secondaryAttackDescription,
                tags, errata, numberOwned, lastModified)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    Id, Name, 'Hermit', Type, Rarity, '', Health,
                    PrimaryAtkName, PrimaryAtkCost, PrimaryAtkValue, PrimaryAtkDescription,
                    SecondaryAtkName, SecondaryAtkCost, SecondaryAtkValue, SecondaryAtkDescription,
                    Tags, '', 0, new Date().getTime()
                ]
            );

            // console.log('Inserted: ', Id);
        } else if (existingCard.lastModified < hermitFileModTime) {
            console.log('Update existing card: ', Id);

            await executeTransaction(
                `UPDATE cards SET id = ?, name = ?, itemType = ?, rarity = ?, health = ?,
                primaryAttackName = ?, primaryAttackCost = ?, primaryAttackPower = ?, primaryAttackDescription = ?,
                secondaryAttackName = ?, secondaryAttackCost = ?, secondaryAttackPower = ?, secondaryAttackDescription = ?,
                tags = ?, errata = ?, lastModified = ? WHERE id = ?`,
                [
                    Id, Name, Type, Rarity, Health,
                    PrimaryAtkName, PrimaryAtkCost, PrimaryAtkValue, PrimaryAtkDescription,
                    SecondaryAtkName, SecondaryAtkCost, SecondaryAtkValue, SecondaryAtkDescription,
                    Tags, '', new Date().getTime(), Id
                ]
            );

            // console.log('Updated: ', Id);
        }
    }

    const effectCSV = await Asset.fromModule(require('../assets/sql/Effects.csv')).downloadAsync();
    const effectFileInfo = await FileSystem.getInfoAsync(effectCSV.localUri);
    const effectFileModTime = (effectFileInfo?.modificationTime | 0) * 1000;
    const effectData = await FileSystem.readAsStringAsync(effectCSV.localUri);
    const [, ...effectRest] = effectData.split(/\r/);

    // console.log(effectRest.length);

    for (const row of effectRest) {

        const [Id, Name, Type, Rarity, Description, Tags] = row.split(',');

        const card = await executeTransaction('SELECT * FROM cards WHERE id = ?', [Id]);

        const existingCard = card?.rows?._array[0];

        if (!existingCard) {
            await executeTransaction(
                `INSERT INTO cards (
                id, name, cardType, itemType, rarity, description, tags, numberOwned, lastModified
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    Id, Name, 'Effect', Type, Rarity, '', Tags, 0, new Date().getTime()
                ]
            );
        } else if (existingCard?.lastModified < effectFileModTime) {
            await executeTransaction(
                `UPDATE cards SET id = ?, name = ?, itemType = ?, rarity = ?, description = ?, tags = ?, lastModified = ?
                WHERE id = ?`,
                [
                    Id, Name, Type, Rarity, Description, Tags, new Date().getTime(), Id
                ]
            );
        }
    }

    const itemCSV = await Asset.fromModule(require('../assets/sql/Items.csv')).downloadAsync();
    const itemFileInfo = await FileSystem.getInfoAsync(itemCSV.localUri);
    const itemFileModTime = (itemFileInfo?.modificationTime | 0) * 1000;
    const itemData = await FileSystem.readAsStringAsync(itemCSV.localUri);
    const [, ...itemRest] = itemData.split(/\r/);

    // console.log(itemRest.length);

    for (const row of itemRest) {
        const [Id, Name, Type, Rarity] = row.split(',');

        const card = await executeTransaction('SELECT * FROM cards WHERE id = ?', [Id]);

        const existingCard = card?.rows?._array[0];

        if (!existingCard) {
            await executeTransaction(
                `INSERT INTO cards (id, name, cardType, itemType, rarity, numberOwned, lastModified)
                values (?, ?, ?, ?, ?, ?, ?)`,
                [Id, Name, 'Item', Type, Rarity, 0, new Date().getTime()]
            );
        } else if (existingCard?.lastModified < itemFileModTime) {
            await executeTransaction(
                'UPDATE cards SET id = ?, name = ?, itemType = ?, rarity = ?, lastModified = ? WHERE id = ?',
                [Id, Name, Type, Rarity, new Date().getTime(), Id]
            );
        }
    }
}
