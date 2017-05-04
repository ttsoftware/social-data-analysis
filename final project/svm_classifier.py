# coding=utf-8
from __future__ import division

import cPickle
import pandas
import numpy as np
from sklearn.svm import SVC
from sklearn import decomposition
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV

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

# traffic_data['DATE_ENUM'] = map(lambda (k, v): k, enumerate(traffic_data['DATE']))
# traffic_data['TIME_ENUM'] = map(lambda (k, v): k, enumerate(traffic_data['TIME']))
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

# reduce data set to 100000 rows
print len(traffic_data)
traffic_data = traffic_data.sample(100000)

# select train and test set
train, validate, test = np.split(traffic_data.sample(frac=1), [int(.8*len(traffic_data)), int(.9*len(traffic_data))])

print train.shape, validate.shape, test.shape

# index 30 is "HAS_INJURED"
dummie_columns = list(traffic_data.columns.values)[34:]

print dummie_columns
print len(dummie_columns)

train_predictors = train[['ZIP CODE'] + dummie_columns]
train_targets = train['HAS_INJURED']

test_predictors = test[['ZIP CODE'] + dummie_columns]
test_targets = test['HAS_INJURED']

validate_predictors = validate[['ZIP CODE'] + dummie_columns]
validate_targets = validate['HAS_INJURED']

#classifier = SVC(kernel='rbf')
#classifier.fit(train_predictors, train_targets)
#print classifier.score(test_predictors, test_targets)
#print classifier.score(validate_predictors, validate_targets)

# Use Principal Component Analysis to reduce dimensionality and improve generalization
pca = decomposition.PCA()
svm = SVC()

# Combine PCA and SVC to a pipeline
pipe = Pipeline(steps=[('pca', pca), ('svm', svm)])

# Configure the cross-validation settings
params_grid = {
    'svm__C': [1],
    'svm__kernel': ['linear', 'rbf'],
    #'svm__gamma': [0.001, 0.0001],
    'pca__n_components': [2, 15, 70],
}

# perform cross-validation
estimator = GridSearchCV(pipe, params_grid)
estimator.fit(train_predictors, train_targets)

print estimator.best_params_, estimator.best_score_

# store model for further usage
with open('svm_classifier_100000_daytime_cross_validation.pkl', 'wb') as fid:
    cPickle.dump(estimator, fid)

# load it again
# with open('my_dumped_classifier.pkl', 'rb') as fid:
#     classifier_loaded = cPickle.load(fid)