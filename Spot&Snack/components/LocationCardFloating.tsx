import { getLocationType } from '../utils/locationHelpers';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LocationItem } from './LocationItem';
import Colors from '../constants/Colors';

interface LocationCardFloatingProps {
    location: LocationItem;
    onPress: () => void;
}

export default function LocationCardFloating({ location, onPress }: LocationCardFloatingProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <Image source={{ uri: location.image_url }} style={styles.thumbnail} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{location.name}</Text>
                <Text style={styles.address}>
                    {location.address} {/* optionally short: "Cluj – Restaurant" */}
                </Text>
            </View>
            <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {location.rating?.toFixed(1)}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        elevation: 5,
    },
    thumbnail: { width: 60, height: 60, borderRadius: 15, marginRight: 10 },
    textContainer: { flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold' },
    address: { fontSize: 12, color: '#555' },
    ratingContainer: { paddingLeft: 10 },
    rating: { fontWeight: 'bold', color: Colors.primary },
});
