import { Tabs } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import ChatButton from '@/components/ChatButton';
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TabsLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors.accent,
                    tabBarInactiveTintColor: Colors.text,
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="explore"
                    options={{
                        title: 'Explore',
                        tabBarIcon: ({ color, size }) => <FontAwesome5 name="map-marked-alt" size={size} color={color} />
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profil',
                        tabBarIcon: ({ color, size }) => <FontAwesome5 name="user-circle" size={size} color={color} />
                    }}
                />
            </Tabs>

            <ChatButton />
        </ThemeProvider>
    );
}
