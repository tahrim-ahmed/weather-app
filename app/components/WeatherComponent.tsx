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

export default function WeatherComponent() {
    const [city, setCity] = useState<string>("");
    const [suggestions, setSuggestions] = useState<{ name: string; countryCode: string }[]>([]);
    const [weather, setWeather] = useState<any>(null);
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
                    setCity(`${response.data.name}, ${countryFullName}`);
                }
            } catch (error) {
                Alert.alert("Error", "Failed to fetch weather data.");
            }
        };

        fetchDefaultWeather();
    }, [API_KEY]);

    const fetchCitySuggestions = async (query: string) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
            );
            const cities = response.data.map((location: any) => ({
                name: location.name,
                countryCode: location.country,
            }));
            setSuggestions(cities);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch city suggestions.");
        }
    };

    const fetchWeatherByCity = async (selectedCity: { name: string; countryCode: string }) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity.name},${selectedCity.countryCode}&units=metric&appid=${API_KEY}`
            );

            const countryFullName = Country[selectedCity.countryCode] || selectedCity.countryCode;
            setWeather({ ...response.data, fullCountryName: countryFullName });
            setCity(`${selectedCity.name}, ${countryFullName}`);
            setSuggestions([]);
            Keyboard.dismiss();
        } catch (error) {
            Alert.alert("Error", "Failed to fetch weather data for the city.");
        }
    };

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
                    <View className="mb-4 relative">
                        <TextInput
                            ref={inputRef}
                            value={city}
                            onChangeText={(text) => {
                                setCity(text);
                                fetchCitySuggestions(text);
                            }}
                            placeholder="Enter city name"
                            className="p-3 bg-white rounded-lg text-lg border border-gray-300"
                            onSubmitEditing={Keyboard.dismiss}
                        />

                        {suggestions.length > 0 && (
                            <View className="absolute top-14 left-0 right-0 bg-white rounded-lg border border-gray-300 max-h-52 overflow-hidden z-10">
                                <FlatList
                                    data={suggestions}
                                    keyExtractor={(item, index) => index.toString()}
                                    keyboardShouldPersistTaps="handled"
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => fetchWeatherByCity(item)}
                                            className="p-3 border-b border-gray-100"
                                        >
                                            <Text className="text-lg">
                                                {item.name}, {Country[item.countryCode] || item.countryCode}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}
                    </View>

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
