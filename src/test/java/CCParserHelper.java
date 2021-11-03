import com.google.javascript.rhino.Node;
import jscover.instrument.TestHelper;


public class CCParserHelper {

    public static void main(String args[]) {
        System.out.println(parse("function visit1_4_2(result) {\n" +
                "  _$jscoverage['test.js'].branchData['4'][2].ranCondition(result);\n" +
                "  return result;\n" +
                "}").toStringTree());
    }


    static Node parse(String source) {
        return TestHelper.parse(source);
    }

}
