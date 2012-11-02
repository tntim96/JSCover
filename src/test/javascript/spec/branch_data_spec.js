$(document).ready(function() {
    describe('Branch Data', function() {

        var branchData;

        beforeEach(function() {
            branchData = new BranchData();
        });

        it("should not be covered if neither path evaluated", function() {
            expect(branchData.covered()).toBeFalsy();
        });

        it("should not be covered if only false path evaluated", function() {
            branchData.ranCondition(false);
            expect(branchData.covered()).toBeFalsy();
        });

        it("should not be covered if only true path evaluated", function() {
            branchData.ranCondition(false);
            expect(branchData.covered()).toBeFalsy();
        });

        it("should be covered if both paths evaluated", function() {
            branchData.ranCondition(false);
            branchData.ranCondition(true);
            expect(branchData.covered()).toBeTruthy();
        });
    });
});
