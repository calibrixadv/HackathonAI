import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface ProfileDetailsProps {
    user: {
        username: string;
        email: string;
    };
    onLogout: () => void; // callback pentru delogare
}

export default function ProfileDetails({ user, onLogout }: ProfileDetailsProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profilul tău</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Username:</Text>
                <Text style={styles.value}>{user.username}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>
            </View>

            <Image
                source={{ uri: `https://ui-avatars.com/api/?name=${user.username}` }}
                style={styles.avatar}
            />

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutText}>Delogare</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 24,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#ccc',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 32,
    },
    logoutButton: {
        marginTop: 40,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        alignSelf: 'center',
    },
    logoutText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
