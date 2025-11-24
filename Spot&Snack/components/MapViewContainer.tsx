import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { LocationItem } from './LocationItem';
import Colors from '../constants/Colors';

interface MapViewContainerProps {
    locations: LocationItem[];
    selectedLocation: LocationItem | null;
    onSelectLocation: (location: LocationItem) => void;
}

const initialRegion: Region = {
    latitude: 44.4268,
    longitude: 26.1025,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export default function MapViewContainer({
                                             locations,
                                             selectedLocation,
                                             onSelectLocation,
                                         }: MapViewContainerProps) {
    const currentRegion = useMemo(() => {
        if (selectedLocation) {
            return {
                latitude: selectedLocation.coordinates.lat,
                longitude: selectedLocation.coordinates.long,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
        }
        return initialRegion;
    }, [selectedLocation]);

    const getIconName = (loc: LocationItem) => {
        switch (loc.getPrimaryCategory()) {
            case 'Cafea / Study':
                return 'coffee';
            case 'Vegan / Healthy':
                return 'leaf';
            case 'Fast-food / Burger':
                return 'hamburger';
            case 'Mâncare tradițională':
                return 'utensils';
            default:
                return 'map-marker';
        }
    };

    return (
        <MapView
            style={styles.map}
            initialRegion={initialRegion}
            region={currentRegion}
            showsUserLocation
            showsMyLocationButton
        >
            {locations.map(loc => (
                <Marker
                    key={loc.id.toString()}
                    coordinate={{
                        latitude: loc.coordinates.lat,
                        longitude: loc.coordinates.long,
                    }}
                    onPress={() => onSelectLocation(loc)}
                >
                    <View style={[styles.pin, { borderColor: loc.getPinColor() }]}>
                        <FontAwesome5 name={getIconName(loc)} size={20} color="#fff" />
                    </View>
                </Marker>
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: { flex: 1, width: '100%' },
    pin: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.accent,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
});
