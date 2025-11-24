import React from 'react';
import { View, StyleSheet } from 'react-native';
import Searchbar from './Searchbar';
import FilterChipsBar from './FilterChipsBar';

interface SearchAndFiltersProps {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    filters: string[];
    selectedFilter: string;
    onFilterSelect: (filter: string) => void;
}

export default function SearchAndFilters({
                                             searchQuery,
                                             onSearchChange,
                                             filters,
                                             selectedFilter,
                                             onFilterSelect,
                                         }: SearchAndFiltersProps) {
    return (
        <View style={styles.container}>
            <Searchbar value={searchQuery} onChangeText={onSearchChange} />
            <FilterChipsBar
                filters={filters}
                selectedFilter={selectedFilter}
                onSelect={onFilterSelect}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 15, marginTop: 10 },
});
