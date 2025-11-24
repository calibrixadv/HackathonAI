import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import MapViewContainer from '../../components/MapViewContainer';
import Searchbar from '../../components/Searchbar';
import { LocationItem } from '../../components/LocationItem';
import locationsData from '../../constants/locatii.json';
import Colors from '../../constants/Colors';
import { useThemeColor } from '../../hooks/useThemeColor';
import ListViewContainer from '../../components/ListViewContainer';

const FILTER_CHIPS = [
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

export default function ExploreScreen() {
    const scheme = useColorScheme() ?? 'light';
    const backgroundColor = useThemeColor('background');
    const textColor = useThemeColor('text');

    const locationsArray = locationsData.locations as any[];
    const locations: LocationItem[] = locationsArray.map(item => new LocationItem(item));

    const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState<'map' | 'list'>('map');
    const [activeFilter, setActiveFilter] = useState('Toate');

    // Data pentru search, respectând filtrul activ
    const searchData = useMemo(() => {
        if (activeFilter === 'Toate') return locations;
        return locations.filter(loc => loc.categories.includes(activeFilter));
    }, [locations, activeFilter]);

    // Filtrare după search + categorie pentru map/list
    const filteredLocations = useMemo(() => {
        let data = searchData;

        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            data = data.filter(
                loc =>
                    loc.name.toLowerCase().includes(lower) ||
                    loc.address.toLowerCase().includes(lower) ||
                    loc.categories.some(cat => cat.toLowerCase().includes(lower))
            );
        }

        return data;
    }, [searchData, searchQuery]);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Zona superioară minimă necesară */}
            <View style={styles.headerContainer}>
                <Searchbar
                    data={searchData}   // doar locațiile din filtrul selectat
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onLocationSelect={setSelectedLocation}
                />

                {/* Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.chipContainer}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
                >
                    {FILTER_CHIPS.map((chip) => (
                        <TouchableOpacity
                            key={chip}
                            style={[
                                styles.chip,
                                activeFilter === chip ? styles.chipActive : styles.chipInactive,
                            ]}
                            onPress={() => setActiveFilter(chip)}
                        >
                            <Text style={activeFilter === chip ? styles.chipTextActive : styles.chipTextInactive}>
                                {chip}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Segment control */}
                <View style={styles.segmentContainer}>
                    <TouchableOpacity
                        style={[styles.segmentButton, activeView === 'map' ? styles.segmentActive : styles.segmentInactive]}
                        onPress={() => setActiveView('map')}
                    >
                        <Text style={activeView === 'map' ? styles.segmentTextActive : styles.segmentTextInactive}>🗺 Hartă</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.segmentButton, activeView === 'list' ? styles.segmentActive : styles.segmentInactive]}
                        onPress={() => setActiveView('list')}
                    >
                        <Text style={activeView === 'list' ? styles.segmentTextActive : styles.segmentTextInactive}>📋 Listă</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Zona content (Map sau List) */}
            <View style={styles.contentContainer}>
                {activeView === 'map' ? (
                    <MapViewContainer
                        locations={filteredLocations}
                        selectedLocation={selectedLocation}
                        onSelectLocation={setSelectedLocation}
                    />
                ) : (
                    <ListViewContainer locations={filteredLocations} onSelect={setSelectedLocation} />
                )}
            </View>

            <Text style={[styles.footerText, { backgroundColor, color: textColor }]}>
                Modul curent: {scheme === 'light' ? 'LUMINOS' : 'ÎNTUNECAT'} ({activeView === 'map' ? 'Hartă' : 'Listă'})
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    headerContainer: {
        width: '100%',
        paddingVertical: 4,   // mic padding de sus/jos
        paddingBottom: 8,
    },

    contentContainer: {
        flex: 1,  // ocupă tot restul spațiului
    },

    chipContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexShrink: 1,
    },
    chipActive: {
        backgroundColor: Colors.accent,
        borderColor: Colors.accent,
    },
    chipInactive: {
        backgroundColor: '#fff',
        borderColor: Colors.accent,
    },
    chipTextActive: { color: '#fff', fontSize: 14, textAlign: 'center' },
    chipTextInactive: { color: Colors.accent, fontSize: 14, textAlign: 'center' },

    segmentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 4,
        marginHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.accent,
        overflow: 'hidden',
    },
    segmentButton: { flex: 1, paddingVertical: 8, alignItems: 'center' },
    segmentActive: { backgroundColor: Colors.accent },
    segmentInactive: { backgroundColor: '#fff' },
    segmentTextActive: { color: '#fff', fontWeight: 'bold' },
    segmentTextInactive: { color: Colors.accent, fontWeight: 'bold' },

    footerText: { padding: 10, textAlign: 'center' },
});
