package jscover.instrument;

import com.google.javascript.rhino.Node;
import com.google.javascript.rhino.Token;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

public class BranchHelperTest {
    private BranchHelper helper = new BranchHelper();

    @Test
    public void shouldDetectBoolean() {
        String script = "x = y || 7;";
        Node astRoot = parse(script);
        Node orNode = NodeTestHelper.findNode(astRoot, Token.OR);
        Node assignNode = NodeTestHelper.findNode(astRoot, Token.ASSIGN);
        assertThat(helper.isBoolean(orNode), is(true));
        assertThat(helper.isBoolean(assignNode), is(false));
    }

    @Test
    public void shouldDetectCoalesce() {
        String script = "x = y || {};";
        Node astRoot = parse(script);
        Node orNode = NodeTestHelper.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(true));
    }

    @Test
    public void shouldDetectCoalesceOnReturn() {
        String script = "function f(y) {return y || {};}";
        Node astRoot = parse(script);
        Node orNode = NodeTestHelper.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(true));
    }

    @Test
    public void shouldDetectCoalesceWithVariableDeclaration() {
        String script = "var x = y || {};";
        Node astRoot = parse(script);

        Node orNode = NodeTestHelper.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(true));
    }

    @Test
    public void shouldNotDetectCoalesce() {
        String script = "if (a || b) ;";
        Node astRoot = parse(script);
        Node orNode = NodeTestHelper.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(false));
    }

    @Test
    public void shouldNotDetectAndAsCoalesce() {
        String script = "x = y > 7;";
        Node astRoot = parse(script);
        Node node = NodeTestHelper.findNode(astRoot, Token.GT);
        assertThat(helper.isCoalesce(node), is(false));
    }

    private Node parse(String source) {
        return TestHelper.parse(source);
    }
}