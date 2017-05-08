# coding=utf-8
from __future__ import division

import cPickle
import pandas
import numpy as np
from sklearn.svm import SVC
from sklearn import decomposition
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV

# traffic_data = pandas.read_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week_50-50.csv')
traffic_data = pandas.read_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week.csv')

# print traffic_data.columns.values

# Map has_injured to boolean 0/1 depending on an injured occured in the given accident
# traffic_data['HAS_INJURED'] = map(lambda x: 1 if int(x) > 0 else 0, traffic_data['NUMBER OF PERSONS INJURED'])
# traffic_data.to_csv('traffic_data_has_injured.csv')

# remove invalid zip codes
# traffic_data = traffic_data.replace(r'^(\s+|)$', np.nan, regex=True)
# traffic_data = traffic_data.dropna(subset=['ZIP CODE'])
# traffic_data['ZIP CODE'] = pandas.to_numeric(traffic_data['ZIP CODE'], downcast='integer')
#
# traffic_data.to_csv('traffic_data_has_injured_clean_zip.csv')

traffic_data['DATE_ENUM'] = map(lambda (k, v): k, enumerate(traffic_data['DATE']))
traffic_data['TIME_ENUM'] = map(lambda (k, v): k, enumerate(traffic_data['TIME']))

#
# vehicle_types = pandas.get_dummies(
#     traffic_data,
#     prefix='VEHICLE_TYPE',
#     prefix_sep='_',
#     columns=[
#         'VEHICLE TYPE CODE 1',
#         # 'VEHICLE TYPE CODE 2',
#         # 'VEHICLE TYPE CODE 3',
#         # 'VEHICLE TYPE CODE 4',
#         # 'VEHICLE TYPE CODE 5',
#     ])
#
# contributing_factor = pandas.get_dummies(
#     traffic_data,
#     prefix='CONTRIBUTING_FACTOR',
#     prefix_sep='_',
#     columns=[
#         'CONTRIBUTING FACTOR VEHICLE 1',
#         # 'CONTRIBUTING FACTOR VEHICLE 2',
#         # 'CONTRIBUTING FACTOR VEHICLE 3',
#         # 'CONTRIBUTING FACTOR VEHICLE 4',
#         # 'CONTRIBUTING FACTOR VEHICLE 5'
#     ])
#
# boroughs = pandas.get_dummies(
#     traffic_data,
#     prefix='BOROUGH',
#     prefix_sep='_',
#     columns=[
#         'BOROUGH'
#     ])
#
# traffic_data = pandas.merge(traffic_data, vehicle_types)
# traffic_data = pandas.merge(traffic_data, contributing_factor)
# traffic_data = pandas.merge(traffic_data, boroughs)
#
# traffic_data.to_csv('traffic_data_has_injured_clean_zip_dummie_columns.csv')

# Fix date time values
# date_times = pandas.to_datetime(traffic_data['DATE'])
#
# # Add day of week
# traffic_data['WEEK_DAY'] = date_times.dt.dayofweek
#
# traffic_data.to_csv('traffic_data_has_injured_clean_zip_dummie_columns_day_of_week.csv')

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

# reduce data set to 100000 rows
print len(traffic_data)
traffic_data = traffic_data.sample(10000)

traffic_test_data = traffic_data[traffic_data['NUMBER OF PERSONS INJURED'] > 0]

# select train and test set
train, validate, test = np.split(traffic_data.sample(frac=1), [int(.8*len(traffic_data)), int(.9*len(traffic_data))])
_, validate_injuries, test_injuries = np.split(traffic_test_data.sample(frac=1), [int(.8*len(traffic_test_data)), int(.9*len(traffic_test_data))])

print train.shape, validate.shape, test.shape

# index 30 is "HAS_INJURED"
# dummie_columns = list(traffic_data.columns.values)[35:]
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

# classifier = SVC(kernel='rbf')
# classifier.fit(train_predictors, train_targets)
# print classifier.score(test_predictors, test_targets)
# print classifier.score(validate_predictors, validate_targets)

# Use Principal Component Analysis to reduce dimensionality and improve generalization
pca = decomposition.PCA()
svm = SVC()

# Combine PCA and SVC to a pipeline
pipe = Pipeline(steps=[('pca', pca), ('svm', svm)])

# Configure the cross-validation settings
params_grid = {
    # 'svm__C': [1, 100, 1000],
    'svm__kernel': ['linear', 'rbf'],
    # 'svm__gamma': [0.001, 0.0001],
    'pca__n_components': [8],
}

# perform cross-validation
estimator = GridSearchCV(pipe, params_grid)
estimator.fit(train_predictors, train_targets)

print estimator.best_params_, estimator.best_score_
print pca.inverse_transform

print estimator.score(test_predictors, test_targets)
print estimator.score(validate_predictors, validate_targets)

print estimator.score(test_injuries_predictors, test_injuries_targets)
print estimator.score(validate_injuries_predictors, validate_injuries_targets)

# store model for further usage
with open('svm_classifier_10000_cross_validation.pkl', 'wb') as fid:
    cPickle.dump(estimator, fid)

# load it again
# with open('my_dumped_classifier.pkl', 'rb') as fid:
#     classifier_loaded = cPickle.load(fid)