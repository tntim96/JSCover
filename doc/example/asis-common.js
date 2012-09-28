(function($) {

    Array.prototype.contains = function(callback) {
        var idx = 0;
        for (; idx < this.length; idx++) {
            if (callback(this[idx], idx)) {
                return true;
            }
        }
        return false;
    };

    Array.prototype.find = function(callback) {
        var idx = 0;
        for (; idx < this.length; idx++) {
            if (callback(this[idx], idx)) {
                return this[idx];
            }
        }
        return null;
    };

    Function.prototype.inherits = function() {
        var self = this;
        $.each(arguments, function(idx, o) {
            $.each(o, function(prop, value) {
                self.prototype[prop] = value;
            });
        });
        return this;
    };

    String.prototype.addCommas = function() {
        var nStr = this; nStr += '';
        var x = nStr.split('.');
        var x1 = x[0], x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    };

    Number.prototype.toCurrencyFormat = function() {
        var amount = $.toFixed(this, 2);
        var formatted = String(amount);
        if (Math.abs(amount) < 100) {
            if (amount === parseInt(amount, 10)) {
                formatted = amount + ".00";
            } else if (amount * 10 === parseInt(amount * 10, 10)) {
                formatted = amount + "0";
            }
        }
        return "$" + formatted.addCommas();
    };

    Number.prototype.formatDecimal = function(decimalPlace, decimalSeparator) {
        var separator = decimalSeparator || '', places = isNaN(decimalPlace) ? 2 : Math.abs(decimalPlace), number = $.toFixed(this, places), sign = number < 0 ? "-" : "", intValue = String(parseInt(number = Math.abs(number), 10)), len = intValue.length > 3 ? intValue.length % 3 : 0;
        return sign + (separator ? ((len ? intValue.substr(0, len) + separator : "") + intValue.substr(len).replace(/(\d{3})(?=\d)/g, "$1" + separator)) : intValue) + (places ? "." + Math.abs(number - intValue).toFixed(places).slice(2) : "");
    };

    $.datepicker.setDefaults({
        dateFormat: 'dd/mm/yy',
        hideIfNoPrevNext: true,
        changeMonth: true,
        changeYear: true
    });

    $.isNullOrUndefined = function(val) {
        return val === undefined || val === null;
    };

    $.toFixed = function(value, decimalPlace) {
        var power = Math.pow(10, decimalPlace);
        return Math.round(parseFloat(value) * power) / power;
    };

    $.formatNumber = function(val, decimalPlace) {
        decimalPlace = decimalPlace || 2;
        var valid = "0123456789.";
        var idx = 0, result = "";
        for (; idx < val.length; idx++) {
            var character = val.substring(idx, idx + 1);
            if ((valid.indexOf(character) > -1) || ((result.length === 0) && (character === "-"))) {
                result += character;
            }
        }
        return Number(result).formatDecimal(decimalPlace, ',');
    };

    $.isValidEmail = function(email) {
        // by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
        return (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i).test(email);
    };

    $.isValidDate = function(year, month, day) {
        if (month < 1 || month > 12) {
            return false;
        }
        if (day < 1 || day > 31) {
            return false;
        }
        if ((month === 4 || month === 6 || month === 9 || month === 11) && (day === 31)) {
            return false;
        }
        if (month === 2) {
            var leap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
            if (day > 29 || (day === 29 && !leap)) {
                return false;
            }
        }
        return true;
    };

    $.isValidPercentage = function(percentage, minimum, maximum, maximumPrecision) {
        minimum = typeof(minimum) != 'undefined' ? minimum : 0.0;
        maximum = typeof(maximum) != 'undefined' ? maximum : 100.0;
        maximumPrecision = typeof(maximumPrecision) != 'undefined' ? maximumPrecision : 2;

        var val = String(percentage);
        var decimalPos = val.indexOf(".");
        if ((decimalPos >= 0) && (decimalPos < val.length - 1 - maximumPrecision)) {
            return false;
        }

        if (val.split(".").length - 1 > 1) {
            return false;
        }

        var percentageAsNumber = parseFloat(percentage);
        return !isNaN(percentageAsNumber) && (percentageAsNumber >= minimum) && (percentageAsNumber <= maximum);
    };

    $.investmentProfileLink = function(profileApirCode) {
        return "/pages/user/morningstar/" + profileApirCode.toUpperCase();
    };

    jQuery.fn.extend({
        exists: function() {
            return $(this).length > 0;
        },

        disableInputs: function() {
            return this.toggleInputs(false);
        },

        enableInputs: function() {
            return this.toggleInputs(true);
        },

        toggleInputs: function(enabled) {
            return this.find(':input').each(function() {
                if (enabled) {
                    $(this).removeAttr("disabled");
                } else {
                    $(this).attr("disabled", true);
                }
            });
        },

        clearInputs: function() {
            return this.find(':input').each(function() {
                switch (this.type) {
                    case 'password':
                    case 'select-multiple':
                    case 'select-one':
                    case 'text':
                    case 'textarea':
                        $(this).val('');
                        $(this).blur();
                        break;
                    case 'checkbox':
                    case 'radio':
                        $(this).removeAttr('checked');
                        break;
                }
            });
        },

        inputtedValue: function() {
            var val = this.val();
            return (val == this.attr('title')) ? "" : $.trim(val);
        },

        singleClick: function(fn) {
            var self = this;
            this.click(function(event) {
                if (!event.detail || event.detail == 1) {
                    return fn.apply(self, [event]);
                }
            });
        },

        withDateLabel: function() {
            var self = this;
            var label = $('label[for="' + this.attr("id") + '"]');
            this.add(label).click(function() {
                self.focus();
            });
            return this;
        }
    });

}(jQuery));