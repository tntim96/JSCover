package jscover.instrument;

import static org.junit.Assert.assertEquals;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Token;
import org.mozilla.javascript.ast.Assignment;
import org.mozilla.javascript.ast.AstNode;
import org.mozilla.javascript.ast.ExpressionStatement;
import org.mozilla.javascript.ast.Name;
import org.mozilla.javascript.ast.NumberLiteral;

@RunWith(JUnit4.class)
public class InstrumenterTest {

    private FileInstrumenter instrumenter = new FileInstrumenter(Context.VERSION_1_8, "test.js", null, null);

    @Test
    public void shouldPatchRhinoBug684131() {
        assertEquals("^=", AstNode.operatorToString(92));
    }

    @Test
    @Ignore
    public void shouldPatchRhinoBugVoid() {
        assertEquals("void", AstNode.operatorToString(126));
    }

    @Test
    public void shouldBuildSimpleStatement() {
        Name left = new Name(0,"x");
        NumberLiteral right = new NumberLiteral(0,"50");
        Assignment assignment = new Assignment(left, right);
        assignment.setOperator(Token.ASSIGN);
        ExpressionStatement newChild = new ExpressionStatement(assignment);

        String expectedSource = "x = 50;\n";
        assertEquals(expectedSource, newChild.toSource());
    }

    @Test
    public void shouldBuildInstrumentStatement() {
        ParseTreeInstrumenter instrumenter = new ParseTreeInstrumenter("test.js", null);
        ExpressionStatement expressionStatement = instrumenter.buildInstrumentationStatement(5);

        String expectedSource = "_$jscoverage['test.js'][5]++;\n";
        assertEquals(expectedSource, expressionStatement.toSource());
    }

    @Test
    public void shouldInstrumentStatements() {
        String source = "var x,y;\nx = 1;\ny = x * 1;";
        String instrumentedSource = instrumenter.instrumentSource(source);
        String expectedSource = "_$jscoverage['test.js'][1]++;\nvar x, y;\n_$jscoverage['test.js'][2]++;\nx = 1;\n_$jscoverage['test.js'][3]++;\ny = x * 1;\n";
        assertEquals(expectedSource, instrumentedSource);
    }

    @Test
    public void shouldInstrumentIfWithBraces() {
        String source = "if (x > 10)\n{\n  x++;\n}";
        String instrumentedSource = instrumenter.instrumentSource(source);
        String expectedSource = "_$jscoverage['test.js'][1]++;\nif (x > 10) \n{\n  _$jscoverage['test.js'][3]++;\n  x++;\n}\n";
        assertEquals(expectedSource, instrumentedSource);
    }

    @Test
    public void shouldInstrumentIfWithoutBraces() {
        String source = "if (x > 10)\n  x++;";
        String instrumentedSource = instrumenter.instrumentSource(source);
        String expectedSource = "_$jscoverage['test.js'][1]++;\nif (x > 10) \n{\n  _$jscoverage['test.js'][2]++;\n  x++;\n}\n";
        assertEquals(expectedSource, instrumentedSource);
    }

    @Test
    public void shouldInstrumentElseWithBraces() {
        String source = "if (x > 10)\n{\n  x++;\n} else {\n  x--;\n}";
        String instrumentedSource = instrumenter.instrumentSource(source);
        String expectedSource = "_$jscoverage['test.js'][1]++;\nif (x > 10) \n{\n  _$jscoverage['test.js'][3]++;\n  x++;\n} else {\n  _$jscoverage['test.js'][5]++;\n  x--;\n}\n";
        assertEquals(expectedSource, instrumentedSource);
    }

    @Test
    public void shouldNotInstrumentSameLineTwice() {
        String source = "var x,y;\nx = 1;y = x * 1;";
        String instrumentedSource = instrumenter.instrumentSource(source);
        String expectedSource = "_$jscoverage['test.js'][1]++;\nvar x, y;\n_$jscoverage['test.js'][2]++;\nx = 1;\ny = x * 1;\n";
        assertEquals(expectedSource, instrumentedSource);
    }
}
