import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';

export default function ProfileScreen() {
    const [mode, setMode] = useState<'login' | 'register' | 'profile'>('login');
    const [loading, setLoading] = useState(false);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // User info
    const [user, setUser] = useState<any>(null);

    // Simulare: dacă găsim un "token" în memoria locală, trecem în modul profile
    useEffect(() => {
        // aici în viitor citim tokenul din secure storage
        const fakeToken = null;
        if (fakeToken) {
            setMode('profile');
            setUser({ name: "Test User", email: "test@example.com" });
        }
    }, []);

    const onLogin = async () => {
        setLoading(true);

        try {
            // aici vei face fetch către serverul Node.js
            // exemplu:
            // const res = await fetch("http://localhost:3000/api/auth/login", {
            //     method: "POST",
            //     credentials: "include",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ email, password })
            // });

            await new Promise(res => setTimeout(res, 1000)); // delay temporar

            // simulare login reușit
            setUser({ name: "John Doe", email });
            setMode('profile');

        } catch (err) {
            console.log("Login error", err);
        }

        setLoading(false);
    };

    const onRegister = async () => {
        setLoading(true);

        try {
            // fetch către backend
            await new Promise(res => setTimeout(res, 1000));

            setUser({ name, email });
            setMode('profile');

        } catch (err) {
            console.log("Register error", err);
        }

        setLoading(false);
    };

    const onLogout = () => {
        // aici ștergi cookie + token din secure storage
        setUser(null);
        setEmail('');
        setPassword('');
        setName('');
        setMode('login');
    };

    // -----------------------------
    // UI STATES
    // -----------------------------

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        );
    }

    if (mode === 'profile' && user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Profil</Text>

                <View style={styles.profileBox}>
                    <Text style={styles.label}>Nume</Text>
                    <Text style={styles.value}>{user.name}</Text>

                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{user.email}</Text>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {mode === 'login' ? "Autentificare" : "Înregistrare"}
            </Text>

            {mode === 'register' && (
                <TextInput
                    style={styles.input}
                    placeholder="Nume complet"
                    value={name}
                    onChangeText={setName}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Parolă"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={styles.mainBtn}
                onPress={mode === 'login' ? onLogin : onRegister}
            >
                <Text style={styles.mainBtnText}>
                    {mode === 'login' ? "Intră în cont" : "Creează cont"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
                <Text style={styles.switchText}>
                    {mode === 'login' ? "Nu ai cont? Înregistrează-te" : "Ai deja cont? Loghează-te"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 80,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.text,
    },
    input: {
        backgroundColor: Colors.card,
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 1,
    },
    mainBtn: {
        backgroundColor: Colors.accent,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
    },
    mainBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    switchText: {
        color: Colors.accent,
        textAlign: 'center',
        marginTop: 12,
        fontSize: 14,
    },
    profileBox: {
        backgroundColor: Colors.card,
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        color: Colors.text,
        marginBottom: 8,
    },
    logoutBtn: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        borderRadius: 10,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
