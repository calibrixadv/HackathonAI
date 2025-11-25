import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import LocationCard from './LocationCard';
import { LocationItem } from './LocationItem';

export default function LocationsScreen({ locations }: { locations: LocationItem[] }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [vibeText, setVibeText] = useState("");

    async function generateVibe() {
        if (!selectedLocation) return;

        try {
            setLoading(true);
            setVibeText("");

            const res = await fetch("https://hackathonai-1.onrender.com/vibe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    place_index: selectedLocation.id
                })
            });

            const data = await res.json();
            setVibeText(data.vibe || "Nu am putut genera vibe-ul.");
        } catch (err) {
            setVibeText("Eroare server.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <ScrollView>
                {locations.map(loc => (
                    <LocationCard
                        key={loc.id}
                        location={loc}
                        onPress={(item) => {
                            setSelectedLocation(item);
                            setModalVisible(true);
                        }}
                    />
                ))}
            </ScrollView>

            {/* Popup detalii */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                            <Text style={{ fontSize: 18 }}>✕</Text>
                        </TouchableOpacity>

                        {selectedLocation && (
                            <ScrollView>
                                <Image source={{ uri: selectedLocation.image_url }} style={styles.image} />

                                <Text style={styles.title}>{selectedLocation.name}</Text>
                                <Text style={styles.address}>{selectedLocation.address}</Text>
                                <Text style={styles.description}>{selectedLocation.short_description}</Text>

                                <TouchableOpacity
                                    style={styles.vibeBtn}
                                    onPress={generateVibe}
                                >
                                    <Text style={styles.vibeText}>Generează vibe</Text>
                                </TouchableOpacity>

                                {loading && <ActivityIndicator size="large" color="#8000ff" />}

                                {vibeText !== "" && (
                                    <View style={styles.vibeBox}>
                                        <Text style={styles.vibeResult}>{vibeText}</Text>
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 20,
    },
    modalBox: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        maxHeight: "85%",
    },
    closeBtn: {
        alignSelf: "flex-end",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginBottom: 12
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 6,
    },
    address: {
        fontSize: 14,
        color: "#555",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
    },
    vibeBtn: {
        backgroundColor: "#8000ff",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 14,
    },
    vibeText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    vibeBox: {
        backgroundColor: "#f5f0ff",
        padding: 10,
        borderRadius: 10,
        marginTop: 10
    },
    vibeResult: {
        fontSize: 14,
        color: "#333"
    }
});
