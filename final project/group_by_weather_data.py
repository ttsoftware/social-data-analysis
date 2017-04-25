# coding=utf-8
import pandas

# weather_data_set = pandas.read_csv('new_york_weather_data.csv')
weather_data_set = pandas.read_csv('new_york_weather_data_datetime.csv')
traffic_data = pandas.read_csv('traffic_data_datetime_aggregation.csv')

# weather_data_set['DATE'] = weather_data_set['DATE'].apply(lambda date: str(date))
# weather_data_set['DATE'] = weather_data_set['DATE'].apply(lambda date: date[:4] + '-' + date[4:6] + '-' + date[6:8])
# weather_data_set['DATETIME'] = pandas.to_datetime(weather_data_set['DATE'])
#
# weather_data_set.to_csv('new_york_weather_data_datetime.csv')

# print weather_data_set.columns.values

# PRCP = precipitation
# SNWD = snow depth data
# SNOW = snow fall centimeters?
# TAVG = temperature average (always -9999?)
# TMAX = temperature max
# TMIN = temperature min

weather_data_set = weather_data_set[[
    'DATETIME',
    'PRCP',
    'SNWD',
    'SNOW',
    'TAVG',
    'TMAX',
    'TMIN'
]].copy()

traffic_data = pandas.merge(
    traffic_data,
    weather_data_set,
    how='left',
    on=['DATETIME'],
    sort=False,
    copy=True,
    indicator=False
)

#PRCP	SNWD	SNOW	TAVG	TMAX	TMIN

traffic_data['PRCP'] = pandas.to_numeric(traffic_data['PRCP'])
traffic_data['SNWD'] = pandas.to_numeric(traffic_data['SNWD'])
traffic_data['SNOW'] = pandas.to_numeric(traffic_data['SNOW'])
traffic_data['TAVG'] = pandas.to_numeric(traffic_data['TAVG'])
traffic_data['TMAX'] = pandas.to_numeric(traffic_data['TMAX'])
traffic_data['TMIN'] = pandas.to_numeric(traffic_data['TMIN'])
traffic_data['ACCIDENT COUNT'] = pandas.to_numeric(traffic_data['ACCIDENT COUNT'])

traffic_data.to_csv('traffic_data_datetime_aggregation_weather.csv')
