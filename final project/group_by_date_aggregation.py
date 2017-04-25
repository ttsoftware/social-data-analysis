# coding=utf-8
import pandas

traffic_data_set = pandas.read_csv('traffic_data.csv')
traffic_data_set['DATETIME'] = pandas.to_datetime(traffic_data_set['DATE'])
traffic_data_set.to_csv('traffic_data_datetime.csv')

print traffic_data_set.columns.values

aggregate_columns = [
    'NUMBER OF PERSONS INJURED',
    'NUMBER OF PERSONS KILLED',
    'NUMBER OF PEDESTRIANS INJURED',
    'NUMBER OF PEDESTRIANS KILLED',
    'NUMBER OF CYCLIST INJURED',
    'NUMBER OF CYCLIST KILLED',
    'NUMBER OF MOTORIST INJURED',
    'NUMBER OF MOTORIST KILLED',
]

aggregate_functions = {
    'NUMBER OF PERSONS INJURED': sum,
    'NUMBER OF PERSONS KILLED': sum,
    'NUMBER OF PEDESTRIANS INJURED': sum,
    'NUMBER OF PEDESTRIANS KILLED': sum,
    'NUMBER OF CYCLIST INJURED': sum,
    'NUMBER OF CYCLIST KILLED': sum,
    'NUMBER OF MOTORIST INJURED': sum,
    'NUMBER OF MOTORIST KILLED': sum
}

# Remove NaN's from the aggregation_columns
traffic_data_set = traffic_data_set.dropna(subset=aggregate_columns)

# Count number of accidents per date
traffic_data_set_accidents_per_date = pandas.DataFrame(traffic_data_set.groupby('DATETIME').size().rename('ACCIDENT COUNT'))
# Join datetime+accident-count with aggregation columns
traffic_data_set_accidents_per_date = traffic_data_set \
    .groupby('DATETIME') \
    .agg(aggregate_functions)\
    .join(traffic_data_set_accidents_per_date)

traffic_data_set_accidents_per_date.to_csv('traffic_data_datetime_aggregation.csv')
