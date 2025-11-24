// src/constants/MapStyle.ts

// Acesta este un exemplu de stil. Vei genera propriul JSON din Styling Wizard.
// Am încercat să aproximeze culorile tale, dar ajustarea manuală e esențială.
export const MapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            { "color": "#FBFBF5" } // Fundal deschis (backgroundLight)
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            { "visibility": "off" } // Ascunde iconițele punctelor de interes
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#1E1E1E" } // Text gri închis (textDark)
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#7C3AED" } // Numele orașelor cu culoarea primară
        ]
    },
    {
        "featureType": "poi", // Puncte de interes
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#8E8E93" } // Gri pentru textul POI
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            { "color": "#FFFFFF" } // Drumuri albe
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            { "color": "#7C3AED" } // Arterele principale mov
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            { "color": "#FACC15" } // Autostrăzile galben accent
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#1E1E1E" } // Numele străzilor
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            { "color": "#FACC15" } // Liniile de tranzit galben accent
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            { "color": "#D1D1D6" } // Apă gri deschis sau o nuanță subtilă de mov
        ]
    }
];