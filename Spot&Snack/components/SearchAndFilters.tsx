import React, { useState } from 'react';
import { View } from 'react-native';
import Searchbar from './Searchbar';
import { LocationItem } from './LocationItem';

interface SearchingFiltersProps {
    data: LocationItem[];
    onLocationSelect: (location: LocationItem) => void;
}

export default function SearchingFilters({ data, onLocationSelect }: SearchingFiltersProps) {
    const [searchText, setSearchText] = useState('');

    return (
        <View>
            <Searchbar
                data={data}
                searchText={searchText}        // Aici pui valoarea actuală
                onSearchChange={setSearchText} // Aici pui callback-ul de update
                onLocationSelect={onLocationSelect}
            />
        </View>
    );
}
