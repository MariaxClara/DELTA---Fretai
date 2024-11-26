export default class RouteOptimizer {
    constructor(username, password) {
        this.credentials = btoa(`${username}:${password}`);
    }

    async optimizeRoute(startPoint, endPoint, waypoints) {
        // Construir array de locations no formato esperado pela API
        const locations = [];
        
        // Adiciona ponto inicial
        locations.push({
            name: 'Start',
            lat: startPoint.lat,
            lng: startPoint.lng,
        });
        
        // Adiciona waypoints
        waypoints.forEach((point, index) => {
            locations.push({
                name: `Stop ${index + 1}`,
                lat: point.lat,
                lng: point.lng,
                restrictions: point.restrictions || {} // Opcional: janelas de tempo
            });
        });
        
        // Adiciona ponto final
        locations.push({
            name: 'End',
            lat: endPoint.lat,
            lng: endPoint.lng,
            restrictions: endPoint.restrictions || {}
        });

        console.log('Enviando para API:', locations); // Debug
        
        try {
            const response = await fetch('https://api.routexl.com/tour', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${this.credentials}`
                },
                body: `locations=${JSON.stringify(locations)}`
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return { locations, optimizedRoute: result.route };
        } catch (error) {
            console.error('Error optimizing route:', error);
            throw error;
        }
    }
}
