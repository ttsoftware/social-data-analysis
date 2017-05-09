# coding=utf-8
from __future__ import division

import cPickle
import numpy as np
import pandas
from sklearn import preprocessing
from sklearn.svm import SVC

traffic_data_set = pandas.read_csv('traffic_data.csv')
traffic_data_set['DATETIME'] = pandas.to_datetime(traffic_data_set['DATE'])
traffic_data_set.to_csv('traffic_data_datetime.csv')

# group by date
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
traffic_data_set_accidents_per_date = pandas.DataFrame(
    traffic_data_set.groupby('DATETIME').size().rename('ACCIDENT COUNT'))
# Join datetime+accident-count with aggregation columns
traffic_data_set_accidents_per_date = traffic_data_set \
    .groupby('DATETIME') \
    .agg(aggregate_functions) \
    .join(traffic_data_set_accidents_per_date)

traffic_data_set_accidents_per_date.to_csv('traffic_data_datetime_aggregation.csv')

# add weather data

weather_data_set = pandas.read_csv('new_york_weather_data.csv')

weather_data_set['DATE'] = weather_data_set['DATE'].apply(lambda date: str(date))
weather_data_set['DATE'] = weather_data_set['DATE'].apply(lambda date: date[:4] + '-' + date[4:6] + '-' + date[6:8])
weather_data_set['DATETIME'] = pandas.to_datetime(weather_data_set['DATE'])

weather_data_set.to_csv('new_york_weather_data_datetime.csv')

weather_data_set = pandas.read_csv('new_york_weather_data_datetime.csv')
traffic_data = pandas.read_csv('traffic_data_datetime_aggregation.csv')

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

# PRCP	SNWD	SNOW	TAVG	TMAX	TMIN

traffic_data['PRCP'] = pandas.to_numeric(traffic_data['PRCP'])
traffic_data['SNWD'] = pandas.to_numeric(traffic_data['SNWD'])
traffic_data['SNOW'] = pandas.to_numeric(traffic_data['SNOW'])
traffic_data['TAVG'] = pandas.to_numeric(traffic_data['TAVG'])
traffic_data['TMAX'] = pandas.to_numeric(traffic_data['TMAX'])
traffic_data['TMIN'] = pandas.to_numeric(traffic_data['TMIN'])
traffic_data['ACCIDENT COUNT'] = pandas.to_numeric(traffic_data['ACCIDENT COUNT'])

traffic_data.to_csv('traffic_data_datetime_aggregation_weather.csv')

# find weather effects

# PRCP = precipitation
# SNWD = snow depth data
# SNOW = snow fall centimeters?
# TAVG = temperature average
# TMAX = temperature max
# TMIN = temperature min

traffic_data = pandas.read_csv('traffic_data_datetime_aggregation_weather.csv')

# calculate average
traffic_data['TAVG'] = map(lambda row: (row[15] + row[16]) / 2, traffic_data.values)

# normalize average temperature
traffic_data['TAVG'] = preprocessing \
    .MinMaxScaler() \
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

# plt.plot(traffic_data['TAVG'], traffic_data['NUMBER OF PERSONS INJURED'], 'ro')
# plt.show()

# fix zip codes in data set

traffic_data_set = pandas.read_csv('traffic_data_datetime.csv')

traffic_data_set = traffic_data_set.replace(r'^(\s+|)$', np.nan, regex=True)
traffic_data_set = traffic_data_set.dropna(subset=['ZIP CODE'])
traffic_data_set['ZIP CODE'] = pandas.to_numeric(traffic_data_set['ZIP CODE'], downcast='integer')

print len(traffic_data_set['ZIP CODE'])

traffic_data_set.to_csv('traffic_data_datetime_clean_zip.csv')

traffic_data = pandas.read_csv('traffic_data_datetime_clean_zip.csv')

# Map has_injured to boolean 0/1 depending on an injured occured in the given accident
traffic_data['HAS_INJURED'] = map(lambda x: 1 if int(x) > 0 else 0, traffic_data['NUMBER OF PERSONS INJURED'])

traffic_data.to_csv('traffic_data_has_injured_clean_zip.csv')

traffic_data = pandas.read_csv('traffic_data_has_injured_clean_zip.csv')

traffic_data['DATE_ENUM'] = map(lambda (k, v): k, enumerate(traffic_data['DATE']))
traffic_data['TIME_ENUM'] = map(lambda (k, v): k, enumerate(traffic_data['TIME']))

vehicle_types = pandas.get_dummies(
    traffic_data,
    prefix='VEHICLE_TYPE',
    prefix_sep='_',
    columns=[
        'VEHICLE TYPE CODE 1',
        # 'VEHICLE TYPE CODE 2',
        # 'VEHICLE TYPE CODE 3',
        # 'VEHICLE TYPE CODE 4',
        # 'VEHICLE TYPE CODE 5',
    ])

contributing_factor = pandas.get_dummies(
    traffic_data,
    prefix='CONTRIBUTING_FACTOR',
    prefix_sep='_',
    columns=[
        'CONTRIBUTING FACTOR VEHICLE 1',
        # 'CONTRIBUTING FACTOR VEHICLE 2',
        # 'CONTRIBUTING FACTOR VEHICLE 3',
        # 'CONTRIBUTING FACTOR VEHICLE 4',
        # 'CONTRIBUTING FACTOR VEHICLE 5'
    ])

boroughs = pandas.get_dummies(
    traffic_data,
    prefix='BOROUGH',
    prefix_sep='_',
    columns=[
        'BOROUGH'
    ])

traffic_data = pandas.merge(traffic_data, vehicle_types)
traffic_data = pandas.merge(traffic_data, contributing_factor)
traffic_data = pandas.merge(traffic_data, boroughs)

