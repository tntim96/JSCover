$(document).ready(function() {
    describe('Branch Data', function() {

        var branchData;

        beforeEach(function() {
            branchData = new BranchData();
            branchData.init(10,5,'x<y');
        });

        it("should record position and length", function() {
            expect(branchData.position).toEqual(10);
            expect(branchData.nodeLength).toEqual(5);
            expect(branchData.src).toEqual('x<y');
        });

        it("should not be covered if neither path evaluated", function() {
            expect(branchData.covered()).toBeFalsy();
            expect(branchData.pathsCovered()).toEqual(0);
            expect(branchData.message()).toEqual('Condition never evaluated         :\tx<y');
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
            expect(branchData.pathsCovered()).toEqual(1);
            expect(branchData.message()).toEqual('Condition never evaluated to true :\tx<y');
        });

        it("should not be covered if only true path evaluated", function() {
            branchData.ranCondition(true);
            expect(branchData.covered()).toBeFalsy();
            expect(branchData.pathsCovered()).toEqual(1);
            expect(branchData.message()).toEqual('Condition never evaluated to false:\tx<y');
        });

        it("should be covered if both paths evaluated", function() {
            branchData.ranCondition(false);
            branchData.ranCondition(true);
            expect(branchData.covered()).toBeTruthy();
            expect(branchData.pathsCovered()).toEqual(2);
            expect(branchData.message()).toEqual('Condition covered');
        });

        it("should be covered if both paths evaluated multiple times", function() {
            branchData.ranCondition(false);
            branchData.ranCondition(false);
            branchData.ranCondition(true);
            branchData.ranCondition(true);
            expect(branchData.covered()).toBeTruthy();
            expect(branchData.evalFalse).toEqual(2);
            expect(branchData.evalTrue).toEqual(2);
            expect(branchData.pathsCovered()).toEqual(2);
            expect(branchData.message()).toEqual('Condition covered');
        });
    });

    describe('Branch Data Array', function() {

        it("should convert multiple conditions to JSON", function() {
            var lineN = new Array();
            lineN[1] = new BranchData().init(1,10,'src1');
            lineN[2] = new BranchData().init(2,20,'src2');
            lineN[2].ranCondition(false);
            lineN[2].ranCondition(true);

            var json = convertBranchDataConditionArrayToJSON(lineN);
            expect(json).toEqual('[null,{"position":1,"nodeLength":10,"src":"src1","evalFalse":0,"evalTrue":0},{"position":2,"nodeLength":20,"src":"src2","evalFalse":1,"evalTrue":1}]');
        });

        it("should build branch message for line", function() {
            var conditions = new Array();
            conditions[1] = new BranchData().init(1,10,'src1');
            conditions[2] = undefined;
            conditions[2] = new BranchData().init(2,20,'src2');

            var message = buildBranchMessage(conditions);
            var expected = 'The following was not covered:\n- Condition never evaluated         :\tsrc1\n- Condition never evaluated         :\tsrc2';
            expect(message).toEqual(expected);
        });

        it("should handle undefined branch JSON data object", function() {
            expect(convertBranchDataLinesToJSON(undefined)).toEqual('[]');
        });

        it("should handle undefined branch JSON data string", function() {
            expect(convertBranchDataLinesFromJSON(undefined)).toEqual(new Array());
        });

        it("should convert multiple lines to JSON and back", function() {
            var lines = new Array();
            lines[1] = new Array();
            lines[1][1] = new BranchData().init(1,10,'src1');
            lines[1][2] = new BranchData().init(2,20,'src2');
            lines[2] = new Array();
            lines[2][1] = new BranchData().init(3,30,'src3');
            lines[2][2] = new BranchData().init(4,40,'src4');
            lines[2][2].ranCondition(false);
            lines[2][2].ranCondition(true);

            var json = convertBranchDataLinesToJSON(lines);
            var jsonObject = eval('(' + json + ')');
            var fromJSON = convertBranchDataLinesFromJSON(jsonObject);
            expect(fromJSON[0]).toBeNull();

            expect(fromJSON[1][0]).toBeNull();
            expect(fromJSON[1][1].position).toEqual(1);
            expect(fromJSON[1][1].nodeLength).toEqual(10);
            expect(fromJSON[1][1].covered()).toEqual(false);
            expect(fromJSON[1][2].position).toEqual(2);
            expect(fromJSON[1][2].nodeLength).toEqual(20);
            expect(fromJSON[1][2].covered()).toEqual(false);

            expect(fromJSON[2][0]).toBeNull();
            expect(fromJSON[2][1].position).toEqual(3);
            expect(fromJSON[2][1].nodeLength).toEqual(30);
            expect(fromJSON[2][1].covered()).toEqual(false);
            expect(fromJSON[2][2].position).toEqual(4);
            expect(fromJSON[2][2].nodeLength).toEqual(40);
            expect(fromJSON[2][2].covered()).toEqual(true);
        });
    });
});
