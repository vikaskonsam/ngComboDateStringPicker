/*
 * ngComboDatePicker v1.0.0
 * https://github.com/vikaskonsam/ngComboDateStringPicker.git
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

    function getDates(obj) {
        var dates = [];
        var maxDays = maxDaysForMonth(obj.selectedMonth, obj.selectedYear);

        var maxDateParts = getDateParts(obj.maxDate);
        var inputMaxYear = maxDateParts.year;
        var inputMaxMonth = maxDateParts.month;
        var inputMaxDate = maxDateParts.date;

        var minDateParts = getDateParts(obj.minDate);
        var inputMinYear = minDateParts.year;
        var inputMinMonth = minDateParts.month;
        var inputMinDate = minDateParts.date;

        var currentSelectedYear = obj.selectedYear;
        var currentSelectedMonth = obj.selectedMonth;

        var initialValue = 1;

        if(currentSelectedYear == inputMaxYear && currentSelectedMonth == inputMaxMonth) {
            maxDays = parseInt(inputMaxDate);
        }

        if(currentSelectedYear == inputMinYear && currentSelectedMonth == inputMinMonth) {
            initialValue = parseInt(inputMinDate);
        }

        for(var i = initialValue; i <= maxDays; i++) {
            date = ('0' + i).slice(-2).toString();
            dates.push(date);
        }
        return dates;
    };

    function getMonths(obj) {
        var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var monthInt = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        var monthsArray = [];

        var arrayLength = monthName.length;
        var initVal = 0;

        var maxDateParts = getDateParts(obj.maxDate);
        var inputMaxYear = maxDateParts.year;
        var inputMaxMonth = maxDateParts.month;

        var minDateParts = getDateParts(obj.minDate);
        var inputMinYear = minDateParts.year;
        var inputMinMonth = minDateParts.month;
        
        var currentSelectedYear = obj.selectedYear;

        if(currentSelectedYear) {
            if(currentSelectedYear == inputMaxYear) {
                arrayLength = parseInt(inputMaxMonth);
            }

            if(currentSelectedYear == inputMinYear) {
                initVal = parseInt(inputMinMonth) - 1;
            }
        }

        for(var i = initVal; i < arrayLength; i++) {
            var obj = {
                label : monthName[i],
                value : monthInt[i]
            }
            monthsArray.push(obj);
        }

        return monthsArray;
    };

    
    function getYears(obj) {
        var years = [];
        var today = new Date();
        var currentYear = today.getFullYear();

        /* for future year sent from the data */
        if(obj.selectedYear > currentYear) {
            currentYear = obj.selectedYear;
        }

        var o = {
            maxYear : currentYear,
            minYear : currentYear - 100
        };


        var inputMaxYear = getDateParts(obj.maxDate).year;
        var inputMinYear = getDateParts(obj.minDate).year;

        if(inputMinYear) {
            o.minYear = inputMinYear
        }

        if(inputMaxYear) {
            o.maxYear = inputMaxYear
        }
        
        for(var i = o.minYear; i <= o.maxYear; i++) {
            years.push(i.toString());
        }
        return years;
    };

    function getDateParts(date) {
        if(!date) {
            return {};
        }
        
        var splitDate = date.split('-');
        
        return {
            year : splitDate[0],
            month : splitDate[1],
            date : splitDate[2]
        };
    };

    function formatDateStr(year, month, date) {
        var dateFormat = "yyyy-mm-dd";
        var formattedDate = dateFormat.replace('yyyy', year);
        formattedDate = formattedDate.replace('mm', month);
        formattedDate = formattedDate.replace('dd', date);
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

            /* create the option items for the select boxes */      
            $scope.createOptionItems = function() {
                $scope.years = getYears({
                    minDate : $scope.ngMinDate,
                    maxDate : $scope.ngMaxDate,
                    selectedYear : $scope.year
                });

                $scope.months = getMonths({
                    minDate : $scope.ngMinDate,
                    maxDate : $scope.ngMaxDate,
                    selectedYear : $scope.year
                });

                $scope.dates = getDates({
                    minDate : $scope.ngMinDate,
                    maxDate : $scope.ngMaxDate,
                    selectedYear : $scope.year,
                    selectedMonth : $scope.month
                });

                /* if year order is desc */
                if(typeof $scope.ngYearOrder == 'string' && $scope.ngYearOrder.indexOf('des') == 0) {
                    $scope.years.reverse();
                }
            };

            $scope.setModelValue = function() {
                if(!$scope.year || !$scope.month || !$scope.date) {
                    $scope.ngModel = null;
                    return;
                }
                $scope.ngModel = formatDateStr($scope.year, $scope.month, $scope.date);
            };

            $scope.loadInitialModel = function() {
                if($scope.ngModel) {
                    var splitModel = getDateParts($scope.ngModel);
                    $scope.year = splitModel.year;
                    $scope.month = splitModel.month;
                    $scope.date = splitModel.date;
                };
            };

            $scope.getPlaceholders = function(){
                if($scope.ngPlaceholder) {
                    var placholder = $scope.ngPlaceholder.split(',');
                    $scope.yearPh = placholder[0];
                    $scope.monthPh = placholder[1];
                    $scope.datePh = placholder[2];
                }
            }; 

            $scope.init = function() {
                $scope.loadInitialModel();
                $scope.setModelValue();
                $scope.createOptionItems();
                $scope.getPlaceholders();
            };
            
            $scope.init();
            $scope.$watch('[year,date,month]', function() {
                $scope.setModelValue();
                $scope.createOptionItems();                
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
                '<select ng-model="date" placholder="dates" ng-options = "date as date for date in dates"><option value="" disabled selected>{{datePh || "Date"}}</option></select>' +
                '<select ng-model="month" ng-options = "month.value as month.label for month in months"><option value="" disabled selected>{{monthPh || "Month"}}</option></select>' +
                '<select ng-model="year" ng-options = "year as year for year in years"><option value="" disabled selected> {{yearPh || "Year"}} </option></select>';
            return html;
        }
    }
});
