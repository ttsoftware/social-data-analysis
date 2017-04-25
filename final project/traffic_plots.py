# coding=utf-8
import pandas
import matplotlib.pyplot as plt

# PRCP = precipitation
# SNWD = snow depth data
# SNOW = snow fall centimeters?
# TAVG = temperature average
# TMAX = temperature max
# TMIN = temperature min

traffic_data = pandas.read_csv('traffic_data_datetime_aggregation_weather.csv')

plt.plot(traffic_data['PRCP'], traffic_data['ACCIDENT COUNT'], 'bs')
plt.show()