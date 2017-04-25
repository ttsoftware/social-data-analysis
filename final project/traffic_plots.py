# coding=utf-8
from __future__ import division

import pandas
import matplotlib.pyplot as plt

# PRCP = precipitation
# SNWD = snow depth data
# SNOW = snow fall centimeters?
# TAVG = temperature average
# TMAX = temperature max
# TMIN = temperature min
from sklearn import preprocessing

traffic_data = pandas.read_csv('traffic_data_datetime_aggregation_weather.csv')

# calculate average
traffic_data['TAVG'] = map(lambda row: (row[15] + row[16]) / 2, traffic_data.values)

# normalize average temperature
traffic_data['TAVG'] = preprocessing\
    .MinMaxScaler()\
    .fit_transform(traffic_data['TAVG'].values)

correlation = traffic_data.corr('pearson')

print correlation.columns.values

print "\n"
print correlation['PRCP']['ACCIDENT COUNT']
print correlation['PRCP']['NUMBER OF PERSONS INJURED']

# http://www.rff.org/research/publications/how-climate-change-affects-traffic-accidents
# We see a pretty strong correlation between high average temperatures and number of persons injured

print "\n"
print correlation['TAVG']['ACCIDENT COUNT']
print correlation['TAVG']['NUMBER OF PERSONS INJURED']
print correlation['TAVG']['NUMBER OF PERSONS KILLED']


plt.plot(traffic_data['TAVG'], traffic_data['NUMBER OF PERSONS INJURED'], 'ro')
plt.show()