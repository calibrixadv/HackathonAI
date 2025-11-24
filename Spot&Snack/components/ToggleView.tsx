import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

interface ToggleViewProps {
    selected: 'map' | 'list';
    onChange: (view: 'map' | 'list') => void;
}

export default function ToggleView({ selected, onChange }: ToggleViewProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, selected === 'map' ? styles.active : styles.inactive]}
                onPress={() => onChange('map')}
            >
                <Text style={selected === 'map' ? styles.activeText : styles.inactiveText}>🗺 Hartă</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, selected === 'list' ? styles.active : styles.inactive]}
                onPress={() => onChange('list')}
            >
                <Text style={selected === 'list' ? styles.activeText : styles.inactiveText}>📋 Listă</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'center' },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 20,
        borderWidth: 1,
        marginHorizontal: 5,
    },
    active: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    inactive: { backgroundColor: '#fff', borderColor: Colors.primary },
    activeText: { color: '#fff', fontWeight: 'bold' },
    inactiveText: { color: Colors.primary, fontWeight: 'bold' },
});
