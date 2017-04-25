# coding=utf-8
import pandas

# PRCP = precipitation
# SNWD = snow depth data
# SNOW = snow fall centimeters?
# TAVG = temperature average
# TMAX = temperature max
# TMIN = temperature min

traffic_data = pandas.read_csv('traffic_data_datetime_aggregation_weather.csv')

correlation = traffic_data.corr('pearson')

print correlation.columns.values
print correlation['PRCP']['ACCIDENT COUNT']
print correlation['PRCP']['NUMBER OF PERSONS INJURED']