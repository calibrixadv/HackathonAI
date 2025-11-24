// src/components/Searchbar.tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, useColorScheme } from 'react-native';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { useThemeColor } from '../hooks/useThemeColor';

export interface Coordinates { lat: number; long: number; }
export interface LocationItem { id: string; name: string; address: string; coordinates: Coordinates; }

interface SearchbarProps {
    data: LocationItem[];
    onLocationSelect: (location: LocationItem) => void;
    onOpenChange?: (open: boolean) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ data, onLocationSelect, onOpenChange }) => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<LocationItem[]>([]);
    const cardColor = useThemeColor('card');
    const textColor = useThemeColor('text');
    const separatorColor = useThemeColor('separator');
    const scheme = useColorScheme() ?? 'light';

    useEffect(() => { if (onOpenChange) onOpenChange(filteredData.length > 0); }, [filteredData.length, onOpenChange]);

    const handleSearch = (text: string) => {
        setSearchText(text);
        if (text.length > 0 && Array.isArray(data)) {
            const q = text.toLowerCase();
            const res = data.filter(it => it.name.toLowerCase().includes(q) || it.address.toLowerCase().includes(q));
            setFilteredData(res);
        } else setFilteredData([]);
    };

    const handleSelect = (it: LocationItem) => {
        onLocationSelect(it);
        setSearchText(it.name);
        setFilteredData([]);
    };

    return (
        <View style={styles.container} pointerEvents="box-none">
            <TextInput
                style={[styles.input, { backgroundColor: cardColor, borderColor: Colors.primary, color: Colors.primary }]}
                placeholder="Caută locații sau adrese..."
                placeholderTextColor={scheme === 'dark' ? separatorColor : Colors.primary + '80'}
                value={searchText}
                onChangeText={handleSearch}
            />

            {filteredData.length > 0 && (
                <View style={[styles.resultsContainer, { backgroundColor: cardColor, borderColor: separatorColor }]}>
                    <ScrollView
                        style={{ maxHeight: 300 }}
                        contentContainerStyle={{ paddingVertical: 4 }}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator
                    >
                        {filteredData.map((it, idx) => (
                            <RectButton
                                key={it.id ?? idx}
                                onPress={() => handleSelect(it)}
                                style={[styles.resultItem, { backgroundColor: cardColor, borderBottomColor: separatorColor, borderBottomWidth: idx === filteredData.length - 1 ? 0 : 1 }]}
                                rippleColor="rgba(0,0,0,0.04)"
                            >
                                <Text style={[styles.resultName, { color: textColor }]}>{it.name}</Text>
                                <Text style={[styles.resultAddress, { color: separatorColor }]}>{it.address}</Text>
                            </RectButton>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingTop: 30, // crește de la 10 → 30 pentru a coborî searchbar-ul
        zIndex: 9999,
        elevation: 30,
        position: 'absolute',
        width: '100%',
    },
    input: { height: 50, borderRadius: 10, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, elevation: 6 },
    resultsContainer: { position: 'absolute', top: 70, left: 15, right: 15, maxHeight: 300, borderRadius: 10, borderWidth: 1, elevation: 40, zIndex: 99999 },
    resultItem: { padding: 15, flexDirection: 'column' },
    resultName: { fontSize: 16, fontWeight: 'bold' },
    resultAddress: { fontSize: 12, marginTop: 2 },
});

export default Searchbar;
