/**
 * Heavily adapted from
 * https://github.com/fiestah/angular-money-directive
 * http://www.chroder.com/2014/02/01/using-ngmodelcontroller-with-custom-directives/
 */

angular.module('angular-directive-decimal', [])
  .directive('decimal', function () {
    'use strict';

    var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
    var PRECISION_MIN = 0;
    var PRECISION_DEFAULT = 2;
    var MIN_DEFAULT = 0;
    var DEBUG = false;

    var min = MIN_DEFAULT;
    var precision = PRECISION_DEFAULT;
    var max;

    var isValidNumber = function (value, ngModelCtrl) {

      if (ngModelCtrl.$isEmpty(value)) {
        return true;
      } else {
        return NUMBER_REGEXP.test(value);
      }
    };

    var roundToPrecision = function (value, precision) {
      var d = Math.pow(10, precision);
      return Math.round(value * d) / d;
    };

    var formatToPrecision = function (value, precision) {
      if (precision < 0) {
        precision = 0;
      }
      return parseFloat(value).toFixed(precision);
    };

    var formatViewDataIntoModelData = function (viewValue, ngModelCtrl) {

      var value = viewValue;
      var parsedValue;

      // need to handle the situation when the field is invalid due to a validation rule only from this directive
      //     if (ngModelCtrl.$error && !ngModelCtrl.$error.decimal) {
      // or any other validation error should not stop the view from updating the model, so don't use ngModelCtrl.$valid
      //
      // notice an issue when updating the directive and another validation rule was causing the view to not update the model

      if (ngModelCtrl.$error && !ngModelCtrl.$error.decimal) {

        if (ngModelCtrl.$isEmpty(value)) {
          // handle empty view data since we can't covert it back to a decimal
          parsedValue = "";
        } else {

          // check for non numeric
          var valid = isValidNumber(value, ngModelCtrl);

          if (!valid) {
            value = '';
            ngModelCtrl.$setValidity('decimal', false);
          }

          if (valid) {
            // handle precision
            if (precision > -1) {
              value = roundToPrecision(value, precision);
            } else {
              value = parseFloat(value);
            }
          }

          parsedValue = value;
        }
      } else {
        // if there is an error, then just return back the current view data
        parsedValue = "";
      }

      return parsedValue;
    };

    var formatModelDataIntoViewData = function (modelValue, ngModelCtrl) {

      var value = parseFloat(modelValue);
      var formattedValue;

      // if this directives validation rules say it is invalid, then we do not want to process the model data.  Just set it to the view data
      // however if another rules validation makes this directive invalid, then we need to handle that based on...
      //    if the view data is not updated, then just set it to the model data so the user can see what data is causing the error
      //    if the view data is updated already, then the validation rules could be preventing the model data from updating...so just return the view data
      //
      // notice an issue when updating the directive and another validation rule was causing the view to not update the model
      // notice another issue when updating the directive and another validation rule caused the model to not get updated, but then when click off the directive
      // a format would fire and the model value would be blank (since it wasn't updated) and then then view value would blank out

      if (ngModelCtrl.$valid) {

        // handle empty view data
        if (ngModelCtrl.$isEmpty(value)) {
          formattedValue = "";
        } else {

          // handle non numeric
          var valid = isValidNumber(value, ngModelCtrl);

          if (!valid) {
            value = '';
            ngModelCtrl.$setValidity('decimal', false);
          }

          if (valid) {

            // handle precision
            if (precision > -1) {
              value = roundToPrecision(value, precision);
              value = formatToPrecision(value, precision);
            }
          }

          formattedValue = value.toString();
        }
      } else {

        if (ngModelCtrl.$isEmpty(ngModelCtrl.$viewValue)) {
          // if the view data is empty, assume it hasn't been updated yet...so use the model data for the return value
          formattedValue = modelValue.toString();
        } else {
          // if the view data is not empty, assume it has been updated...so just return the view value
          formattedValue = ngModelCtrl.$viewValue;
        }
      }

      return formattedValue;
    };

    var minValidator = function (value, ngModelCtrl) {

      if (!ngModelCtrl.$isEmpty(value)) {
        var parsed = parseFloat(value);
        if (!isNaN(parsed) && parsed < min) {
          ngModelCtrl.$setValidity('decimal', false);
        }
      }

      return value;
    };

    var maxValidator = function (value, ngModelCtrl) {

      if (!ngModelCtrl.$isEmpty(value)) {
        var parsed = parseFloat(value);
        if (!isNaN(parsed) && value > max) {
          ngModelCtrl.$setValidity('decimal', false);
        }
      }

      return value;
    };

    var addParsers = function (ngModelCtrl, attrs) {

      // when the view data changes, the code executes the parses in order that they are added to the stack
      // so add them in order that you want them to execute...use push

      // EXECUTE 1st (START)
      // reset the validity whenever the view data changes
      ngModelCtrl.$parsers.push(function (viewValue) {
        ngModelCtrl.$setValidity('decimal', true);
        var newModelData = viewValue;
        DEBUG ? console.log("ngModelCtrl.$parsers $setValidity newModelData:" + newModelData) : "";
        return newModelData;
      });

      // EXECUTE 2nd
      // perform min validation whenever the view data changes
      ngModelCtrl.$parsers.push(function (viewValue) {
        var newModelData = minValidator(viewValue, ngModelCtrl);
        DEBUG ? console.log("ngModelCtrl.$parsers minValidator newModelData:" + newModelData) : "";
        return newModelData;
      });

      // EXECUTE 3rd (if attribute present)
      // Max validation (optional)
      if (angular.isDefined(attrs.max)) {
        // perform max validation whenever the view data changes
        ngModelCtrl.$parsers.push(function (viewValue) {
          var newModelData = maxValidator(viewValue, ngModelCtrl);
          DEBUG ? console.log("ngModelCtrl.$parsers maxValidator newModelData:" + newModelData) : "";
          return newModelData;
        });
      }

      // EXECUTE 4th (LAST)
      // perform specific formatting for the data
      ngModelCtrl.$parsers.push(function (viewValue) {
        var newModelData = formatViewDataIntoModelData(viewValue, ngModelCtrl);
        DEBUG ? console.log("ngModelCtrl.$parsers formatViewDataIntoModelData newModelData:" + newModelData) : "";
        return newModelData;
      });

    };

    var addFormatters = function (ngModelCtrl, attrs) {

      // when the model data changes, the code executes the formatters in reverse order that they are added to the stack
      // so add them in reverse order that you want them to execute...use unshift instead of push

      // EXECUTE 1st (START)
      // reset the validity whenever the model data changes
      ngModelCtrl.$formatters.unshift(function (modelValue) {
        ngModelCtrl.$setValidity('decimal', true);
        var newViewData = modelValue;
        DEBUG ? console.log("ngModelCtrl.$formatters $setValidity newViewData:" + newViewData) : "";
        return newViewData;
      });

      // EXECUTE 2nd
      // perform min validation whenever the model data changes
      ngModelCtrl.$formatters.unshift(function (modelValue) {
        var newViewData = minValidator(modelValue, ngModelCtrl);
        DEBUG ? console.log("ngModelCtrl.$formatters minValidator newViewData:" + newViewData) : "";
        return newViewData;
      });

      // EXECUTE 3rd (if attribute present)
      // Max validation (optional)
      if (angular.isDefined(attrs.max)) {
        // perform max validation whenever the model data changes
        ngModelCtrl.$formatters.unshift(function (modelValue) {
          var newViewData = maxValidator(modelValue, ngModelCtrl);
          DEBUG ? console.log("ngModelCtrl.$formatters maxValidator newViewData:" + newViewData) : "";
          return newViewData;
        });
      }

      // EXECUTE 4th (LAST)
      // perform specific formatting for the model (parser) or view (formatter)
      ngModelCtrl.$formatters.unshift(function (modelValue) {
        var newViewData = formatModelDataIntoViewData(modelValue, ngModelCtrl);
        DEBUG ? console.log("ngModelCtrl.$formatters formatModelDataIntoViewData newViewData:" + newViewData) : "";
        return newViewData;
      });
    };

    function link(scope, el, attrs, ngModelCtrl) {

      // when the view model changes, the code executes the parses in order that they are added to the stack
      // so add them in order that you want them to execute

      // parsers execute whenever the view data changes
      // then process that data into the model data
      addParsers(ngModelCtrl, attrs);


      // formatters execute whenever the model data changes
      // then process that data into the view data
      addFormatters(ngModelCtrl, attrs);

      // Auto-format on blur
      el.bind('blur', function () {
        var viewValue;

        // since the view data has changed...the parseViewToModel has already ran and updated the $modelValue
        if (ngModelCtrl.$valid) {
          // if the data is valid, run the formatter to update the $viewValue
          var modelValue = ngModelCtrl.$modelValue;
          viewValue = formatModelDataIntoViewData(modelValue, ngModelCtrl);
          ngModelCtrl.$setViewValue(viewValue);
          DEBUG ? console.log("ngModelCtrl.onBlur updated-viewValue:" + viewValue) : "";
          ngModelCtrl.$render();   // forces the DOM to update
        } else {
          viewValue = ngModelCtrl.$viewValue;
          DEBUG ? console.log("ngModelCtrl.onBlur current-viewValue:" + viewValue) : "";
        }
      });

      attrs.$observe('precision', function (value) {
        var parsed = parseFloat(value);
        if (isNaN(parsed)) {
          parsed = PRECISION_DEFAULT;
        } else if (parsed < 0) {
          // special case to disable parsing
        } else if (parsed < PRECISION_MIN) {
          parsed = PRECISION_MIN;
        }

        precision = parsed;
      });

      attrs.$observe('min', function (value) {
        var parsed = parseFloat(value);
        min = !isNaN(parsed) ? parsed : MIN_DEFAULT;
      });

      // Max validation (optional)
      if (angular.isDefined(attrs.max)) {
        attrs.$observe('max', function (value) {
          var parsed = parseFloat(value);
          max = parsed;
        });
      }
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };
  }
);
