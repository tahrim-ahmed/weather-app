import React, {useState} from "react";
import {Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {MagnifyingGlassIcon} from "react-native-heroicons/outline";
import {CalendarDaysIcon, MapPinIcon} from "react-native-heroicons/solid";

export default function WeatherComponent() {
    const [search, toggleSearch] = useState(false);
    const [locationsData, setLocationsData] = useState([1,2,3]);

    const handleLocation = (location: string) => {

    }

    return (
        <View className="flex-1 relative">
            <StatusBar style="light" />
            <Image source={require('../../assets/images/weather/bg.png')} className="absolute h-full w-full" blurRadius={80} />

            <SafeAreaView className="flex flex-1">
                <View className="mt-3 mx-4 relative z-50" style={{height: '7%'}}>
                    <View className="flex-row justify-end items-center rounded-md" style={{backgroundColor: search ? 'rgba(255, 255, 255, 0.2)' : 'transparent'}}>
                        {search ? (
                            <TextInput placeholder="Search your city" placeholderTextColor={'lightgray'} className="pl-6 h-10 flex-1 text-base text-white" />
                        ) : null}

                        <TouchableOpacity className="p-3 m-1" onPress={() => toggleSearch(!search)}>
                            <MagnifyingGlassIcon size={25} color="white" />
                        </TouchableOpacity>
                    </View>

                    {locationsData.length > 0 && search ? (
                        <View className="absolute bg-gray-300 top-16 w-full rounded-md">
                            {locationsData.map((location, i) => {
                                let showBorder = i+1 != locationsData.length;
                                let borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';

                                return (
                                    <TouchableOpacity key={i} onPress={() => {handleLocation(location as any)}} className={`flex-row items-center b-0 p-3 px-4 mb-1 ${borderClass}`}>
                                        <MapPinIcon size={20} color="gray" />
                                        <Text className="text-black text-lg ml-2">
                                            London, United Kingdom
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    ) : null}
                </View>

                <View className="mx-4 flex flex-1 justify-around mb-2">
                    <Text className="text-white text-center text-2xl font-bold">
                        London,{' '}
                        <Text className="text-lg font-semibold text-gray-300">United Kingdom</Text>
                    </Text>

                    <View className="flex-row justify-center">
                        <Image source={require('../../assets/images/weather/cloudy-sun.png')} className="w-52 h-52"/>
                    </View>

                    <View className="space-y-2">
                        <Text className="text-center text-white font-bold text-6xl">23&#176;</Text>
                        <Text className="text-center text-white tracking-widest text-xl">Partly cloudy</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <View className="space-x-2 flex-row items-center gap-1">
                            <Image source={require('../../assets/images/weather/sunrise-icon.png')} className="h-6 w-6" />
                            <Text className="text-white font-semibold text-base">6:30 AM</Text>
                        </View>

                        <View className="space-x-2 flex-row items-center gap-1">
                            <Image source={require('../../assets/images/weather/drop.png')} className="h-6 w-6" />
                            <Text className="text-white font-semibold text-base">50%</Text>
                        </View>

                        <View className="space-x-2 flex-row items-center gap-1">
                            <Image source={require('../../assets/images/weather/wind.png')} className="h-6 w-6" />
                            <Text className="text-white font-semibold text-base">50km</Text>
                        </View>
                    </View>

                    <View className="space-y-3 mb-2">
                        <View className="flex-row items-center gap-1 mb-2">
                            <CalendarDaysIcon size={22} color="white" />
                            <Text className="text-white font-semibold text-base">Daily forecast</Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="space-y-1 mr-4 py-3 flex justify-center items-center w-24 rounded-md" style={{backgroundColor: 'rgba(255, 255, 255, 0.3)'}}>
                                <Image source={require('../../assets/images/weather/rainstorm.png')} className="h-12 w-12" />
                                <Text className="text-white">Monday</Text>
                                <Text className="text-white font-semibold text-xl">15&#176;</Text>
                            </View>

                            <View className="space-y-1 mr-4 py-3 flex justify-center items-center w-24 rounded-md" style={{backgroundColor: 'rgba(255, 255, 255, 0.3)'}}>
                                <Image source={require('../../assets/images/weather/rainstorm.png')} className="h-12 w-12" />
                                <Text className="text-white">Monday</Text>
                                <Text className="text-white font-semibold text-xl">15&#176;</Text>
                            </View>

                            <View className="space-y-1 mr-4 py-3 flex justify-center items-center w-24 rounded-md" style={{backgroundColor: 'rgba(255, 255, 255, 0.3)'}}>
                                <Image source={require('../../assets/images/weather/rainstorm.png')} className="h-12 w-12" />
                                <Text className="text-white">Monday</Text>
                                <Text className="text-white font-semibold text-xl">15&#176;</Text>
                            </View>

                            <View className="space-y-1 mr-4 py-3 flex justify-center items-center w-24 rounded-md" style={{backgroundColor: 'rgba(255, 255, 255, 0.3)'}}>
                                <Image source={require('../../assets/images/weather/rainstorm.png')} className="h-12 w-12" />
                                <Text className="text-white">Monday</Text>
                                <Text className="text-white font-semibold text-xl">15&#176;</Text>
                            </View>

                            <View className="space-y-1 mr-4 py-3 flex justify-center items-center w-24 rounded-md" style={{backgroundColor: 'rgba(255, 255, 255, 0.3)'}}>
                                <Image source={require('../../assets/images/weather/rainstorm.png')} className="h-12 w-12" />
                                <Text className="text-white">Monday</Text>
                                <Text className="text-white font-semibold text-xl">15&#176;</Text>
                            </View>

                            <View className="space-y-1 mr-4 py-3 flex justify-center items-center w-24 rounded-md" style={{backgroundColor: 'rgba(255, 255, 255, 0.3)'}}>
                                <Image source={require('../../assets/images/weather/rainstorm.png')} className="h-12 w-12" />
                                <Text className="text-white">Monday</Text>
                                <Text className="text-white font-semibold text-xl">15&#176;</Text>
                            </View>

                            <View className="space-y-1 mr-4 py-3 flex justify-center items-center w-24 rounded-md" style={{backgroundColor: 'rgba(255, 255, 255, 0.3)'}}>
                                <Image source={require('../../assets/images/weather/rainstorm.png')} className="h-12 w-12" />
                                <Text className="text-white">Monday</Text>
                                <Text className="text-white font-semibold text-xl">15&#176;</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
