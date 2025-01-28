import axios from "axios";
import {apiKey} from "@/utils/constants";

const getLocationsEndpoint = (cityName: string) => {
    return `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName}`;
};

const getForecastEndpoint = (cityName: string, days: number) => {
    return `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=${days}&aqi=no&alerts=no`
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

export const fetchWeather = async (cityName: string) => {
    return callApi(getLocationsEndpoint(cityName));
};

export const fetchForecast = async (cityName: string, days: number) => {
    return callApi(getForecastEndpoint(cityName, days));
};