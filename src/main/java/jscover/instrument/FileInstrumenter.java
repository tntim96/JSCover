package jscover.instrument;

import jscover.format.SourceFormatter;
import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.Parser;
import org.mozilla.javascript.ast.AstRoot;
import jscover.util.IoUtils;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.util.SortedSet;

public class FileInstrumenter {

    private static final String initLine = "  _$jscoverage['%s'][%d] = 0;\n";
    private static final String sourceInOneLine = "_$jscoverage['%s'].source = [%s];\n";

    private String uri;
    private SourceFormatter sourceFormatter;
    private ParseTreeInstrumenter instrumenter;
    private Parser parser;

    public FileInstrumenter(String uri, SourceFormatter sourceFormatter, File log) {
        this.uri = uri;
        this.instrumenter = new ParseTreeInstrumenter(uri, log);
        this.sourceFormatter = sourceFormatter;
        CompilerEnvirons compilerEnv = new CompilerEnvirons();
        // compilerEnv.setAllowMemberExprAsFunctionName(true);
        compilerEnv.setLanguageVersion(180);
        compilerEnv.setStrictMode(false);
        parser = new Parser(compilerEnv);

    }

    public String instrumentFile(String source) {
        return instrumentFile(null, source);
    }

    protected String instrumentFile(String sourceURI, String source) {
        String report = IoUtils.loadFromClassPath("/report.js");
        String header = IoUtils.loadFromClassPath("/header.js");
        return report + header + instrumentFileWithoutHeader(sourceURI, source);
    }

    protected String instrumentFileWithoutHeader(String source) {
        return instrumentFileWithoutHeader(null, source);
    }

    protected String instrumentFileWithoutHeader(String sourceURI, String source) {
        String instrumentedSource = instrumentSource(sourceURI, source);

        String jsLineInitialization = getJsLineInitialization(uri, instrumenter.getValidLines());

        String jsArrayOfHtml = sourceFormatter.toJsArrayOfHtml(source);
        String jsSourceLine = String.format(sourceInOneLine, uri, jsArrayOfHtml);
        return jsLineInitialization + jsSourceLine + instrumentedSource;
    }

    protected String instrumentSource(String source) {
        return instrumentSource(null, source);
    }

    protected String instrumentSource(String sourceURI, String source) {
        AstRoot astRoot;
        try {
            astRoot = parser.parse(new StringReader(source), sourceURI, 1);
            astRoot.visitAll(instrumenter);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return astRoot.toSource();
    }

    protected String getJsLineInitialization(String fileName, SortedSet<Integer> validlines) {
        StringBuffer sb = new StringBuffer(String.format("if (! _$jscoverage['%s']) {\n", fileName));
        sb.append(String.format("  _$jscoverage['%s'] = [];\n", fileName));
        for (Integer line : validlines) {
            sb.append(String.format(initLine, fileName, line));
        }
        sb.append("}\n");
        return sb.toString();
    }
}
