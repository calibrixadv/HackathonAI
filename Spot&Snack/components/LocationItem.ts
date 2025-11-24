export class LocationItem {
    id: number;
    name: string;
    address: string;
    coordinates: { lat: number; long: number };
    image_url: string;
    short_description: string;
    rating: number;
    categories: string[];

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.address = data.address;
        this.coordinates = data.coordinates;
        this.image_url = data.image_url;
        this.short_description = data.short_description;
        this.rating = data.rating;
        this.categories = data.categories || [];
    }

    getPrimaryCategory() {
        return this.categories[0] || 'Other';
    }

    getPinColor() {
        if (this.rating >= 4.6) return '#FFD700'; // galben
        if (this.rating >= 4.0) return '#8B2DD1'; // mov
        return '#888'; // gri
    }
}
