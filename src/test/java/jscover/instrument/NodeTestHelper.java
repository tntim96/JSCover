package jscover.instrument;

import org.mozilla.javascript.ast.AstNode;
import org.mozilla.javascript.ast.AstRoot;
import org.mozilla.javascript.ast.NodeVisitor;


public class NodeTestHelper {

    static class SearchNodeVisitor implements NodeVisitor {

        private int type;
        private AstNode node;

        public SearchNodeVisitor(int type) {
            this.type = type;
        }

        public boolean visit(AstNode astNode) {
            if (astNode.getType() == type) {
                node = astNode;
                return false;
            }
            return true;
        }


        public AstNode getNode() {
            return node;
        }

    }

    public static AstNode findNode(AstRoot node, int token) {
        SearchNodeVisitor visitor = new SearchNodeVisitor(token);
        node.visitAll(visitor);
        return visitor.getNode();
    }

}
