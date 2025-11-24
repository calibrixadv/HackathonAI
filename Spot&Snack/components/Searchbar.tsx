import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { useThemeColor } from '../hooks/useThemeColor';
import { LocationItem } from './LocationItem';

interface SearchbarProps {
    data: LocationItem[];
    onLocationSelect: (location: LocationItem) => void;
    value?: string;
    onChangeText?: (text: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ data, onLocationSelect, value, onChangeText }) => {
    const [searchText, setSearchText] = useState(value || '');
    const [filteredData, setFilteredData] = useState<LocationItem[]>([]);

    const cardColor = useThemeColor('card');
    const textColor = useThemeColor('text');
    const separatorColor = useThemeColor('separator');
    const scheme = useColorScheme() ?? 'light';

    useEffect(() => {
        if (value !== undefined && value !== searchText) {
            setSearchText(value);
            filterData(value);
        }
    }, [value]);

    const filterData = (text: string) => {
        setSearchText(text);
        onChangeText?.(text);

        if (text.length > 0) {
            const lower = text.toLowerCase();
            const results = data.filter(
                item => item.name.toLowerCase().includes(lower) || item.address.toLowerCase().includes(lower)
            );
            setFilteredData(results);
        } else {
            setFilteredData([]);
        }
    };

    const handleSelect = (item: LocationItem) => {
        onLocationSelect(item);
        setSearchText(item.name);
        setFilteredData([]);
        onChangeText?.(item.name);
    };

    const renderItem = ({ item }: { item: LocationItem }) => (
        <TouchableOpacity
            key={item.id.toString()}
            style={[styles.resultItem, { backgroundColor: cardColor, borderBottomColor: separatorColor }]}
            onPress={() => handleSelect(item)}
        >
            <Text style={[styles.resultName, { color: textColor }]}>{item.name}</Text>
            <Text style={[styles.resultAddress, { color: separatorColor }]}>{item.address}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, { backgroundColor: cardColor, borderColor: Colors.primary, color: Colors.primary }]}
                placeholder="Caută un spot sau un oraș..."
                placeholderTextColor={scheme === 'dark' ? separatorColor : Colors.primary + '80'}
                value={searchText}
                onChangeText={filterData}
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
    container: { paddingHorizontal: 15, marginTop: 40, zIndex: 10 },
    input: {
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 15,
        fontSize: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    resultsContainer: {
        maxHeight: 300,
        borderRadius: 15,
        borderWidth: 1,
        marginTop: 5,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5.46,
        elevation: 8,
    },
    resultItem: { padding: 15 },
    resultName: { fontSize: 16, fontWeight: 'bold' },
    resultAddress: { fontSize: 12, marginTop: 2 },
});

export default Searchbar;
