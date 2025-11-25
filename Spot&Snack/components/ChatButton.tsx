import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function ChatButton() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMsg = { role: 'user', content: message };
        setHistory((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await fetch("https://hackathonai-1.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    history
                })
            });

            const data = await res.json();

            const botMsg = { role: 'assistant', content: data.reply ?? "Eroare server." };

            setHistory((prev) => [...prev, botMsg]);

        } catch (err) {
            setHistory((prev) => [
                ...prev,
                { role: "assistant", content: "Eroare la server." }
            ]);
        }

        setLoading(false);
        setMessage('');
    };

    return (
        <>
            {/* Chat Icon */}
            <TouchableOpacity style={styles.chatIcon} onPress={() => setVisible(true)}>
                <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Modal Chat */}
            <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={() => setVisible(false)}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalContainer}
                >
                    <View style={styles.popup}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Chat</Text>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Ionicons name="close" size={28} color={Colors.text} />
                            </TouchableOpacity>
                        </View>

                        {/* Messages Scroll */}
                        <ScrollView style={styles.messagesContainer}>
                            {history.map((msg, idx) => (
                                <Text
                                    key={idx}
                                    style={[
                                        styles.message,
                                        msg.role === "user" ? styles.userMsg : styles.botMsg
                                    ]}
                                >
                                    {msg.content}
                                </Text>
                            ))}

                            {loading && (
                                <ActivityIndicator size="small" color={Colors.accent} style={{ marginTop: 10 }} />
                            )}
                        </ScrollView>

                        {/* Input */}
                        <TextInput
                            style={styles.input}
                            placeholder="Scrie mesajul..."
                            placeholderTextColor="#888"
                            value={message}
                            onChangeText={setMessage}
                        />

                        {/* Send */}
                        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                            <Text style={styles.sendText}>Trimite</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    chatIcon: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: Colors.accent,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
    },
    popup: {
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
    messagesContainer: { flex: 1, marginBottom: 12 },
    message: {
        marginVertical: 6,
        padding: 8,
        borderRadius: 6,
        fontSize: 14,
    },
    userMsg: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.accent,
        color: '#fff',
    },
    botMsg: {
        alignSelf: 'flex-start',
        backgroundColor: '#eaeaea',
        color: Colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        marginBottom: 12,
        color: Colors.text,
    },
    sendButton: {
        backgroundColor: Colors.accent,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    sendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
