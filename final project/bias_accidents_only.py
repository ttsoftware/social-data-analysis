# coding=utf-8

import pandas

traffic_data = pandas.read_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week.csv')

# get all accidents with injuries
traffic_data_injured = traffic_data[traffic_data['NUMBER OF PERSONS INJURED'] > 0]
traffic_data_injured.to_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week_accidents_only.csv')

