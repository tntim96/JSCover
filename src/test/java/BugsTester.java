

import java.io.IOException;
import java.io.StringReader;

import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.Parser;
import org.mozilla.javascript.ast.AstRoot;

import jscover.util.IoUtils;

public class BugsTester {
    private static IoUtils ioUtils = IoUtils.getInstance();
    public static void main(String[] args) throws IOException {
//        parseAndPrintSource("void window.open();");
//        parseAndPrintSource("debugger;");
//        parseAndPrintSource("if (true)\n  x++;");
        parseAndPrintSource(ioUtils.loadFromClassPath("/test.js"));
//        parseAndPrintSource("/^(\\w+)$/.exec(url);");
        //parseAndPrintSource("if (true)\n  ;\nx++;");
    }

    private static void parseAndPrintSource(String source) throws IOException {
        CompilerEnvirons compilerEnv = new CompilerEnvirons();
        compilerEnv.setLanguageVersion(180);
//        compilerEnv.setStrictMode(false);
        Parser parser = new Parser(compilerEnv);
        AstRoot astRoot = parser.parse(new StringReader(source), null, 1);
        System.out.println(astRoot.toSource());
    }
}
