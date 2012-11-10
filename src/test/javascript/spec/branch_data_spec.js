$(document).ready(function() {
    describe('Branch Data', function() {

        var branchData;

        beforeEach(function() {
            branchData = new BranchData(10,5,'x<y');
        });

        it("should record position and length", function() {
            expect(branchData.position).toEqual(10);
            expect(branchData.nodeLength).toEqual(5);
            expect(branchData.src).toEqual('x<y');
        });

        it("should not be covered if neither path evaluated", function() {
            expect(branchData.covered()).toBeFalsy();
            expect(branchData.message()).toEqual('Condition never evaluated:\nx<y');
        });

        it("should convert to and from JSON", function() {
            var json = BranchData.fromJson(branchData.toJSON());
            expect(json.position).toEqual(10);
            expect(json.nodeLength).toEqual(5);
            expect(json.src).toEqual('x<y');
            expect(json.evalFalse).toEqual(0);
            expect(json.evalTrue).toEqual(0);
            expect(json.covered()).toEqual(false);
        });

        it("should escape source", function() {
            branchData.src = '\'a\'.length + "b".length';
            var json = BranchData.fromJson(branchData.toJSON());
            expect(json.src).toEqual('\'a\'.length + "b".length');
        });

        it("should not be covered if only false path evaluated", function() {
            branchData.ranCondition(false);
            expect(branchData.covered()).toBeFalsy();
            expect(branchData.message()).toEqual('Condition never evaluated to true:\nx<y');
        });

        it("should not be covered if only true path evaluated", function() {
            branchData.ranCondition(true);
            expect(branchData.covered()).toBeFalsy();
            expect(branchData.message()).toEqual('Condition never evaluated to false:\nx<y');
        });

        it("should be covered if both paths evaluated", function() {
            branchData.ranCondition(false);
            branchData.ranCondition(true);
            expect(branchData.covered()).toBeTruthy();
            expect(branchData.message()).toEqual('Condition covered');
        });
    });
});
