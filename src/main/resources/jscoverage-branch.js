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
}
