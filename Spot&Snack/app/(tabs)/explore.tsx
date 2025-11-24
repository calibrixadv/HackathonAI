// app/(tabs)/explore.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Colors from '../../constants/Colors';
import { MapStyle as LightMapStyle } from '../../assets/mapStyle/MapStyle';
import { useThemeColor } from '../../hooks/useThemeColor';
import Searchbar, { LocationItem } from '../../components/Searchbar';
import * as locationsData from '../../constants/locatii.json';

const initialRegion = {
    latitude: 44.4268,
    longitude: 26.1025,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1, width: '100%' },
    footerText: { padding: 10, textAlign: 'center' },
});

function ExploreScreen() {
    const scheme = useColorScheme() ?? 'light';
    const backgroundColor = useThemeColor('background');
    const textColor = useThemeColor('text');
    const mapStyle = scheme === 'dark' ? null : LightMapStyle;

    const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
    const locations = (locationsData as any).default ?? (locationsData as unknown as LocationItem[]);

    const [isSearchOpen, setIsSearchOpen] = useState(false);

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

    return (
        <View style={styles.container}>
            <Searchbar
                data={locations}
                onLocationSelect={(loc) => {
                    setSelectedLocation(loc);
                    setIsSearchOpen(false); // inchidem lista la select
                }}
                onOpenChange={(open) => setIsSearchOpen(open)}
            />

            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                region={currentRegion}
                customMapStyle={mapStyle!}
                // dezactivam interactiunea cu harta cand e deschisa lista
                scrollEnabled={!isSearchOpen}
                zoomEnabled={!isSearchOpen}
                rotateEnabled={!isSearchOpen}
                pitchEnabled={!isSearchOpen}
                toolbarEnabled={!isSearchOpen}
            >
                {selectedLocation && (
                    <Marker
                        coordinate={{
                            latitude: selectedLocation.coordinates.lat,
                            longitude: selectedLocation.coordinates.long
                        }}
                        title={selectedLocation.name}
                        description={selectedLocation.address}
                        pinColor={Colors.accent}
                    />
                )}
            </MapView>

            <Text style={[styles.footerText, { backgroundColor: backgroundColor, color: textColor }]}>
                Modul curent: {scheme === 'light' ? 'LUMINOS' : 'ÎNTUNECAT'} (Hartă Implicită)
            </Text>
        </View>
    );
}

export default ExploreScreen;
