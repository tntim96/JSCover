import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.Parser;
import org.mozilla.javascript.Token;
import org.mozilla.javascript.ast.*;

import java.io.IOException;
import java.io.StringReader;

//https://bugzilla.mozilla.org/show_bug.cgi?id=784651
public class Bug784651 implements NodeVisitor {
    public static void main(String[] args) throws IOException {
        CompilerEnvirons compilerEnv = new CompilerEnvirons();
        compilerEnv.setLanguageVersion(180);
        compilerEnv.setStrictMode(false);

        Bug784651 visitor = new Bug784651();
        addIncrement(new Parser(compilerEnv), visitor, "while (x)\n{\n  ;\n}");
        System.err.println("*************************");
        addIncrement(new Parser(compilerEnv), visitor, "while (x)\n  ;");
    }

    private static void addIncrement(Parser parser, Bug784651 visitor, String source) throws IOException {
        AstRoot astRoot = parser.parse(new StringReader(source), null, 1);
        astRoot.visitAll(visitor);
        System.err.println("Before:\n" + source);
        System.err.println("After :\n" + astRoot.toSource());
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
        if (node instanceof EmptyStatement) {
                parent.replaceChild(node, newChild);
        }
        return true;
    }
}
