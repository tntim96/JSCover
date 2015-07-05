package jscover.instrument;

import org.junit.Test;
import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Parser;
import org.mozilla.javascript.Token;
import org.mozilla.javascript.ast.AstNode;
import org.mozilla.javascript.ast.AstRoot;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;


public class BranchHelperTest {

    private static CompilerEnvirons compilerEnv = new CompilerEnvirons();
    private BranchHelper helper = new BranchHelper();
    private Parser parser = new Parser();

    static {
        // compilerEnv.setAllowMemberExprAsFunctionName(true);
        compilerEnv.setLanguageVersion(Context.VERSION_1_8);
        compilerEnv.setStrictMode(false);
    }

    @Test
    public void shouldDetectBoolean() {
        String script = "x = y || 7;";
        AstRoot astRoot = parser.parse(script, null, 1);
        AstNode orNode = NodeTestHelper.findNode(astRoot, Token.OR);
        AstNode assignNode = NodeTestHelper.findNode(astRoot, Token.ASSIGN);
        assertThat(helper.isBoolean(orNode), is(true));
        assertThat(helper.isBoolean(assignNode), is(false));
    }

    @Test
    public void shouldDetectCoalesce() {
        String script = "x = y || {};";
        AstRoot astRoot = parser.parse(script, null, 1);
        AstNode orNode = NodeTestHelper.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(true));
    }

    @Test
    public void shouldDetectCoalesceWithVariableDeclaration() {
        String script = "var x = y || {};";
        AstRoot astRoot = parser.parse(script, null, 1);
        AstNode orNode = NodeTestHelper.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(true));
    }

    @Test
    public void shouldNotDetectCoalesce() {
        String script = "if (a || b) ;";
        AstRoot astRoot = parser.parse(script, null, 1);
        AstNode orNode = NodeTestHelper.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(false));
    }

    @Test
    public void shouldNotDetectAndAsCoalesce() {
        String script = "x = y > 7;";
        AstRoot astRoot = parser.parse(script, null, 1);
        AstNode node = NodeTestHelper.findNode(astRoot, Token.GT);
        assertThat(helper.isCoalesce(node), is(false));
    }
}