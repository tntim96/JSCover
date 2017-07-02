package jscover.instrument;

import com.google.javascript.jscomp.SourceFile;
import com.google.javascript.jscomp.parsing.Config;
import com.google.javascript.jscomp.parsing.ParserRunner;
import com.google.javascript.rhino.Node;
import com.google.javascript.rhino.Token;
import org.junit.Test;

import static com.google.javascript.jscomp.parsing.Config.JsDocParsing.TYPES_ONLY;
import static com.google.javascript.jscomp.parsing.Config.LanguageMode.ECMASCRIPT8;
import static com.google.javascript.jscomp.parsing.Config.RunMode.KEEP_GOING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

public class BranchHelperCCTest {
    private BranchHelperCC helper = new BranchHelperCC();

    @Test
    public void should() {
        System.out.println(parse("_$jscoverage['test.js'].branchData['4'][2].init(12, 15);").toStringTree());
    }

    @Test
    public void shouldDetectBoolean() {
        String script = "x = y || 7;";
        Node astRoot = parse(script);
        Node orNode = NodeTestHelperCC.findNode(astRoot, Token.OR);
        Node assignNode = NodeTestHelperCC.findNode(astRoot, Token.ASSIGN);
        assertThat(helper.isBoolean(orNode), is(true));
        assertThat(helper.isBoolean(assignNode), is(false));
    }

    @Test
    public void shouldDetectCoalesce() {
        String script = "x = y || {};";
        Node astRoot = parse(script);
        Node orNode = NodeTestHelperCC.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(true));
    }

    @Test
    public void shouldDetectCoalesceOnReturn() {
        String script = "function f(y) {return y || {};}";
        Node astRoot = parse(script);
        Node orNode = NodeTestHelperCC.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(true));
    }

    @Test
    public void shouldDetectCoalesceWithVariableDeclaration() {
        String script = "var x = y || {};";
        Node astRoot = parse(script);

        System.out.println("astRoot.toStringTree() = " + astRoot.toStringTree());
        Node orNode = NodeTestHelperCC.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(true));
    }

    @Test
    public void shouldNotDetectCoalesce() {
        String script = "if (a || b) ;";
        Node astRoot = parse(script);
        Node orNode = NodeTestHelperCC.findNode(astRoot, Token.OR);
        assertThat(helper.isCoalesce(orNode), is(false));
    }

    @Test
    public void shouldNotDetectAndAsCoalesce() {
        String script = "x = y > 7;";
        Node astRoot = parse(script);
        Node node = NodeTestHelperCC.findNode(astRoot, Token.GT);
        assertThat(helper.isCoalesce(node), is(false));
    }

    private Node parse(String source) {
        return ParserRunner.parse(
                new SourceFile("test.js"),
                source,
                ParserRunner.createConfig(ECMASCRIPT8, TYPES_ONLY, KEEP_GOING, null, false, Config.StrictMode.SLOPPY),
                null).ast;
    }

}