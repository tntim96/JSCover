package jscover.instrument;

import org.junit.Ignore;
import org.junit.Test;
import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Parser;
import org.mozilla.javascript.Token;
import org.mozilla.javascript.ast.AstNode;
import org.mozilla.javascript.ast.AstRoot;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;


public class BranchInstrumentorTest {
    private static CompilerEnvirons compilerEnv = new CompilerEnvirons();

    private BranchInstrumentor getBranchInstrumentor(String source) {
        return new BranchInstrumentor("/test.js", false, null, source);
    }

    private Parser parser = new Parser();

    static {
        // compilerEnv.setAllowMemberExprAsFunctionName(true);
        compilerEnv.setLanguageVersion(Context.VERSION_1_8);
        compilerEnv.setStrictMode(false);
    }

    @Test
    public void shouldCalculateNodePosition() {
        String script = "var y = x > 0;";
        AstRoot astRoot = parser.parse(script, null, 1);
        AstNode gtNode = NodeTestHelper.findNode(astRoot, Token.GT);
        assertThat(getBranchInstrumentor(script).getLinePosition(gtNode), equalTo(9));
    }

    @Test
    public void shouldCalculateNodePositionAsSecondStatement() {
        String script = "var x;\nvar y = x > 0;";
        AstRoot astRoot = parser.parse(script, null, 1);
        AstNode gtNode = NodeTestHelper.findNode(astRoot, Token.GT);
        assertThat(getBranchInstrumentor(script).getLinePosition(gtNode), equalTo(9));
    }

    @Test
    public void shouldCalculateNodePositionWithParent() {
        String script = "if (x > y) {a = 1;}";
        AstRoot astRoot = parser.parse(script, null, 1);
        AstNode gtNode = NodeTestHelper.findNode(astRoot, Token.GT);
        assertThat(getBranchInstrumentor(script).getLinePosition(gtNode), equalTo(5));
    }

    @Test
    public void shouldCalculateNodePositionAsFirstSiblingOfFunction() {
        String script = "function(x, y) {\n" +
                "    if (x > y) {\n" +
                "        x = 1;\n" +
                "    }\n" +
                "}";
        AstRoot astRoot = parser.parse(script, null, 1);
        AstNode gtNode = NodeTestHelper.findNode(astRoot, Token.GT);
        assertThat(getBranchInstrumentor(script).getLinePosition(gtNode), equalTo(9));
    }

    @Test
    public void shouldCalculateNodePositionAsSecondSiblingOfFunction() {
        String script = "function(x, y) {\n" +
                "    var a;\n" +
                "    if (x > y) {\n" +
                "        a = 1;\n" +
                "    }\n" +
                "}";
        AstRoot astRoot = parser.parse(script, null, 1);
        AstNode gtNode = NodeTestHelper.findNode(astRoot, Token.GT);
        assertThat(getBranchInstrumentor(script).getLinePosition(gtNode), equalTo(9));
    }
}