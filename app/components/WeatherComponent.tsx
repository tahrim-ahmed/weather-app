import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    ImageBackground,
} from "react-native";
import * as Location from "expo-location";
import Country from "../library/country.json";
import {Entypo, Feather, Fontisto, MaterialCommunityIcons} from "@expo/vector-icons";

export default function WeatherComponent() {
    const [city, setCity] = useState<string>("");
    const [suggestions, setSuggestions] = useState<{ name: string; countryCode: string }[]>([]);
    const [weather, setWeather] = useState<any>(null);
    const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const inputRef = useRef<TextInput>(null);

    const API_KEY = "5f4bb45b66ce5e74105482477aff6431";

    useEffect(() => {
        const fetchDefaultWeather = async () => {
            try {
                const locationData = await Location.getCurrentPositionAsync({});

                if (locationData) {
                    const { latitude, longitude } = locationData.coords;

                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                    );

                    const forecastResponse = await axios.get(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                    );

                    const countryFullName = Country[response.data.sys.country] || response.data.sys.country;
                    setWeather({ ...response.data, fullCountryName: countryFullName });
                    setHourlyForecast(forecastResponse.data.list.slice(0, 12));
                    setCity(`${response.data.name}, ${countryFullName}`);
                }
            } catch (error) {
                Alert.alert("Error", "Failed to fetch weather data.");
            }
        };

        fetchDefaultWeather();
    }, [API_KEY]);

    return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ImageBackground
            source={{
                uri: "https://shako-bucket.s3.eu-central-1.amazonaws.com/invoice/dfWFlMF.png",
            }}
            resizeMode="cover"
            style={{ flex: 1 }}
            imageStyle={{ opacity: 0.8 }}
        >
            <View className="flex-1 p-4 bg-transparent">
                {errorMsg ? (
                    <Text className="text-red-500 text-center mt-4">{errorMsg}</Text>
                ) : weather ? (
                    <View>
                        <View className="p-5 rounded-xl items-center mb-4">
                            <Text className="text-4xl font-bold text-white">
                                {weather.main.temp}°C
                            </Text>
                            <Text className="text-2xl capitalize text-white">
                                {weather.weather[0].description}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <Text className="text-center text-lg mt-4 text-white">Fetching weather data...</Text>
                )}
            </View>
        </ImageBackground>
    </KeyboardAvoidingView>
    );
}
