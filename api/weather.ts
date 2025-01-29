import axios from "axios";
import { EXPO_PUBLIC_WEATHER_BASE_URL, EXPO_PUBLIC_WEATHER_API_KEY } from '@env';

const getCityEndpoint = (latitude: number, longitude: number) => {
    return `${EXPO_PUBLIC_WEATHER_BASE_URL}/search.json?key=${EXPO_PUBLIC_WEATHER_API_KEY}&q=${latitude},${longitude}`;
};

const getForecastEndpoint = (cityName: string, days: number) => {
    return `${EXPO_PUBLIC_WEATHER_BASE_URL}/forecast.json?key=${EXPO_PUBLIC_WEATHER_API_KEY}&q=${cityName}&days=${days}&aqi=no&alerts=no`
}

const callApi = async (endpoint: string) => {
    const options = {
        method: "GET",
        url: endpoint,
    }

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchCity = async (latitude: number, longitude: number) => {
    return callApi(getCityEndpoint(latitude, longitude));
};

export const fetchForecast = async (cityName: string, days: number) => {
    return callApi(getForecastEndpoint(cityName, days));
};

export const getWeatherImage = (condition: string) => {
    switch (condition) {
        case 'Partly cloudy':
            return require('../assets/images/weather/cloudy-sun.png');
        case 'Moderate rain':
        case 'Patchy rain possible':
        case 'Light rain':
        case 'Moderate rain at times':
        case 'Patchy rain nearby':
            return require('../assets/images/weather/moderate.png');
        case 'Sunny':
        case 'Clear':
            return require('../assets/images/weather/sun.png');
        case 'Overcast':
        case 'Cloudy':
            return require('../assets/images/weather/cloud.png');
        case 'Heavy rain':
        case 'Heavy rain at times':
        case 'Moderate or heavy freezing rain':
        case 'Moderate or heavy rain shower':
        case 'Moderate or heavy rain with thunder':
            return require('../assets/images/weather/rainstorm.png');
        default:
            return require('../assets/images/weather/moderate.png');
    }
};
