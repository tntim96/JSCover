import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.Parser;
import org.mozilla.javascript.Token;
import org.mozilla.javascript.ast.*;

import java.io.IOException;
import java.io.StringReader;

//https://bugzilla.mozilla.org/show_bug.cgi?id=788070
public class Bug788070 implements NodeVisitor {
    public static void main(String[] args) throws IOException {
        CompilerEnvirons compilerEnv = new CompilerEnvirons();
        compilerEnv.setLanguageVersion(180);
        compilerEnv.setStrictMode(false);

        Bug788070 visitor = new Bug788070();
        addIncrement(new Parser(compilerEnv), visitor, "switch (x) {\n" +
                "case x:\n" +
                "  y = 0;\n" +
                "  break;\n" +
                "default:\n" +
                "  x = 0;\n" +
                "  break;\n" +
                "}\n");
    }

    private static void addIncrement(Parser parser, Bug788070 visitor, String source) throws IOException {
        AstRoot astRoot = parser.parse(new StringReader(source), null, 1);
        astRoot.visitAll(visitor);
    }

    public ExpressionStatement buildInstrumentationStatement(int lineNumber) {
        Name var = new Name(0, "x");
        boolean postFix = true;
        UnaryExpression unaryExpression = new UnaryExpression(Token.INC, 0, var, postFix);
        ExpressionStatement expressionStatement = new ExpressionStatement(unaryExpression);
        expressionStatement.setLineno(lineNumber);
        return expressionStatement;
    }

    public boolean visit(AstNode node) {
        AstNode parent = node.getParent();
        ExpressionStatement newChild = buildInstrumentationStatement(node.getLineno());
        if (node instanceof ExpressionStatement) {
            //System.out.println("node.getLineno() = " + node.getLineno() + ":" +node.toSource());
            parent.addChildBefore(newChild, node);
        }
        return true;
    }
}
