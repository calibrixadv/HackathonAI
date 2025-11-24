import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { useThemeColor } from '../hooks/useThemeColor';
import { LocationItem } from './LocationItem';

interface SearchbarProps {
    data: LocationItem[];
    searchText: string;
    onSearchChange: (text: string) => void;
    onLocationSelect: (location: LocationItem) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ data, searchText, onSearchChange, onLocationSelect }) => {
    const [filteredData, setFilteredData] = useState<LocationItem[]>([]);
    const cardColor = useThemeColor('card');
    const textColor = useThemeColor('text');
    const separatorColor = useThemeColor('separator');
    const scheme = useColorScheme() ?? 'light';

    useEffect(() => {
        if (searchText.length > 0) {
            const lowercased = searchText.toLowerCase();
            const results = data.filter(item =>
                item.name.toLowerCase().includes(lowercased) ||
                item.address.toLowerCase().includes(lowercased)
            );
            setFilteredData(results);
        } else {
            setFilteredData([]);
        }
    }, [searchText, data]);

    const handleSelect = (item: LocationItem) => {
        onLocationSelect(item);
        onSearchChange(item.name);
        setFilteredData([]);
    };

    const renderItem = ({ item, index }: { item: LocationItem; index: number }) => (
        <TouchableOpacity
            key={item.id.toString()}
            style={[styles.resultItem, {
                backgroundColor: cardColor,
                borderBottomColor: separatorColor,
                borderBottomWidth: index === filteredData.length - 1 ? 0 : 1,
            }]}
            onPress={() => handleSelect(item)}
        >
            <Text style={[styles.resultName, { color: textColor }]}>{item.name}</Text>
            <Text style={[styles.resultAddress, { color: separatorColor }]}>{item.address}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, { color: Colors.primary }]}
                placeholder="Caută locații sau adrese..."
                placeholderTextColor={scheme === 'dark' ? separatorColor : Colors.primary + '80'}
                value={searchText}
                onChangeText={onSearchChange}
            />
            {filteredData.length > 0 && (
                <View style={[styles.resultsContainer, { backgroundColor: cardColor, borderColor: separatorColor }]}>
                    <FlatList
                        data={filteredData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 15,marginTop:40, zIndex: 10 },
    input: { height: 50, borderRadius: 10, paddingHorizontal: 15, fontSize: 16, borderWidth: 1 },
    resultsContainer: { maxHeight: 300, borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
    resultItem: { padding: 12 },
    resultName: { fontWeight: 'bold', fontSize: 16 },
    resultAddress: { fontSize: 12, marginTop: 2 },
});

export default Searchbar;
