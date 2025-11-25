import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AuthForm from '../../components/Profile/AuthForm';
import ProfileDetails from '../../components/Profile/ProfileDetails';

interface User {
    username: string;
    email: string;
}

export default function ProfileScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    // Funcție apelată de AuthForm la login/register cu succes
    const handleAuthSuccess = (userData: User) => {
        setUser(userData);
        setLoading(false);
    };

    // Delogare
    const handleLogout = () => {
        setUser(null);
    };

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.spinner}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}

            {!user && !loading && (
                <AuthForm
                    onSuccess={(data) => {
                        setLoading(true);
                        setTimeout(() => handleAuthSuccess(data), 1000); // simulare request
                    }}
                />
            )}

            {user && !loading && <ProfileDetails user={user} onLogout={handleLogout} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    spinner: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});