traffic_data.to_csv('traffic_data_has_injured_clean_zip_dummie_columns.csv')

# Add day of week
date_times = pandas.to_datetime(traffic_data['DATE'])
traffic_data['WEEK_DAY'] = date_times.dt.dayofweek
traffic_data['DATE_ENUM'] = map(lambda (k, v): k, enumerate(traffic_data['DATE']))
traffic_data['TIME_ENUM'] = map(lambda (k, v): k, enumerate(traffic_data['TIME']))

traffic_data['BOROUGH'] = traffic_data['BOROUGH'].fillna(0)
traffic_data['VEHICLE TYPE CODE 1'] = traffic_data['VEHICLE TYPE CODE 1'].fillna(0)
traffic_data['CONTRIBUTING FACTOR VEHICLE 1'] = traffic_data['CONTRIBUTING FACTOR VEHICLE 1'].fillna(0)

stacked_borough = traffic_data[['BOROUGH']].stack()
stacked_vehicle_type = traffic_data[['VEHICLE TYPE CODE 1']].stack()
stacked_contribution = traffic_data[['CONTRIBUTING FACTOR VEHICLE 1']].stack()

traffic_data['BOROUGH_enum'] = pandas.Series(stacked_borough.factorize()[0], index=stacked_borough.index).unstack()
traffic_data['VEHICLE_enum'] = pandas.Series(stacked_vehicle_type.factorize()[0], index=stacked_vehicle_type.index).unstack()
traffic_data['CONTRIBUTION_enum'] = pandas.Series(stacked_contribution.factorize()[0], index=stacked_contribution.index).unstack()

traffic_data['VEHICLE TYPE CODE 2'] = traffic_data['VEHICLE TYPE CODE 2'].fillna(0)
traffic_data['MULTIPLE_VEHICLES'] = traffic_data['VEHICLE TYPE CODE 2'] != 0

traffic_data['MULTIPLE_VEHICLES'] = traffic_data['VEHICLE TYPE CODE 2'] != 0

traffic_data.to_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week.csv')

# create 50/50 data set

traffic_data = pandas.read_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week.csv')

# get all accidents with injuries
traffic_data_injured = traffic_data[traffic_data['NUMBER OF PERSONS INJURED'] > 0]

# uniform sample equal number of uninjured
traffic_data_uninjured = traffic_data[traffic_data['NUMBER OF PERSONS INJURED'] == 0]
traffic_data_uninjured = traffic_data_uninjured.sample(n=len(traffic_data_injured))

traffic_data = pandas.concat([traffic_data_injured, traffic_data_uninjured], ignore_index=True)
traffic_data.to_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week_50-50.csv')

traffic_data = pandas.read_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week.csv')
traffic_data_50 = pandas.read_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week_50-50.csv')

# Perform training

# reduce data set to 100000 rows
print len(traffic_data)
traffic_data = traffic_data.sample(100000)
traffic_data_50 = traffic_data_50.sample(100000)

traffic_injuries_only = traffic_data[traffic_data['NUMBER OF PERSONS INJURED'] > 0]

# select train and test set
train, validate, test = np.split(traffic_data.sample(frac=1), [int(.8*len(traffic_data)), int(.9*len(traffic_data))])
_, validate_injuries, test_injuries = np.split(traffic_injuries_only.sample(frac=1), [int(.8 * len(traffic_injuries_only)), int(.9 * len(traffic_injuries_only))])
_, validate_50, test_50 = np.split(traffic_data_50.sample(frac=1), [int(.8 * len(traffic_data_50)), int(.9 * len(traffic_data_50))])

print train.shape, validate.shape, test.shape

dummie_columns = [
    'BOROUGH_enum',
    'VEHICLE_enum',
    'CONTRIBUTION_enum',
    'MULTIPLE_VEHICLES',
    'WEEK_DAY',
    'TIME_ENUM',
    'DATE_ENUM',
    'ZIP CODE',
]

print dummie_columns
print len(dummie_columns)

train_predictors = train[dummie_columns]
train_targets = train['HAS_INJURED']

test_predictors = test[dummie_columns]
test_targets = test['HAS_INJURED']

validate_predictors = validate[dummie_columns]
validate_targets = validate['HAS_INJURED']

test_injuries_predictors = test_injuries[dummie_columns]
test_injuries_targets = test_injuries['HAS_INJURED']

validate_injuries_predictors = validate_injuries[dummie_columns]
validate_injuries_targets = validate_injuries['HAS_INJURED']

test_50_predictors = test_50[dummie_columns]
test_50_targets = test_50['HAS_INJURED']

validate_50_predictors = validate_50[dummie_columns]
validate_50_targets = validate_50['HAS_INJURED']

estimator = SVC(C=1, kernel='rbf', gamma=0.001)
estimator.fit(train_predictors, train_targets)

# load it again
# with open('svm_classifier_100000_gamma_1.pkl', 'rb') as fid:
#     estimator = cPickle.load(fid)

print "Train"
print estimator.score(train_predictors, train_targets)

print "Test"
print estimator.score(test_predictors, test_targets)

print "Validation"
print estimator.score(validate_predictors, validate_targets)

print "Test 50/50"
print estimator.score(test_50_predictors, test_50_targets)

print "Validation 50/50"
print estimator.score(validate_50_predictors, validate_50_targets)

print "Only injuries test"
print estimator.score(test_injuries_predictors, test_injuries_targets)

print "Only injuries validation"
print estimator.score(validate_injuries_predictors, validate_injuries_targets)

# store model for further usage
with open('svm_classifier_100000_gamma_1.pkl', 'wb') as fid:
    cPickle.dump(estimator, fid)
