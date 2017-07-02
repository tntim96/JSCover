import com.google.javascript.jscomp.SourceFile;
import com.google.javascript.jscomp.parsing.Config;
import com.google.javascript.jscomp.parsing.ParserRunner;
import com.google.javascript.rhino.Node;

import static com.google.javascript.jscomp.parsing.Config.JsDocParsing.TYPES_ONLY;
import static com.google.javascript.jscomp.parsing.Config.LanguageMode.ECMASCRIPT8;
import static com.google.javascript.jscomp.parsing.Config.RunMode.KEEP_GOING;


public class CCParserHelper {

    public static void main(String args[]) throws Exception {
        System.out.println(parse("function visit1_4_2(result) {\n" +
                "  _$jscoverage['test.js'].branchData['4'][2].ranCondition(result);\n" +
                "  return result;\n" +
                "}").toStringTree());
    }


    static Node parse(String source) {
        return ParserRunner.parse(
                new SourceFile("test.js"),
                source,
                ParserRunner.createConfig(ECMASCRIPT8, TYPES_ONLY, KEEP_GOING, null, false, Config.StrictMode.SLOPPY),
                null).ast;
    }

}
