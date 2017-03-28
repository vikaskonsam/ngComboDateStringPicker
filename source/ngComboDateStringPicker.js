/*
 * ngComboDatePicker v1.3.1
 * http://github.com/jfmdev/ngComboDatePicker
 * «Copyright 2015 Jose F. Maldonado»
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Declare module.
angular.module("ngComboDatePicker", [])

// Declare directive.
.directive('ngComboDatePicker', function() {
    // Define fuction for getting the maximum date for a month.
    function maxDaysForMonth(month, year) {
        var res = 31;
        if(month != null) {
            if(month == 4 || month == 6 || month == 9 || month == 11) {
                res = 30;
            }
            if(year != null && month == 2) {
                res = year % 4 == 0 && year % 100 != 0? 29 : 28;

                if(year % 400 == 0) {
                    res = 29;
                }
            }
        }
        return res;
    };

    function getDays(month, year) {
        var maxDays = maxDaysForMonth(month, year);
        var days = [];
        for(var i = 1; i <= maxDays; i++) {
            day = ('0' + i).slice(-2).toString();
            days.push(day);
        }
        return days;
    };

    function getMonths() {
        var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return [{
            label : "Jan",
            value : "01",
        },{
            label : "Feb",
            value : "02",
        },{
            label : "Mar",
            value : "03",
        },{
            label : "Apr",
            value : "04",
        },{
            label : "May",
            value : "05",
        },{
            label : "Jun",
            value : "06",
        },{
            label : "July",
            value : "07",
        },{
            label : "Aug",
            value : "08",
        },{
            label : "Sep",
            value : "09",
        },{
            label : "Oct",
            value : "10",
        },{
            label : "Nov",
            value : "11",
        },{
            label : "Dec",
            value : "12",
        }];
    };

    function getMinParts(minDate) {

    };

    function getMaxParts(maxDate) {

    };

    function getYears() {
        var years = [];
        var today = new Date();
        var currentYear = today.getFullYear();

        for(var i = currentYear - 100; i <= currentYear; i++) {
            years.push(i.toString());
        }
        return years;
    };

    function formatDateStr(format, year, month, day) {
        var dateFormat = "yyyy-mm-dd";
        var formattedDate = dateFormat.replace('yyyy', year);
        formattedDate = formattedDate.replace('mm', month);
        formattedDate = formattedDate.replace('dd', day);
        return formattedDate;
    };
   
    // Create directive.
    return {
        restrict: 'AEC',
        scope: {
            ngModel: '=',
            ngMinDate : '@',
            ngMaxDate : '@',
            ngOrder: '@',
            ngYearOrder: '@',
            ngPlaceholder: '@',
            ngRequired: '@'
        },
        require: 'ngModel',
        controller: ['$scope', '$filter', function($scope, $filter) {           
            
            $scope.createSelectItems = function() {
                $scope.days = getDays($scope.month, $scope.year);
                $scope.months = getMonths();
                $scope.years = getYears({
                    order : $scope.ngOrder,
                    minDate : $scope.ngMinDate,
                    maxDate : $scope.ngMaxDate
                });

                /* if year order is desc */
                if(typeof $scope.ngYearOrder == 'string' && $scope.ngYearOrder.indexOf('des') == 0) {
                    $scope.years.reverse();
                }
            };

            $scope.setModelValue = function() {
                if(!$scope.year || !$scope.month || !$scope.day) {
                    $scope.ngModel = null;
                    return;
                }
                $scope.ngModel = formatDateStr('', $scope.year, $scope.month, $scope.day);
            };

            $scope.loadInitialModel = function() {
                if($scope.ngModel) {
                    var splitModel = $scope.ngModel.split('-');
                    $scope.year = splitModel[0];
                    $scope.month = splitModel[1];
                    $scope.day = splitModel[2];
                };
            };

            $scope.getPlaceholders = function(){
                if($scope.ngPlaceholder) {
                    var placholder = $scope.ngPlaceholder.split(',');
                    $scope.yearPh = placholder[0];
                    $scope.monthPh = placholder[1];
                    $scope.dayPh = placholder[2];
                }
            }; 

            $scope.init = function() {
                $scope.loadInitialModel();
                $scope.setModelValue();
                $scope.createSelectItems();
                $scope.getPlaceholders();
            };
            
            $scope.init();
            $scope.$watch('[year,day,month]', function() {
                $scope.setModelValue();
                $scope.createSelectItems();                
            }, true);

        }],
        link: function(scope, element, attrs, ngModelCtrl) {
            var jqLite = angular.element;
            var children = jqLite(element[0]).children();
            var order = scope.ngOrder.split('');

            // Reorder field elements.
            for(var i=0; i<order.length; i++) {
                if(order[i] == 'd') jqLite(element[0]).append(children[0]);
                if(order[i] == 'm') jqLite(element[0]).append(children[1]);
                if(order[i] == 'y') jqLite(element[0]).append(children[2]);
            }
        },
        template: function(element, attrs) {
            // Generate HTML code.
            var html =
                '<select ng-model="day" placholder="Days" ng-options = "day as day for day in days"><option value="" disabled selected>{{dayPh || "Date"}}</option></select>' +
                '<select ng-model="month" ng-options = "month.value as month.label for month in months"><option value="" disabled selected>{{monthPh || "Month"}}</option></select>' +
                '<select ng-model="year" ng-options = "year as year for year in years"><option value="" disabled selected> {{yearPh || "Year"}} </option></select>';
            return html;
        }
    }
});
