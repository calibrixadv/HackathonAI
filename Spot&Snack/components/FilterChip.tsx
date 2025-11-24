import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

interface FilterChipProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

export default function FilterChip({ label, selected, onPress }: FilterChipProps) {
    return (
        <TouchableOpacity
            style={[styles.chip, selected ? styles.chipSelected : styles.chipDefault]}
            onPress={onPress}
        >
            <Text style={[styles.label, selected ? styles.labelSelected : styles.labelDefault]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        marginRight: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipDefault: { backgroundColor: '#fff', borderColor: Colors.primary },
    chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    label: { fontSize: 14 },
    labelDefault: { color: Colors.primary },
    labelSelected: { color: '#fff' },
});
