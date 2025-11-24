// utils/locationHelpers.ts
import { LocationItem } from '../components/LocationItem';
import Colors from '../constants/Colors';

export function getLocationType(loc: LocationItem): string {
    const name = loc.name.toLowerCase();
    const desc = loc.short_description.toLowerCase();

    if (name.includes('coffee') || desc.includes('caf')) return 'Cafea / Study';
    if (name.includes('vegan') || desc.includes('vegan')) return 'Vegan / Healthy';
    if (name.includes('burger') || desc.includes('fast food')) return 'Fast-food / Burger';
    if (name.includes('restaurant') || desc.includes('traditional')) return 'Mâncare tradițională';
    return 'Altele';
}

export function getPinColor(rating: number | undefined) {
    if (!rating) return Colors.gray;
    if (rating >= 4.6) return 'gold';
    if (rating >= 4.0) return Colors.primary;
    return Colors.gray;
}

export function getPinIcon(type: string) {
    switch (type) {
        case 'Cafea / Study': return '☕️';
        case 'Vegan / Healthy': return '🌿';
        case 'Fast-food / Burger': return '🍔';
        case 'Mâncare tradițională': return '🍽';
        default: return '📍';
    }
}
