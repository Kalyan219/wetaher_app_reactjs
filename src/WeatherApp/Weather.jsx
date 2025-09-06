import { CloudRain, Droplet, GlassWater, Search, Sun, Wind } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
const popularCities = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Bhopal",
  "Patna",
  "Vadodara",
  "Visakhapatnam",
  "Coimbatore",
  "Ludhiana",
  "Agra",
  "Varanasi",
  "Madurai",
  "Nashik",
  "Rajkot",
  "Amritsar",
  "Meerut",
  "Allahabad (Prayagraj)",
  "Aurangabad",
  "Ranchi",
  "Guwahati",
  "Chandigarh",
  "Mysuru",
  "Thiruvananthapuram",
  "Kochi",
  "Vijayawada",
  "Trichy",
  "Jodhpur",
  "Udaipur"
];


const Weather = () => {
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
const [suggestions,setSuggestions] = useState([])
const [city,setCity] = useState('')
const [weatherData,setWeatherData] = useState(null)

const handleCityChange= (e) => {
    const value = e.target.value;
    setCity(value);
    if(value.length>0) {
        const matches = popularCities.filter((c) =>
        c.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
     ).slice(0,8)
     setSuggestions(matches)
    } else {
        setSuggestions([])
    }
}

const getWeatherData = async (cityName = city) => {
    const selectedCity = popularCities.find(
        (c) => c.toLowerCase() === cityName.toLowerCase()
    );
    if(!selectedCity) {
        alert("please select a valid city from suggestion");
        return;
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}`)
        setWeatherData(response.data)
        
        setCity('');
        setSuggestions([])
    } catch (error) {
        console.log(error)
    }
}

const handleSuggestionOnCLick = (suggestions) => {
    setCity(suggestions);
    getWeatherData(suggestions)
}

const getWeatherIcon = (main) => {
    switch(main) {
        case "Clear":
            return <Sun size={80} strokeWidth={1.5} />
        case "Clouds":
            return <CloudRain size={80} strokeWidth={1.5} />
        case "Rain":
            return <CloudRain size={80} strokeWidth={1.5} />
        case "Drizzle":
            return <CloudRain size={80} strokeWidth={1.5} />
        case "Snow" :
            return <CloudRain size={80} className='rotate-45' strokeWidth={1.5} />
        case "ThunderStorm":
            return <CloudRain size={80} className='amit-pulse' strokeWidth={1.5} />
        case "Mist":
        case "Fog":
            return <CloudRain size={80} strokeWidth={1.5} />
        default:
            return <CloudRain size={80} strokeWidth={1.5} />

    }
}

  return (
    <div className='relative flex justify-center items-center px-4 min-h-screen bg-weather-gradient'>
        <div className='max-w-5xl w-full shadow-2xl p-8 bg-weather-gradient backdrop-blur-sm
             rounded-2xl space-y-6 border-white/20'
        >
           <div className='flex flex-col md:flex-row justify-between items-centergap-4 relative'>
             <h1 className='font-bold text-4xl text-white tracking-wide'>Weather Now</h1>
             <div className='w-full md:w-auto relative'>
                <div className='flex items-center space-x-3'>
                   <input type='text' placeholder='Enter a city' 
                    className='px-4 py-2 w-full bg-white/20 placeholder-white text-white border-2 border-white
                    rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300'
                    value={city}
                    onChange={handleCityChange}
                   />
                   <button className='p-3 cursor-pointer' onClick={() => getWeatherData()}>
                     <Search size={28} className='text-white' />
                   </button>
                </div>
                {suggestions.length>0 && 
                <ul className='absloute z-10 w-full bg-white text-black mt-2 rounded-xl
                          overflow-hidden shadow-md max-h-48 overflow-y-auto'
                > 
                   {suggestions.map((s,index) => (
                    <li key={index} onClick={() => handleSuggestionOnCLick(s)}
                      className='px-4 py-2 hover:bg-purple-100 cursor-pointer'>
                      {s}
                    </li>
                   ))}
                </ul>}
             </div>
           </div>
           {/*weather display*/}
           <div className='flex flex-col md:flex-row justify-between items-center
           bg-weather-gradient backdrop-blur-sm rounded-xl p-6 shadow-xl space-y-4
           md:space-y-0'>
             <div className='space-y-2 text-center md:text-left'>
                 <div className='flex items-start justify-center md:justify-start
                 space-x-2'>
                    <h2 className="text-7xl md:text-8xl text-white font-bold">
                       {weatherData?.main ? Math.round(weatherData.main.temp - 273.15) : "--"}
                    </h2>

                    <span className='text-3xl md:text-5xl text-white'>deg C</span>
                 </div>
                 <h3 className='text-white text-xl md:text-2xl font-medium'>
                    {`${weatherData.name} , ${weatherData.sys.country}`}
                 </h3>
                 <h4 className='text-white text-lg md:text-xl capitalize'>
                    {weatherData.weather[0].main}
                 </h4>
             </div>
             <div className='text-white'>
                  {getWeatherIcon(weatherData.weather[0].main)}
             </div>
           </div>
           {/*info boxes*/}
           <div className='grid grid-col-2 md:grid-cols-4 gap-4 text-white'> 
            <WatherBox icon={<Droplet size={32} />} title={"Humidity"} value={`${weatherData.main.humidity
            }%`}/>
            <WatherBox icon={<GlassWater size={32} />} title={"Pressure"} value={`${weatherData.main.pressure
            }pHa`}/>
            <WatherBox icon={<Wind size={32} />} title={"Wind Speed"} value={`${weatherData.wind.speed
            }kmph`}/>
            <WatherBox icon={<Droplet size={32} />} title={"Feels Like"} value={`${Math.round(weatherData.main.feels_like-273.15
           )} deg C`}/>
           </div>
        </div>
    </div>
  )
}

const WatherBox = ({icon,title,value}) => {
    return (
        <div className='backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col items-center
        space-y-2 border-white/20 hover:scale-105 transition-transform'>
          <div className='text-white'>
            {icon}
          </div>
          <h3 className='text-lg font-semibold'>{title}</h3>
          <p className='text-xl font-bold'>{value}</p>
        </div>
    )
}

export default Weather