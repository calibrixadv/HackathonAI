import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import FilterChip from './FilterChip';

interface FilterChipsBarProps {
    filters: string[];
    selectedFilter: string;
    onSelect: (filter: string) => void;
}

export default function FilterChipsBar({ filters, selectedFilter, onSelect }: FilterChipsBarProps) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {filters.map(f => (
                <FilterChip
                    key={f}
                    label={f}
                    selected={f === selectedFilter}
                    onPress={() => onSelect(f)}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 10 },
});
