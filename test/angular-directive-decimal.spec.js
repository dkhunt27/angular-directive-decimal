describe('angular-directive-decimal', function () {
  "use strict";

  var $compile, scope, inputEl, form;
  var expectedModelValue, expectedViewValue, expectedValid, expectedPristine;

  var setViewValue = function(val) {
    form.decimal.$setViewValue(val);
    scope.$digest();
  };

  var setupDirective = function (attrs) {
    attrs = attrs || '';

    var formEl = angular.element(
      '<form name="form">' +
      '  <input name="decimal" ng-model="model.decimal" decimal ' + attrs + '>' +
      '</form>');
    $compile(formEl)(scope);

    scope.$digest();

    form = scope.form;
    inputEl = formEl.find('input');
  };

  beforeEach(angular.mock.module('angular-directive-decimal'));

  beforeEach(inject(function (_$compile_, $rootScope) {
    $compile = _$compile_;
    scope = $rootScope.$new();
    scope.model = {};

    expectedModelValue = undefined;
    expectedViewValue = undefined;
    expectedValid = undefined;
    expectedPristine = undefined;
  }));

  describe('when no attributes specified (all defaults)', function () {
    beforeEach(function () {
      setupDirective();
    });

    it('displays an empty string in the view by default', function () {

      expectedModelValue = undefined;
      expectedViewValue = '';
      expectedValid = true;
      expectedPristine = true;
      expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
    });

    it('displays an empty string when ngModel is undefined', function () {
      setViewValue(undefined);

      expectedModelValue = '';
      expectedViewValue = undefined;
      expectedValid = true;
      expectedPristine = false;
      expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
    });

    it('accepts in-range values', function () {
      setViewValue('50.4');

      expectedModelValue = 50.4;
      expectedViewValue = '50.4';
      expectedValid = true;
      expectedPristine = false;
      expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
    });

    it('accepts decimals without a leading zero', function () {
      setViewValue('.5');

      expectedModelValue = 0.5;
      expectedViewValue = '.5';
      expectedValid = true;
      expectedPristine = false;
      expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
    });

    it('rounds off to four decimal points', function () {
      setViewValue('41.99333');

      expectedModelValue = 41.99;
      expectedViewValue = '41.99333';
      expectedValid = true;
      expectedPristine = false;
      expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
    });

    it('disallows negative values', function () {
      setViewValue('-5');

      expectedModelValue = '';
      expectedViewValue = '-5';
      expectedValid = false;
      expectedPristine = false;
      expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
    });

    it('disallows invalid values', function () {
      setViewValue('a');

      expectedModelValue = '';
      expectedViewValue = 'a';
      expectedValid = false;
      expectedPristine = false;
      expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
    });

    it('disallows invalid chars', function () {
      // A valid value is first entered
      setViewValue('50.4');

      // Then "a" is entered next
      setViewValue('50.4a');

      expectedModelValue = '';
      expectedViewValue = '50.4a';
      expectedValid = false;
      expectedPristine = false;
      expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
    });

    it('disallows the negative sign', function () {
      setViewValue('-');

      expectedModelValue = '';
      expectedViewValue = '-';
      expectedValid = false;
      expectedPristine = false;
      expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
    });
  });

  describe('attribute min handling', function() {
    describe('when min=0 specified', function () {
      beforeEach(function () {
        setupDirective('min="0"');
      });

      it('accepts in-range values', function () {
        setViewValue('50.4');

        expectedModelValue = 50.4;
        expectedViewValue = '50.4';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });

      it('disallows negative values', function () {
        setViewValue('-5');

        expectedModelValue = '';
        expectedViewValue = '-5';
        expectedValid = false;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('when min=100 specified', function () {
      beforeEach(function () {
        setupDirective('min="100"');
      });

      it('accepts in-range values', function () {
        setViewValue('150.4');

        expectedModelValue = 150.4;
        expectedViewValue = '150.4';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });

      it('disallows less than min values', function () {
        setViewValue('54');

        expectedModelValue = '';
        expectedViewValue = '54';
        expectedValid = false;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('when min=-25 specified', function () {
      beforeEach(function () {
        setupDirective('min="-25"');
      });

      it('accepts in-range positive values', function () {
        setViewValue('150.4');

        expectedModelValue = 150.4;
        expectedViewValue = '150.4';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });

      it('accepts in-range negative values', function () {
        setViewValue('-24.4');

        expectedModelValue = -24.4;
        expectedViewValue = '-24.4';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });

      it('disallows less than min values', function () {
        setViewValue('-54');

        expectedModelValue = '';
        expectedViewValue = '-54';
        expectedValid = false;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('when min="{{min}}"', function () {
      beforeEach(function () {
        setupDirective('min="{{min}}"');
      });
      it('defaults min to 0', function () {
        setViewValue('150.4');

        expectedModelValue = 150.4;
        expectedViewValue = '150.4';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);

        setViewValue('-150.4');

        expectedModelValue = '';
        expectedViewValue = '-150.4';
        expectedValid = false;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
      it('reflects changes to min', function () {
        // Initial min value
        scope.min = 2;
        scope.$digest();
        setViewValue('1');

        expectedModelValue = '';
        expectedViewValue = '1';
        expectedValid = false;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);

        // Modified max value
        scope.min = 0;
        scope.$digest();
        setViewValue('1');

        expectedModelValue = 1;
        expectedViewValue = '1';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });
  });

  describe('attribute max handling', function() {
    describe('when max=100 specified', function () {
      beforeEach(function () {
        setupDirective('max="100"');
      });

      it('accepts in-range values', function () {
        setViewValue('50.4');

        expectedModelValue = 50.4;
        expectedViewValue = '50.4';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });

      it('disallows values > max', function () {
        setViewValue('105');

        expectedModelValue = '';
        expectedViewValue = '105';
        expectedValid = false;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('when max="{{max}}"', function () {
      beforeEach(function () {
        setupDirective('max="{{max}}"');
      });
      it('defaults max to Infinity', function () {
        setViewValue('1000000000');

        expectedModelValue = 1000000000;
        expectedViewValue = '1000000000';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);

      });
      it('reflects changes to max', function () {
        // Initial max value
        scope.max = 1;
        scope.$digest();
        setViewValue('2');

        expectedModelValue = '';
        expectedViewValue = '2';
        expectedValid = false;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);

        // Modified max value
        scope.max = 3;
        scope.$digest();
        setViewValue('2');

        expectedModelValue = 2;
        expectedViewValue = '2';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });
  });

  describe('attribute precision handling', function() {
    describe('when precision = 0', function () {
      it('should round to full decimal', function () {
        setupDirective('precision="0"');
        setViewValue('42.787');

        expectedModelValue = 43;
        expectedViewValue = '42.787';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('when precision = 1', function () {
      it('should round to full decimal', function () {
        setupDirective('precision="1"');
        setViewValue('42.09');

        expectedModelValue = 42.1;
        expectedViewValue = '42.09';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('when precision = 2', function () {
      it('should round to full decimal', function () {
        setupDirective('precision="2"');
        setViewValue('42.0198');

        expectedModelValue = 42.02;
        expectedViewValue = '42.0198';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('when precision = 8', function () {
      it('should round to decimal with 6 decimals', function () {
        setupDirective('precision="8"');
        setViewValue('41.987654321');

        expectedModelValue = 41.98765432;
        expectedViewValue = '41.987654321';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('when precision = -1', function () {
      it('should disable rounding', function () {
        setupDirective('precision="-1"');
        setViewValue('41.987654321');

        expectedModelValue = 41.987654321;
        expectedViewValue = '41.987654321';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('when precision="{{precision}}"', function () {
      beforeEach(function () {
        setupDirective('precision="{{precision}}"');
      });

      it('defaults precision to 2', function () {
        setViewValue('2.54321287');

        expectedModelValue = 2.54;
        expectedViewValue = '2.54321287';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });

      it('reflects changes to precision', function () {
        // Initial precision
        scope.precision = 6;
        scope.$digest();
        setViewValue('2.54321287');

        expectedModelValue = 2.543213;
        expectedViewValue = '2.54321287';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);

        // Decrease precision
        scope.precision = 2;
        scope.$digest();
        setViewValue('2.54321');

        expectedModelValue = 2.54;
        expectedViewValue = '2.54321';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });
  });

  describe('validation handling', function () {
    beforeEach(function () {
      setupDirective();
    });

    describe('on valid input', function () {
      it('model set to input not formatted; view set to input formatted; valid set to true;', function () {
        setViewValue('12.3456789');

        expectedModelValue = 12.35;
        expectedViewValue = '12.3456789';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('on valid input then invalid input', function () {
      it('model not set; view still invalid data; valid set to false;', function () {
        setViewValue('12.3456789');
        setViewValue('12.345x');

        expectedModelValue = '';
        expectedViewValue = '12.345x';
        expectedValid = false;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('on valid input then invalid input then valid input', function () {
      it('model not set; view still invalid data; valid set to false;', function () {
        setViewValue('12.3456789');
        setViewValue('12.345x');
        setViewValue('12.3457');

        expectedModelValue = 12.35;
        expectedViewValue = '12.3457';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });
  });

  describe('on blur', function () {
    beforeEach(function () {
      setupDirective();
    });

    describe('on valid input', function () {
      it('model set to input not formatted; view set to input formatted; valid set to true;', function () {
        setViewValue('12.3456789');
        inputEl.triggerHandler('blur');

        expectedModelValue = 12.35;
        expectedViewValue = '12.35';
        expectedValid = true;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });

    describe('on invalid input', function () {
      it('model not set; view still invalid data; valid set to false;', function () {
        setViewValue('12.345x');
        inputEl.triggerHandler('blur');

        expectedModelValue = '';
        expectedViewValue = '12.345x';
        expectedValid = false;
        expectedPristine = false;
        expectTheFollowing(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine);
      });
    });
  });

  var expectTheFollowing = function(scope, form, expectedModelValue, expectedViewValue, expectedValid, expectedPristine) {

    // the model and modelValue should be the same
    expect(scope.model.decimal, "scope.model.decimal").to.equal(expectedModelValue);
    expect(form.decimal.$modelValue, "form.decimal.$modelValue").to.equal(expectedModelValue);

    // the viewValue and what is displayed in the dom should be the same
    expect(form.decimal.$viewValue, "form.decimal.$viewValue").to.equal(expectedViewValue);

    expect(form.decimal.$valid, "form.decimal.$valid").to.equal(expectedValid);
    expect(form.decimal.$pristine, "form.decimal.$pristine").to.equal(expectedPristine);

  };
});
