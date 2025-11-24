// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Exemplu de pachet de iconițe

export default function TabLayout() {
    const primaryColor = '#7C3AED'; // Mov Intens

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: primaryColor,
                headerShown: false, // Ascunde titlul de sus, opțional
            }}
        >
            <Tabs.Screen
                name="explore" // Numele trebuie să se potrivească cu explore.tsx
                options={{
                    title: 'Explorare',
                    tabBarIcon: ({ color }) => <Ionicons name="compass" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile" // Numele trebuie să se potrivească cu profile.tsx
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}