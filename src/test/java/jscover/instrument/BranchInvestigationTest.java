package jscover.instrument;

import org.junit.Ignore;
import org.junit.Test;
import org.mozilla.javascript.Parser;
import org.mozilla.javascript.Token;
import org.mozilla.javascript.ast.*;

import java.util.ArrayList;
import java.util.List;

import static java.lang.String.format;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.MatcherAssert.assertThat;

public class BranchInvestigationTest  implements NodeVisitor {
    private static int count = 0;
    private Parser parser = new Parser();
    private List<Integer> tokens = new ArrayList<Integer>();

    @Test
    public void shouldDetectSimpleCondition() {
        String script = "if (x < 0) {\n" +
                "  x++;\n" +
                "};";
        runTest(script);

        assertThat(tokens.size(), equalTo(1));
        assertThat(tokens, hasItem(Token.LT));
    }

    @Test
    public void shouldDetectMultipleConditions() {
        String script = "if ((x < y) && (y >= z)) {\n" +
                "  x++;\n" +
                "};";
        runTest(script);

        assertThat(tokens.size(), equalTo(3));
        assertThat(tokens, hasItem(Token.LT));
        assertThat(tokens, hasItem(Token.GE));
        assertThat(tokens, hasItem(Token.AND));
    }

    @Test
    @Ignore
    public void shouldDetectTernary() {
        String script = "x = x === 0 ? x : y;";
        runTest(script);

        assertThat(tokens.size(), equalTo(1));
        assertThat(tokens, hasItem(Token.SHEQ));
    }

    private void runTest(String script) {
        System.out.println("--------------------------------------");
        System.out.println("script = " + script);
        AstRoot astRoot = parser.parse(script, null, 1);
        astRoot.visitAll(this);
        System.out.println("astRoot.toSource() = " + astRoot.toSource());
    }


    public boolean visit(AstNode node) {
        if (isBoolean(node)) {
            tokens.add(node.getType());
            replaceWithFunction((InfixExpression)node);
        }
        return true;
    }

    private boolean isBoolean(AstNode node) {
//        System.out.println(format("node: %s %d",Token.typeToName(node.getType()), node.getType()));
        return node instanceof InfixExpression;// && !(node.getParent() instanceof InfixExpression);
//        switch (node.getType()) {
//            case Token.EQ:
//            case Token.NE:
//            case Token.LT:
//            case Token.LE:
//            case Token.GT:
//            case Token.GE:
//            case Token.NOT:
//            case Token.SHEQ:
//            case Token.SHNE:
//            case Token.OR:
//            case Token.AND:
//                return true;
//            default:return false;
//        }
    }

    private void replaceWithFunction(InfixExpression node) {
        AstRoot astRoot = node.getAstRoot();
        AstNode parent = node.getParent();
        Name name = new Name(1, "visit"+(++count));
        FunctionNode functionNode = new FunctionNode(node.getPosition(), name);
        if (node.getLeft() instanceof Name)
            functionNode.addParam(node.getLeft());
        if (node.getRight() instanceof Name)
            functionNode.addParam(node.getRight());
        ReturnStatement returnStatement = new ReturnStatement();
        returnStatement.setReturnValue(node);
        functionNode.setBody(returnStatement);
        if (astRoot != null)
            astRoot.addChildrenToFront(functionNode);

        FunctionCall functionCall = new FunctionCall();
        List<AstNode> arguments = new ArrayList<AstNode>();
        functionCall.setTarget(name);

        AstNode left = node.getLeft();
        if (left instanceof Name)
            arguments.add(left);
        AstNode right = node.getRight();
        if (right instanceof Name)
            arguments.add(right);
//        System.out.println("functionCall = " + functionCall.toSource());
        functionCall.setArguments(arguments);
        if (parent instanceof IfStatement && node == ((IfStatement) parent).getCondition()) {
            ((IfStatement) parent).setCondition(functionCall);
        }
//        functionNode.setBody(node);
//        node.getParent().replaceChild(node, functionNode);
    }
}
