import { cache } from '@/services/cache';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

import { storage } from '@/services/storage';
import { Dish, Restaurant, SearchFilters } from '@/types';




const api = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    async requestConfig => {
        const token = await storage.getItem('token');
        if (token) {
            requestConfig.headers.Authorization = `Bearer ${token}`;
        }

        return requestConfig;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            await storage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

const checkConnection = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
}



// Mock data for testing
const mockRestaurants: Restaurant[] = [
    {
        id: 'r1',
        name: 'Bistro Parisien',
        cuisine: 'Française',
        description: 'Cuisine bistronomique et produit frais',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.8,
        reviewsCount: 450,
        deliveryTime: 30,
        distance: 1.8,
        priceRange: '€€€',
        address: '12 rue de Rivoli, Paris, France',
        phone: '+33 1 23 45 67 89',
        coordinates: {
            latitude: 48.8566,
            longitude: 2.3522,
        },
        isOpen: true,
        isFavorite: false,
    },
    {
        id: 'r2',
        name: 'Tokyo Roll',
        cuisine: 'Sushi',
        description: 'Sushi rools, poke bowls et specialités japonaises',
        image: 'https://plus.unsplash.com/premium_photo-1668146927669-f2edf6e86f6f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3VzaGl8ZW58MHx8MHx8fDA%3D',
        rating: 4.6,
        reviewsCount: 320,
        deliveryTime: 30,
        distance: 1.2,
        priceRange: '€€€',
        address: '12 rue de Rivoli, Paris, France',
        phone: '+33 1 23 45 67 89',
        coordinates: {
            latitude: 48.8566,
            longitude: 2.3522,
        },
        isOpen: true,
        isFavorite: false,
    },
    {
        id: 'r3',
        name: 'Pizzeria Uno',
        cuisine: 'Italienne',
        description: 'Pizzas base tomate et base blanche',
        image: 'https://images.unsplash.com/photo-1716237389409-2a8eb869d74a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.8,
        reviewsCount: 280,
        deliveryTime: 25,
        distance: 0.5,
        priceRange: '€',
        address: '12 rue de Rivoli, Paris, France',
        phone: '+33 1 23 45 67 89',
        coordinates: {
            latitude: 48.8566,
            longitude: 2.3522,
        },
        isOpen: true,
        isFavorite: false,
    },
    {
        id: 'r4',
        name: 'Planet Bowl',
        cuisine: 'Japonaise',
        description: 'Poke bowls',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.4,
        reviewsCount: 235,
        deliveryTime: 30,
        distance: 0.9,
        priceRange: '€€',
        address: '12 rue de Rivoli, Paris, France',
        phone: '+33 1 23 45 67 89',
        coordinates: {
            latitude: 48.8566,
            longitude: 2.3522,
        },
        isOpen: true,
        isFavorite: false,
    },

];

const mockMenus: Record<string, Dish[]> = {
    r1: [
        {
            id: 'd1',
            resurantId: 'r1',
            name: 'Boeuf Bourguignon',
            description: 'Boeuf mijoté au vin rouge avec légumes de saison',
            price: 18.5,
            image:
                'https://plus.unsplash.com/premium_photo-1726776138836-6ba2de99c2e7?q=80&w=1902&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Plats',
            isAvailable: true,
        },
        {
            id: 'd2',
            resurantId: 'r1',
            name: 'Tarte Framboises',
            description: 'Tarte aux framboises sauvages',
            price: 7.0,
            image:
                'https://images.unsplash.com/photo-1666418918306-57a80e04bab9?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Desserts',
            isAvailable: true,
        },
        {
            id: 'd5',
            resurantId: 'r1',
            name: "Soupe à l'oignon gratinée",
            description: "Soupe traditionnelle, croûtons et fromage gratiné",
            price: 8.5,
            image:
                'https://plus.unsplash.com/premium_photo-1727960325953-ef51e51d73f1?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Entrées',
            isAvailable: true,
        },
    ],

    r2: [
        {
            id: 'd3',
            resurantId: 'r2',
            name: 'California Roll',
            description: 'Rouleau de sushi avec crabe, avocat et concombre',
            price: 12.0,
            image:
                'https://plus.unsplash.com/premium_photo-1664472644125-f12aecccdd52?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Sushi',
            isAvailable: true,
        },
        {
            id: 'd6',
            resurantId: 'r2',
            name: 'Nigiri (12 pcs)',
            description: 'Nigiri au saumon frais, riz vinaigré',
            price: 13.5,
            image:
                'https://plus.unsplash.com/premium_photo-1723662039343-1d25b547210b?q=80&w=2493&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Sushi',
            isAvailable: true,
        },
        {
            id: 'd7',
            resurantId: 'r2',
            name: 'Sashimi Mix (12 pcs)',
            description: 'Assortiment de sashimi saumon, thon, daurade',
            price: 18.0,
            image:
                'https://images.unsplash.com/photo-1638866381709-071747b518c8?q=80&w=2312&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Sashimi',
            isAvailable: true,
        },
        {
            id: 'd8',
            resurantId: 'r2',
            name: 'Sushi Mix',
            description: 'Assortiment de plusieurs sushis',
            price: 14.5,
            image:
                'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Poke Bowls',
            isAvailable: true,
        },
        {
            id: 'd9',
            resurantId: 'r2',
            name: 'Gyoza Poulet (6 pcs)',
            description: 'Raviolis japonais grillés, sauce ponzu',
            price: 7.5,
            image:
                'https://images.unsplash.com/photo-1664138218128-2dcf791a9d27?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Entrées',
            isAvailable: true,
        },
    ],

    r3: [
        {
            id: 'd10',
            resurantId: 'r3',
            name: 'Margherita',
            description: 'Sauce tomate, mozzarella, basilic',
            price: 10.0,
            image:
                'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Pizzas',
            isAvailable: true,
        },
        {
            id: 'd11',
            resurantId: 'r3',
            name: 'Reine',
            description: 'Sauce tomate, mozzarella, jambon, champignons',
            price: 12.0,
            image:
                'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2070&auto=format&fit=crop',
            category: 'Pizzas',
            isAvailable: true,
        },
        {
            id: 'd12',
            resurantId: 'r3',
            name: 'Pepperoni',
            description: 'Base blanche, mozzarella, gorgonzola, chèvre, parmesan',
            price: 13.5,
            image:
                'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Pizzas',
            isAvailable: true,
        },
        {
            id: 'd13',
            resurantId: 'r3',
            name: 'Diavola',
            description: 'Sauce tomate, mozzarella, salami piquant, olives',
            price: 14.0,
            image:
                'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=2070&auto=format&fit=crop',
            category: 'Pizzas',
            isAvailable: true,
        },
    ],

    r4: [
        {
            id: 'd4',
            resurantId: 'r4',
            name: 'Poke Bowl Saumon',
            description: 'Riz, saumon cru, avocat, concombre, edamame, algues, sauce soja',
            price: 14.0,
            image:
                'https://plus.unsplash.com/premium_photo-1698867575026-6b96ce023119?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Poke Bowls',
            isAvailable: true,
        },
        {
            id: 'd14',
            resurantId: 'r4',
            name: 'Poke Bowl Poulet Teriyaki',
            description: 'Riz, poulet teriyaki, carottes, chou rouge, sésame, sauce maison',
            price: 13.5,
            image:
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Poke Bowls',
            isAvailable: true,
        },
        {
            id: 'd15',
            resurantId: 'r4',
            name: 'Poke Bowl Végétarien',
            description: 'Riz, tomates, brocolis, cèleri, chou, champingnons, sauce soja-sésame',
            price: 12.5,
            image:
                'https://plus.unsplash.com/premium_photo-1698867576608-f8dbde8ecbe8?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Poke Bowls',
            isAvailable: true,
        },
        {
            id: 'd16',
            resurantId: 'r4',
            name: 'Poke Bowl Crevettes',
            description: 'Riz, crevettes, edamame, ananas, oignons frits, sauce spicy mayo',
            price: 14.5,
            image:
                'https://images.unsplash.com/photo-1602881917760-7379db593981?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category: 'Poke Bowls',
            isAvailable: true,
        },
    ],
};


