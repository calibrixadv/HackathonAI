import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { LocationItem } from './LocationItem';
import LocationCard from './LocationCard';

interface ListViewContainerProps {
    locations: LocationItem[];
    onSelect: (loc: LocationItem) => void;
}

export default function ListViewContainer({ locations, onSelect }: ListViewContainerProps) {
    return (
        <FlatList
            data={locations}
            keyExtractor={(item) => item.id.toString()}

            renderItem={({ item }) => (
                <LocationCard location={item} onPress={() => onSelect(item)} />
            )}
        />
    );
}

