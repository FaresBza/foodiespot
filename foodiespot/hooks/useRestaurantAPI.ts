import { restaurantAPI } from "@/services/api";
import { Restaurant } from "@/types";
import { useState } from "react";
import { Alert } from "react-native";

const useRestaurantAPI = () => {

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await restaurantAPI.getRestaurants();
            setRestaurants(data);
        } catch (error) {
            // log.error("Failed to load restaurants", error);
            Alert.alert("Error", "Failed to load restaurants");
        }
        finally {
            setLoading(false);
        }
    };

    return { restaurants, loading, loadData }
}

export default useRestaurantAPI;