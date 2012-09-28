package jscover.instrument;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.FilenameFilter;
import java.util.HashSet;
import java.util.Set;

import jscover.format.PlainFormatter;
import org.junit.Ignore;
import org.junit.Test;

import jscover.util.IoUtils;
import org.mozilla.javascript.Context;

public class InstrumentAndHighlightRegressionTest {
    private static Set<String> tested = new HashSet<String>();

    private PlainFormatter sourceFormatter = new PlainFormatter();

    @Test
    public void shouldInstrumentArray() {
        testFile("javascript-array-comprehension.js");
    }

    @Test
    public void shouldInstrumentAssign() {
        testFile("javascript-assign.js");
    }

    @Test
    public void shouldInstrumentColon() {
        testFile("javascript-colon.js");
    }

    @Test
    public void shouldInstrumentComma() {
        testFile("javascript-comma.js");
    }

    @Test
    public void shouldInstrumentConst() {
        testFile("javascript-const.js");
    }

    @Test
    public void shouldInstrumentCr() {
        testFile("javascript-cr.js");
    }

    @Test
    public void shouldInstrumentCrLf() {
        testFile("javascript-crlf.js");
    }

    @Test
    public void shouldInstrumentDec() {
        testFile("javascript-dec.js");
    }

    @Test//https://bugzilla.mozilla.org/show_bug.cgi?id=688021
    public void shouldInstrumentDebugger() {
        testFile("javascript-debugger.js");
    }

    @Test
    public void shouldInstrumentDelete() {
        testFile("javascript-delete.js");
    }

    @Test//https://bugzilla.mozilla.org/show_bug.cgi?id=689308, https://bugzilla.mozilla.org/show_bug.cgi?id=689314
    public void shouldInstrumentDestructuring() {
        testFile("javascript-destructuring.js");
    }

    @Test
    public void shouldInstrumentDo() {
        testFile("javascript-do.js");
    }

    @Test
    public void shouldInstrumentDot() {
        testFile("javascript-dot.js");
    }

    @Test
    public void shouldInstrumentEmpty() {
        testFile("javascript-empty.js");
    }

    @Test
    public void shouldInstrumentFor() {
        testFile("javascript-for.js");
    }

    @Test
    public void shouldInstrumentForEach() {
        testFile("javascript-foreach.js");
    }

    @Test//https://bugzilla.mozilla.org/show_bug.cgi?id=687669
    public void shouldInstrumentFunction() {
        testFile("javascript-function.js");
    }

    @Test
    @Ignore
    public void shouldInstrumentFunctionChain() {
        testFile("javascript-function-chain.js");
    }

    @Test
    public void shouldInstrumentGenerator() {
        testFile("javascript-generator.js");
    }

    @Test
    @Ignore
    public void shouldInstrumentGeneratorExpression() {
        testFile("javascript-generator-expression.js");
    }

    @Test
    @Ignore
    public void shouldInstrumentGetterSetter() {
        testFile("javascript-getter-setter.js");
    }

    @Test
    public void shouldInstrumentHook() {
        testFile("javascript-hook.js");
    }

    @Test
    public void shouldInstrumentIf() {
        testFile("javascript-if.js");
    }

    @Test
    public void shouldInstrumentIn() {
        testFile("javascript-in.js");
    }

    @Test
    public void shouldInstrumentInc() {
        testFile("javascript-inc.js");
    }

    @Test
    @Ignore
    public void shouldInstrumentISO_8859_1() {
        testFile("javascript-iso-8859-1.js");
    }

    @Test
    public void shouldInstrumentJSONObject() {
        testFile("javascript-json-object.js");
    }

    @Test//https://bugzilla.mozilla.org/show_bug.cgi?id=689314
    public void shouldInstrumentLambda() {
        testFile("javascript-lambda.js");
    }

    @Test
    public void shouldInstrumentLet() {
        testFile("javascript-let.js");
    }

    @Test
    public void shouldInstrumentLineFeed() {
        testFile("javascript-lf.js");
    }

    @Test
    public void shouldInstrumentNew() {
        testFile("javascript-new.js");
    }

    @Test
    public void shouldInstrumentNumber() {
        testFile("javascript-number.js");
    }

    @Test
    public void shouldInstrumentObject() {
        testFile("javascript-object.js");
    }

    @Test
    public void shouldInstrumentOp() {
        testFile("javascript-op.js");
    }

    @Test
    public void shouldInstrumentPrimary() {
        testFile("javascript-primary.js");
    }

    @Test
    public void shouldInstrumentRb() {
        testFile("javascript-rb.js");
    }

    @Test
    public void shouldInstrumentRc() {
        testFile("javascript-rc.js");
    }

    @Test
    public void shouldInstrumentRp() {
        testFile("javascript-rp.js");
    }

    @Test
    public void shouldInstrumentSpecialCharacters() {
        testFile("javascript-special-characters.js");
    }

    @Test
    public void shouldInstrumentString() {
        testFile("javascript-string.js");
    }

    @Test//https://bugzilla.mozilla.org/show_bug.cgi?id=788070
    public void shouldInstrumentSwitch() {
        testFile("javascript-switch.js");
    }

    @Test
    @Ignore
    public void shouldInstrumentThrow() {
        testFile("javascript-throw.js");
    }

    @Test
    @Ignore
    public void shouldInstrumentTry() {
        testFile("javascript-try.js");
    }

    @Test //https://bugzilla.mozilla.org/show_bug.cgi?id=688018
    public void shouldInstrumentUnaryOp() {
        testFile("javascript-unaryop.js");
    }

    @Test
    public void shouldInstrumentVar() {
        testFile("javascript-var.js");
    }

    @Test//https://bugzilla.mozilla.org/show_bug.cgi?id=784651
    public void shouldInstrumentWhile() {
        testFile("javascript-while.js");
    }

    @Test
    @Ignore
    public void shouldInstrumentWith() {
        testFile("javascript-with.js");
    }

    @Test
    public void shouldTestTheRest() {
        File testDir = new File("src/test/resources/data/javascript");
        FilenameFilter filter = new FilenameFilter() {
            public boolean accept(File file, String name) {
                return name.endsWith(".js") && !tested.contains(name);
            }
        };
        for (String jsFile : testDir.list(filter)) {
            testFileWithoutStopping(jsFile);
        }
    }

    private void testFile(String fileName) {
        tested.add(fileName);
        FileInstrumenter instrumenter = new FileInstrumenter(Context.VERSION_1_8, fileName, sourceFormatter, null);

        String source = IoUtils.loadFromClassPath("/data/javascript/" + fileName);
        String instrumentedSource = instrumenter.instrumentFileWithoutHeader(source);
        String expectedSource = IoUtils.loadFromClassPath("/data/javascript.expected/" + fileName);
        assertEquals(expectedSource, instrumentedSource);
        //assertEquals(removeHighlightLine(expectedSource), removeHighlightLine(instrumentedSource));
    }

//    private String removeHighlightLine(String string) {
//        StringBuffer sb = new StringBuffer();
//        for (String line: IoUtils.readLines(new StringReader(string))) {
//            if (sb.length()>0) {
//                sb.append("\n");
//            }
//            if (line.indexOf(".js'].source = [\"")==-1) {
//                sb.append(line);
//            }
//        }
//        return sb.toString();
//    }

    private void testFileWithoutStopping(String fileName) {
        System.out.print("Test " + fileName + " ");
        try {
            testFile(fileName);
            System.out.println("passed");
        } catch (AssertionError e) {
            System.out.println("failed");
        } catch (Throwable t) {
            System.out.println("errored");
        }
    }
}
