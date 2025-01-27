import React, {useEffect, useState} from "react";
import * as Location from "expo-location";
import axios from "axios";
import {Alert, Text, View} from "react-native";

export default function WeatherComponent() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [weather, setWeather] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const API_KEY = '5f4bb45b66ce5e74105482477aff6431';

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            await fetchWeather(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    const fetchWeather = async (latitude: number, longitude: number) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );
            setWeather(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch weather data.');
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-blue-50 p-4">
            {errorMsg ? (
                <Text className="text-red-600 text-center">{errorMsg}</Text>
            ) : weather ? (
                <View className="bg-white rounded-lg shadow-lg p-6">
                    <Text className="text-lg">Temperature: {weather.main.temp}°C</Text>
                    <Text className="text-lg">Humidity: {weather.main.humidity}%</Text>
                    <Text className="text-lg">Wind Speed: {weather.wind.speed} m/s</Text>
                </View>
            ) : (
                <Text className="text-center">Fetching weather data...</Text>
            )}
        </View>
    );
};