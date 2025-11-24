import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExploreHeaderProps {
    title: string;
    mascotIcon?: React.ReactNode;
}

export default function ExploreHeader({ title, mascotIcon }: ExploreHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {mascotIcon && <View>{mascotIcon}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 50, // status bar + margin
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    title: { fontSize: 22, fontWeight: 'bold' },
});
