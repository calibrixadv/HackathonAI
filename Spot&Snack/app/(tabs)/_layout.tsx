import { Tabs } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import ChatButton from '@/components/ChatButton';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors.accent,
                    tabBarInactiveTintColor: Colors.text,
                    headerShown: false,
                    tabBarStyle: {
                        height: 70,
                        paddingBottom: 10,
                        paddingTop: 5,
                    },
                }}
            >
                <Tabs.Screen
                    name="explore"
                    options={{
                        title: 'Explore',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="map-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profil',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person-outline" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>

            {/* Chat button plutitor peste toate ecranele */}
            <ChatButton />
        </ThemeProvider>
    );
}
