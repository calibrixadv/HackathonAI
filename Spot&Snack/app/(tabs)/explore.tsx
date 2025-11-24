import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import MapViewContainer from '../../components/MapViewContainer';
import Searchbar from '../../components/Searchbar';
import { LocationItem } from '../../components/LocationItem';
import locationsData from '../../constants/locatii.json';
import Colors from '../../constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ExploreScreen() {
    const scheme = useColorScheme() ?? 'light';
    const backgroundColor = scheme === 'dark' ? '#000' : '#fff';
    const textColor = scheme === 'dark' ? '#fff' : '#000';

    const locations: LocationItem[] = (locationsData.locations || []).map(item => new LocationItem(item));
    const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState('Toate');
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

    const filters = [
        "Toate",
        "Cafea / Study",
        "Mic dejun & Brunch",
        "Mâncare tradițională",
        "Pizza & Italian",
        "Vegan / Healthy",
        "Fast-food / Kebab",
        "Burger & Street Food",
        "Seafood / Pește",
        "Bar / Pub & Social",
        "Restaurant"
    ];

    const filteredLocations = useMemo(() => {
        return locations.filter(loc => {
            const matchesFilter = activeFilter === 'Toate' || loc.categories.includes(activeFilter);
            const matchesSearch = loc.name.toLowerCase().includes(searchText.toLowerCase()) ||
                loc.address.toLowerCase().includes(searchText.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [locations, searchText, activeFilter]);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Searchbar */}
            <Searchbar
                data={filteredLocations}
                searchText={searchText}
                onSearchChange={setSearchText}
                onLocationSelect={setSelectedLocation}
            />

            {/* Filter chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {filters.map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[
                            styles.filterChip,
                            { backgroundColor: activeFilter === f ? Colors.accent : Colors.primary }
                        ]}
                        onPress={() => setActiveFilter(f)}
                    >
                        <Text style={{ color: activeFilter === f ? '#fff' : textColor, fontSize: 12 }}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Map/List toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, viewMode === 'map' && { backgroundColor: Colors.accent }]}
                    onPress={() => setViewMode('map')}
                >
                    <Text style={{ color: viewMode === 'map' ? '#fff' : Colors.accent }}>🗺 Hartă</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, viewMode === 'list' && { backgroundColor: Colors.accent }]}
                    onPress={() => setViewMode('list')}
                >
                    <Text style={{ color: viewMode === 'list' ? '#fff' : Colors.accent }}>📋 Listă</Text>
                </TouchableOpacity>
            </View>

            {viewMode === 'map' ? (
                <MapViewContainer
                    locations={filteredLocations}
                    selectedLocation={selectedLocation}
                    onSelectLocation={setSelectedLocation}
                />
            ) : (
                <ScrollView style={{ flex: 1, marginTop: 8 }}>
                    {filteredLocations.map(loc => (
                        <View key={loc.id} style={styles.listCard}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{loc.name}</Text>
                            <Text style={{ fontSize: 12, color: Colors.text }}>{loc.address}</Text>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    filterScroll: { maxHeight: SCREEN_HEIGHT * 0.08, marginVertical: 4, paddingHorizontal: 10 },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 6,
        minWidth: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 4 },
    toggleButton: {
        flex: 1,
        marginHorizontal: 6,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: Colors.accent,
        borderRadius: 8,
        alignItems: 'center',
    },
    listCard: {
        padding: 12,
        marginHorizontal: 15,
        marginVertical: 6,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
});
