import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CardThumb } from '../../components';

import { SearchStackScreenProps } from '../../navigation/types';

import { executeTransaction } from '../../services/SQLClient';

function SearchResults({ navigation, route }: SearchStackScreenProps<'SearchResults'>) {

    const searchParams = route.params;

    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {

        const searchKeys = Object.keys(searchParams).map(k => `${k} = ?`).join(', ');
        async function getSearchResults() {
            const searchData = await executeTransaction(
                `SELECT * FROM cards WHERE ${searchKeys}`,
                [Object.values(searchParams)]
            );

            setSearchResults(searchData);
        }

        getSearchResults();
    }, []);

    return (
        <View style={{ flex: 1, gap: 10 }}>
            <Text>Search Results</Text>
            { searchResults.map(result => (
                <CardThumb cardInfo={ result } />
            ))}
        </View>
    );
}


export default SearchResults;
