# angular-directive-decimal

[![NPM version](https://badge.fury.io/js/angular-directive-decimal.png)](http://badge.fury.io/js/angular-directive-decimal)
[![Bower version](https://badge.fury.io/bo/angular-directive-decimal.png)](http://badge.fury.io/bo/angular-directive-decimal)
[![Build Status](https://travis-ci.org/dkhunt27/angular-directive-decimal.svg?branch=master)](https://travis-ci.org/dkhunt27/angular-directive-decimal)
[![Coverage Status](https://coveralls.io/repos/dkhunt27/angular-directive-decimal/badge.svg?branch=master)](https://coveralls.io/r/dkhunt27/angular-directive-decimal?branch=master)

## Credit

This directive is a port of fiestah's great work on [angular-money-directive](https://github.com/fiestah/angular-money-directive).  I was having issues 
with undefined values with the money directive.  And it would throw multiple validation errors (min, max, etc), and I wanted it to through just one...decimal.

## Overview

This directive takes inputs in decimal format 42.5376 and displays it rounded to the precision provided like 42.54.

It does a few things:

- Prevents entering non-numeric characters
- Prevents entering the minus sign when `min >= 0`
- Supports `min` and `max` like in `<input type="number">`
- Rounds the model value by `precision`, e.g. `0.42219` will be rounded to `42.22` by default
- On `blur`, the input field is auto-formatted. Say if you enter `42`, it will be formatted to `42.00`


## Usage:

```
$ bower install angular-directive-decimal
```

Then include it as a dependency in your app.
```
angular.module('myApp', ['angular-directive-decimal'])
```

### Attributes:

- `percentage`: _required_
- `ng-model`: _required_
- `type`: Set to `text` or just leave it out. Do _not_ set to `number`.
- `min`: _optional_ Defaults to `0`.
- `max`: _optional_ Not enforced by default
- `precision`: _optional_ Defaults to `4`. Set to `-1` to disable rounding

Basic example:

``` html
<input type="text" ng-model="model.percent" percentage>
```

`min`, `max` and `precision` can be set dynamically in $scope:

``` html
<input type="text" ng-model="model.percent" percentage min="{{min}}">
```

## Tests:

1. Install test deps: `npm install` and `bower install`
2. Run: `npm test` or `./node_modules/karma/bin/karma start`.  

###### Note: If running locally, you might get an error about can't submit to coveralls.  This is only required if you want the code coverage badge for your forked repo.  See below for setup.

## Coveralls.io

Using coveralls.io for the code coverage badge.  Using instanbul, karma-coverage, and karma-coveralls to generate code coverage and push to coveralls.io.
The push to coveralls.io requires the repo token.  I am using an environment variable 

  $ export COVERALLS_REPO_TOKEN_FOR_ANGULAR_DIRECTIVE_DECIMAL=[your coveralls repo token] 
  
that gets mapped to the required COVERALLS_REPO_TOKEN per test run.  The travis build sets this environment variable using [encrypted](http://docs.travis-ci.com/user/encryption-keys/)
variables.  However, if running this locally, you will need to setup your forked repo in [coveralls.io](https://coveralls.io/) and set that environment 
variable to your repo token
