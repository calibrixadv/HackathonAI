import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

interface AuthFormProps {
    onSuccess: (user: { username: string; email: string }) => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);
        try {
            const url =
                mode === 'login'
                    ? 'https://hackathonai-etei.onrender.com/api/auth/login'
                    : 'https://hackathonai-etei.onrender.com/api/auth/register';

            const body: any = { email, password };
            if (mode === 'register') body.username = username;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                throw new Error(data.error || 'Auth failed');
            }

            onSuccess(data.user);
        } catch (err: any) {
            console.log(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {mode === 'register' && (
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#aaa"
                    value={username}
                    onChangeText={setUsername}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
                <Text style={styles.buttonText}>{mode === 'login' ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
                <Text style={styles.switchText}>
                    {mode === 'login' ? 'Nu ai cont? Înregistrează-te' : 'Ai deja cont? Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop:50,
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    button: {
        backgroundColor: Colors.accent,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    switchText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 8,
    },
});
