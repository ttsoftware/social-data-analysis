# coding=utf-8
from __future__ import division

import pandas
import numpy as np

traffic_data = pandas.read_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week.csv')
weather_data = pandas.read_csv('traffic_data_datetime_aggregation_weather_avg.csv')

traffic_data['DATETIME'] = pandas.to_datetime(traffic_data['DATE'])

zeros = np.zeros(len(traffic_data))
empty_column = map(lambda x: -9999, zeros)

traffic_data['PRCP'] = empty_column
traffic_data['TAVG'] = empty_column

weather_hash = {}

for j, weather_row in weather_data.iterrows():
    weather_hash[str(weather_row['DATETIME'])] = {}
    weather_hash[str(weather_row['DATETIME'])]['PRCP'] = weather_row['PRCP']
    weather_hash[str(weather_row['DATETIME'])]['TAVG'] = weather_row['TAVG']

# for each traffic incident
for i, traffic_row in traffic_data.iterrows():
    # if the same date, we add now columns
    if str(traffic_row['DATETIME']) in weather_hash:
        print str(traffic_row['DATETIME'])
        traffic_row['PRCP'] = weather_hash[str(traffic_row['DATETIME'])]['PRCP']
        traffic_row['TAVG'] = weather_hash[str(traffic_row['DATETIME'])]['TAVG']

del traffic_data['DATETIME']

traffic_data.to_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week_weather.csv')
