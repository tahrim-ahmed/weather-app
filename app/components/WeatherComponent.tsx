import React, {useEffect, useState} from "react";
import {Alert, Image, SafeAreaView, ScrollView, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {CalendarDaysIcon} from "react-native-heroicons/solid";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import {SchedulableTriggerInputTypes} from "expo-notifications";
import {fetchCity, fetchForecast, getWeatherImage} from "@/api/weather";
import * as Progress from "react-native-progress";

export default function WeatherComponent() {
    const [cityName, setCityName] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [weatherData, setWeatherData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);

    const getLocation = async () => {
        setLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission Denied",
                    "We need location permissions to fetch your city name."
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const { latitude, longitude } = location.coords;

            const response = await fetchCity(latitude, longitude);
            if (response && response.length > 0) {
                setCityName(response[0]?.name);
                setCountry(response[0].country);
            } else {
                console.error("City not found");
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    const scheduleNotification = async (message: string) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Weather Update",
                body: message,
            },
            trigger: { seconds: 10800, repeats: true, type: SchedulableTriggerInputTypes.TIME_INTERVAL },
        });
    };

    const setupNotifications = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Notification Permission Denied",
                "Please enable notifications to get weather updates."
            );
            return;
        }

        if (weatherData?.current?.temp_c) {
            const message = `Current temperature in ${cityName}: ${weatherData.current.temp_c}°C, ${weatherData.current.condition?.text}.`;
            await scheduleNotification(message);
        }
    };

    useEffect(() => {
        getLocation().then(() => {
            fetchForecast(cityName as string, 7)
                .then((data) => {
                    setWeatherData(data);
                })
                .finally(() => {
                    setLoading(false);
                });
        });
    }, [cityName]);

    useEffect(() => {
        if (weatherData && cityName) {
            setupNotifications();
        }
    }, [weatherData]);

    const { current } = weatherData;

    return (
        <View className="flex-1 relative">
            <StatusBar style="dark" />
            <Image
                source={require("../../assets/images/weather/bg.png")}
                className="absolute !h-full !w-full"
                blurRadius={80}
            />

            {loading ? (
                <View className="flex flex-1 justify-center items-center">
                    <Progress.Circle size={100} indeterminate={true} color="#fff" />
                </View>
            ) : (
                <SafeAreaView className="flex flex-1">
                    <View className="mx-4 flex flex-1 justify-around mb-2">
                        <Text className="text-white text-center text-2xl font-bold">
                            {cityName + ", "}
                            <Text className="text-lg font-semibold text-gray-300">
                                {country}
                            </Text>
                        </Text>

                        <View className="flex-row justify-center">
                            <Image
                                source={getWeatherImage(current?.condition?.text)}
                                className="w-52 h-52"
                            />
                        </View>

                        <View className="space-y-2">
                            <Text className="text-center text-white font-bold text-6xl">
                                {current?.temp_c}°C
                            </Text>
                            <Text className="text-center text-white tracking-widest text-xl">
                                {current?.condition?.text}
                            </Text>
                        </View>

                        <View className="flex-row justify-between">
                            <View className="space-x-2 flex-col items-center gap-1">
                                <Image
                                    source={require("../../assets/images/weather/sunrise-icon.png")}
                                    className="h-6 w-6"
                                />
                                <Text className="text-white font-semibold text-base">
                                    {weatherData?.forecast?.forecastday[0]?.astro?.sunrise}
                                </Text>
                            </View>

                            <View className="space-x-2 flex-col items-center gap-1">
                                <Image
                                    source={require("../../assets/images/weather/drop.png")}
                                    className="h-6 w-6"
                                />
                                <Text className="text-white font-semibold text-base">
                                    {current?.humidity}%
                                </Text>
                            </View>

                            <View className="space-x-2 flex-col items-center gap-1">
                                <Image
                                    source={require("../../assets/images/weather/wind.png")}
                                    className="h-6 w-6"
                                />
                                <Text className="text-white font-semibold text-base">
                                    {current?.wind_kph} kph
                                </Text>
                            </View>
                        </View>

                        <View className="space-y-3 mb-2">
                            <View className="flex-row items-center gap-1 mb-2">
                                <CalendarDaysIcon size={22} color="white" />
                                <Text className="text-white font-semibold text-base">
                                    Daily forecast
                                </Text>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {weatherData?.forecast?.forecastday.map((forecast, index) => {
                                    let date = new Date(forecast?.date);
                                    let dayName = date.toLocaleDateString("en-US", {
                                        weekday: "long",
                                    });
                                    dayName = dayName.split(",")[0];

                                    return (
                                        <View
                                            key={index}
                                            className="space-y-1 mr-4 py-3 flex justify-center items-center w-24 rounded-md"
                                            style={{
                                                backgroundColor: "rgba(255, 255, 255, 0.3)",
                                            }}
                                        >
                                            <Image
                                                source={getWeatherImage(
                                                    forecast?.day?.condition?.text
                                                )}
                                                className="h-12 w-12"
                                            />
                                            <Text className="text-white">{dayName}</Text>
                                            <Text className="text-white font-semibold text-xl">
                                                {forecast?.day?.avgtemp_c}°C
                                            </Text>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </SafeAreaView>
            )}
        </View>
    );
}
