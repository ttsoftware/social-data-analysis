# coding=utf-8

import pandas
import numpy as np

traffic_data = pandas.read_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week.csv')

# get all accidents with injuries
traffic_data_injured = traffic_data[traffic_data['NUMBER OF PERSONS INJURED'] > 0]

# uniform sample equal number of uninjured
traffic_data_uninjured = traffic_data[traffic_data['NUMBER OF PERSONS INJURED'] == 0]
traffic_data_uninjured = traffic_data_uninjured.sample(n=len(traffic_data_injured))

traffic_data = pandas.concat([traffic_data_injured, traffic_data_uninjured], ignore_index=True)
traffic_data.to_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week_50-50.csv')

