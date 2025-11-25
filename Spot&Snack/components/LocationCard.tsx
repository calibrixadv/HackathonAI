import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LocationItem } from './LocationItem';
import Colors from '../constants/Colors';

interface LocationCardProps {
    location: LocationItem;
    onPress: (location: LocationItem) => void;
}

export default function LocationCard({ location, onPress }: LocationCardProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(location)}
            activeOpacity={0.8}
        >
            {/* Imagine */}
            <Image source={{ uri: location.image_url }} style={styles.image} />

            {/* Badge Rating */}
            <View style={styles.badge}>
                <Text style={styles.badgeText}>⭐ {location.rating?.toFixed(1)}</Text>
            </View>

            {/* Text Info */}
            <View style={styles.textContainer}>
                <Text style={styles.name}>{location.name}</Text>

                <Text style={styles.address}>
                    {location.address}
                </Text>

                <Text style={styles.shortDesc}>
                    {location.short_description}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3
    },
    image: {
        width: '100%',
        height: 180
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(80,0,120,0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12
    },
    textContainer: {
        padding: 10
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    address: {
        fontSize: 12,
        color: '#555',
        marginTop: 2
    },
    shortDesc: {
        fontSize: 12,
        color: '#777',
        marginTop: 4
    }
});
