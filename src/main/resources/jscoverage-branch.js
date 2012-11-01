function BranchData() {
    this.evalFalse = false;
    this.evalTrue = false;

    this.covered = function() {
        return this.evalTrue && this.evalFalse;
    };
}