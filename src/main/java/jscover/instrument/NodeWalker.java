package jscover.instrument;

import com.google.javascript.rhino.Node;

import java.util.ArrayList;
import java.util.List;

public class NodeWalker {
    public void visit(Node n, NodeVisitorCC callback) {
        List<Node> children = new ArrayList<>();
        callback.visit(n);
        for (int i = 0; i < n.getChildCount(); i++) {
            children.add(n.getChildAtIndex(i));
        }
        for (Node child : children) {
            visit(child, callback);
        }
    }

//    public void visit(Node n, NodeVisitorCC callback) {
//          callback.visit(n);
//        for (Node cursor = n.getFirstChild(); cursor != null; cursor = cursor.getNext()) {
//            visit(cursor, callback);
//        }
//    }
//
//    public void visitAndExitOnAstChange(Node n, AstAlteredNodeCallback callback) {
//        if (callback.visit(n))
//            return;
//        for (Node cursor = n.getFirstChild(); cursor != null; cursor = cursor.getNext())
//            visitAndExitOnAstChange(cursor, callback);
//    }
}
