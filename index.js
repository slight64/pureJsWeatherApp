const link = 'https://api.weatherstack.com/current?access_key=8bb7cfca85c614597d04d956020160a5';

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const form = document.getElementById('form');
const closePopup = document.getElementById('close');
// переименовать объект store и посмотреть как будет работать 

// значения по умолчанию
let store = {
  city: 'Saratov',
  temperature: 0,
  observationTime: '00:00',
  isDay: 'yes',
  weatherDescriptions: '',
  properties: {
    cloudcover: 0,
    humidity: 0,
    windSpeed: 0,
    visibility: 0,
    uvIndex: 0,
    pressure: 0,
  }
}

const fetchData = async () => {
  try {
    const query = localStorage.getItem('query') || store.city;
    const result = await fetch(`${link}&query=${query}`);
    const data = await result.json();
    const {
      current: {
        cloudcover,
        humidity,
        temperature,
        observation_time: observationTime,
        pressure,
        uv_index: uvIndex,
        visibility,
        is_day: isDay,
        weather_descriptions: weatherDescriptions,
        wind_speed: windSpeed
      },
      location: {
        name
      },
    } = data;

    store = {
      ...store,
      city: name,
      temperature,
      observationTime,
      isDay,
      weatherDescriptions: weatherDescriptions[0],
      properties: {
        cloudcover: {
          title: 'cloudcover',
          value: `${cloudcover}%`,
          icon: 'cloud.png'
        },
        humidity: {
          title: 'humidity',
          value: `${humidity}%`,
          icon: 'humidity.png'
        },
        windSpeed: {
          title: 'wind speed',
          value: `${windSpeed} km/h`,
          icon: 'wind.png'
        },
        visibility: {
          title: 'visibility',
          value: `${visibility}%`,
          icon: 'visibility.png'
        },
        uvIndex: {
          title: 'uv index',
          value: uvIndex,
          icon: 'uv-index.png'
        },
        pressure: {
          title: 'pressure',
          value: `${pressure} mmHg`,
          icon: 'gauge.png',
        }
      }
    };
    renderComponent();
  } catch (err) {
    console.log(err);
  };
};

const getImage = (description) => {
  const value = description.toLowerCase();

  switch (value) {
    case 'overcast':
      return 'partly.png';
    case 'partly cloudy':
      return 'cloud.png';
    case 'fog':
      return 'fog.png';
    case 'sunny':
      return 'sunny.png';
    case 'clear':
      return 'clear.png';
    default:
      return 'the.png';
  };
};

const renderProperty = (properties) => {
  return Object.values(properties).map(({ title, value, icon }) => {
    return `<div class="property">
    <div class="property-icon">
      <img src="./img/icons/${icon}" alt="">
    </div>
    <div class="property-info">
      <div class="property-info__value">${value}</div>
      <div class="property-info__description">${title}</div>
    </div>
  </div>`
  }).join('');
};

const markup = () => {
  const {
    city,
    weatherDescriptions,
    observationTime,
    temperature,
    isDay,
    properties
  } = store;
  const containerClass = isDay === 'yes' ? 'is-day' : '';

  return `<div class="container ${containerClass}"> 
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                <img class="icon" src="./img/${getImage(weatherDescriptions)}" alt="" />
                <div class="description">${weatherDescriptions}</div>
              </div>
            
              <div class="top-right">
                <div class="city-info__subtitle">as of ${observationTime}</div>
                <div class="city-info__title">${temperature}°</div>
              </div>
            </div>
          </div>
           <div id="properties">${renderProperty(properties)}</div>
          </div>`
};

const togglePopupClass = () => {
  popup.classList.toggle('active');
};

const renderComponent = () => {
  root.innerHTML = markup();

  const city = document.getElementById('city');
  city.addEventListener('click', togglePopupClass);
};

const handleInput = (event) => {
  store = {
    ...store,
    city: event.target.value
  };
};

const handleSubmit = (event) => {
  event.preventDefault();
  const value = store.city;
  if (!value) return null;

  localStorage.setItem('query',value);
  fetchData();
  togglePopupClass();
};

form.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);
closePopup.addEventListener('click', togglePopupClass);
fetchData();

