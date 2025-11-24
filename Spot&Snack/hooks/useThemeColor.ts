// src/hooks/useThemeColor.ts
import { useColorScheme } from 'react-native';
import  Colors  from '../constants/Colors';

// Definește un tip pentru a asigura că proprietatea 'colorName' există
type ThemeColor = keyof typeof Colors.light;

/**
 * Hook care returnează valoarea culorii bazată pe modul curent al sistemului (light sau dark).
 * @param colorName Numele culorii din schema 'light'/'dark' (ex: 'background', 'text').
 * @returns Valoarea hexazecimală a culorii.
 */
// src/hooks/useThemeColor.ts

// ...

export function useThemeColor(colorName: ThemeColor): string {
    // 1. Verifică detectarea:
    const theme = useColorScheme() ?? 'light'; // Dacă detectează 'dark', funcționează.

    // 2. Verifică structura de acces:
    // Trebuie să fie Colors['dark'] sau Colors['light']
    return Colors[theme][colorName];
}