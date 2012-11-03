function BranchData(position, length) {
    this.position = position;
    this.length = length;
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
}