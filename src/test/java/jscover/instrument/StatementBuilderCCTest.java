package jscover.instrument;

import com.google.javascript.jscomp.CodePrinter;
import com.google.javascript.jscomp.CompilerOptions;
import com.google.javascript.rhino.IR;
import com.google.javascript.rhino.Node;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.SortedSet;
import java.util.TreeSet;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

public class StatementBuilderCCTest {
    private StatementBuilderCC builder = new StatementBuilderCC();
    private CompilerOptions options = new CompilerOptions();
    private SortedSet<Integer> validLines = new TreeSet<Integer>();

    @Before
    public void setUp() {
        options.setPreferSingleQuotes(true);
    }

    @Test
    public void shouldBuildInstrumentationIncrementer() {
        Node statement = builder.buildInstrumentationIncrementer(7, "/dir/file.js", "lineData");
        assertThat(new CodePrinter.Builder(statement).setCompilerOptions(options).build(), equalTo("_$jscoverage['/dir/file.js'].lineData[7]++"));
    }

    @Test
    public void shouldCreateInstrumentationStatement2() {
        Node statement = builder.buildLineNumberExpression(7, "/dir/file.js", "lineData");
        assertThat(new CodePrinter.Builder(statement).setCompilerOptions(options).build(), equalTo("_$jscoverage['/dir/file.js'].lineData[7]"));
    }

    @Test
    public void shouldCreateInstrumentationStatement() {
        Node statement = builder.buildInstrumentationStatement(7, "/dir/file.js", validLines);
        assertThat(new CodePrinter.Builder(statement).setCompilerOptions(options).build(), equalTo("_$jscoverage['/dir/file.js'].lineData[7]++"));
        assertThat(validLines, hasItem(7));
    }

    @Test(expected = IllegalStateException.class)
    public void shouldThrowExceptionIfLineNumberInvalid() {
        builder.buildInstrumentationStatement(0, "/dir/file.js", validLines);
    }

    @Test
    public void shouldCreateConditionalIgnoreStatement() {
        Node statement = builder.buildConditionalStatement(7, 12, "/dir/file.js");
        assertThat(new CodePrinter.Builder(statement).setCompilerOptions(options).build(), equalTo("_$jscoverage['/dir/file.js'].conditionals[7]=12"));
    }

    @Test
    public void shouldCreateFunctionInstrumentationStatement() {
        Node statement = builder.buildFunctionInstrumentationStatement(7, "/dir/file.js");
        assertThat(new CodePrinter.Builder(statement).setCompilerOptions(options).build(), equalTo("_$jscoverage['/dir/file.js'].functionData[7]++"));
    }

    @Test
    public void shouldDetectInstrumentation() throws IOException {
        Node jscover = IR.string("_$jscoverage");
        Node getProp = IR.getprop(jscover, "someval");
        Node call = IR.call(getProp);

        assertThat(builder.isInstrumentation(call), is(true));//No source so must be synthetic
        call.setSourceFileForTesting("Hey");
        assertThat(builder.isInstrumentation(call), is(true));
    }

    @Test
    public void shouldNotDetectInstrumentation() throws IOException {
        Node jscover = IR.string("_$someOtherVar");
        Node getProp = IR.getprop(jscover, "someval");
        Node call = IR.call(getProp);
        call.setSourceFileForTesting("Hey");

        assertThat(builder.isInstrumentation(call), is(false));
    }
}