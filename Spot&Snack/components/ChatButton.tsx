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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function ChatButton() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    return (
        <>
            {/* Chat Bubble Icon */}
            <TouchableOpacity style={styles.chatIcon} onPress={() => setVisible(true)}>
                <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Modal chat full-screen */}
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

                        {/* Scroll pentru mesaje */}
                        <ScrollView style={styles.messagesContainer}>
                            <Text style={styles.message}>Bun venit! Scrie mesajul tău mai jos.</Text>
                        </ScrollView>

                        {/* Input */}
                        <TextInput
                            style={styles.input}
                            placeholder="Scrie mesajul..."
                            placeholderTextColor="#888"
                            value={message}
                            onChangeText={setMessage}
                        />

                        {/* Trimite */}
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={() => {
                                console.log('Mesaj trimis:', message);
                                setMessage('');
                                setVisible(false);
                            }}
                        >
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
    message: { marginVertical: 4, fontSize: 14, color: Colors.text },
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

