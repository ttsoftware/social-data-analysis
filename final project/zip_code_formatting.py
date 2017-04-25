# coding=utf-8
import pandas
import numpy as np

traffic_data_set = pandas.read_csv('traffic_data_datetime.csv')

traffic_data_set = traffic_data_set.replace(r'^(\s+|)$', np.nan, regex=True)
traffic_data_set = traffic_data_set.dropna(subset=['ZIP CODE'])

traffic_data_set['ZIP CODE'] = pandas.to_numeric(traffic_data_set['ZIP CODE'], downcast='integer')

print len(traffic_data_set['ZIP CODE'])

traffic_data_set.to_csv('traffic_data_datetime_clean_zip.csv')