// APIs
export const restaurantAPI = {

    async getRestaurants(filters?: SearchFilters): Promise<Restaurant[]> {

        const isConnected = await checkConnection();

        if (!isConnected) {
            // log.warn('Offline: Loading cached restaurants');
            const cached = await cache.get<Restaurant[]>('restaurants');
            return cached && cached.length > 0 ? cached : mockRestaurants;
        }

        try {
            const response = await api.get('/restaurants', { params: filters });
            const restaurants = response.data?.length ? response.data : mockRestaurants;
            await cache.set('restaurants', restaurants);
            return restaurants;
        } catch (error) {
            // log.error('Failed to fetch restaurants', error);
            const cached = await cache.get<Restaurant[]>('restaurants');
            return cached && cached.length > 0 ? cached : mockRestaurants;
        }
    },
    async searchRestaurants(query: string): Promise<Restaurant[]> {
        try {

            const filteredRestaurants = mockRestaurants.filter(restaurant => restaurant.name.toLowerCase().includes(query.toLowerCase()));
            return filteredRestaurants;

            // const response = await api.get('/restaurants/search', { params: { q: query } });
            // return response.data;
        } catch (error) {
            // log.error('Failed to search restaurants', error);
            return [];
        }

    },
    async getRestaurantById(id: string): Promise<Restaurant | null> {
        const isConnected = await checkConnection();

        if (!isConnected) {
            const cached = await cache.get<Restaurant>(`restaurant_${id}`);
            return cached;
        }

        try {
            const response = await api.get(`/restaurants/${id}`);
            const restaurant = response.data || mockRestaurants.find(r => r.id === id);
            if (restaurant) {
                await cache.set(`restaurant_${id}`, restaurant);
            }
            return restaurant || null;

        } catch (error) {
            // log.error(`Failed to fetch restaurant ${id}`, error);
            return (await cache.get<Restaurant>(`restaurant_${id}`)) || mockRestaurants.find(r => r.id === id) || null;
        }

    },
    async getMenu(restaurantId: string): Promise<Dish[]> {
        const isConnected = await checkConnection();

        if (!isConnected) {
            const cached = await cache.get<Dish[]>(`menu_${restaurantId}`);
            return cached || [];
        }

        try {
            const response = await api.get(`/restaurants/${restaurantId}/menu`);
            const menu = response.data?.length ? response.data : mockMenus[restaurantId] || [];
            await cache.set(`menu_${restaurantId}`, menu);
            return menu;
        } catch (error) {
            // log.error(`Failed to fetch menu for restaurant ${restaurantId}`, error);
            const cached = await cache.get<Dish[]>(`menu_${restaurantId}`);
            return (cached && cached.length > 0) ? cached : mockMenus[restaurantId] || [];
        }
    }
}

export const userAPI = {
    async toggleFavorite(restaurantId: string) {
    }
}