import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiKey } from '../constants';

const forecastEndpoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}`;
const locationsEndpoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async (endpoint, cacheKey) => {
  const cachedData = await AsyncStorage.getItem(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const options = {
    method: 'GET',
    url: endpoint,
  };

  try {
    const response = await axios.request(options);
    await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log('error: ', error);
    return {};
  }
};

export const fetchWeatherForecast = (params) => {
  let forecastUrl = forecastEndpoint(params);
  return apiCall(forecastUrl, `forecast-${params.cityName}`);
};

export const fetchLocations = (params) => {
  let locationsUrl = locationsEndpoint(params);
  return apiCall(locationsUrl, `locations-${params.cityName}`);
};
