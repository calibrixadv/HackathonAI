import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import Colors from '../constants/Colors';
import { LocationItem } from './LocationItem';

interface Props {
    visible: boolean;
    onClose: () => void;
    location: LocationItem | null;
}

export default function LocationDetailsModal({ visible, onClose, location }: Props) {
    const [vibe, setVibe] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!location) return null;

    async function generateVibe() {
        setLoading(true);
        setVibe(null);

        try {
            const res = await fetch("https://hackathonai-1.onrender.com/vibe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ place_index: location!.id })
            });

            const data = await res.json();
            setVibe(data.vibe || "Nu am primit niciun vibe din server.");
        } catch (err) {
            setVibe("Eroare la server.");
        }

        setLoading(false);
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <ScrollView>
                        <Image source={{ uri: location.image_url }} style={styles.image} />

                        <Text style={styles.name}>{location.name}</Text>
                        <Text style={styles.rating}>⭐ {location.rating.toFixed(1)}</Text>

                        <Text style={styles.section}>Adresă:</Text>
                        <Text style={styles.text}>{location.address}</Text>

                        <Text style={styles.section}>Descriere:</Text>
                        <Text style={styles.text}>{location.short_description}</Text>

                        {/* Generează vibe */}
                        <TouchableOpacity style={styles.vibeBtn} onPress={generateVibe}>
                            <Text style={styles.vibeText}>Generează vibe</Text>
                        </TouchableOpacity>

                        {loading && (
                            <ActivityIndicator size="large" color={Colors.accent} style={{ marginTop: 10 }} />
                        )}

                        {vibe && (
                            <View style={styles.vibeBox}>
                                <Text style={styles.vibeResult}>{vibe}</Text>
                            </View>
                        )}

                        {/* Închidere */}
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Text style={styles.closeText}>Închide</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 15,
    },
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        maxHeight: '90%',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    rating: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    section: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    text: {
        fontSize: 14,
        color: '#444',
        marginBottom: 8,
    },
    vibeBtn: {
        backgroundColor: Colors.accent,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    vibeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    vibeBox: {
        backgroundColor: '#f4f4f4',
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
    },
    vibeResult: {
        fontSize: 14,
        color: '#333',
    },
    closeBtn: {
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#444',
        alignItems: 'center',
    },
    closeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
