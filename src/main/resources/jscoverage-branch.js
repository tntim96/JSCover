function BranchData(position, length, src) {
    this.position = position;
    this.length = length;
    this.src = src;
    this.evalFalse = false;
    this.evalTrue = false;

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue = true;
        else
            this.evalFalse = true;
    };

    this.covered = function() {
        return this.evalTrue && this.evalFalse;
    };

    this.message = function() {
        if (!this.evalTrue && !this.evalFalse)
            return 'Condition never evaluated:\n' + this.src;
        else if (!this.evalTrue)
            return 'Condition never evaluated to true:\n' + this.src;
        else if (!this.evalFalse)
            return 'Condition never evaluated to false:\n' + this.src;
        else
            return 'Condition covered';
    };
}
