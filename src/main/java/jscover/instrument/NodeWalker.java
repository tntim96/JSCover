package jscover.instrument;

import com.google.javascript.rhino.Node;

public class NodeWalker {
    public void visit(Node n, NodeVisitorCC callback) {
        callback.visit(n);
        for (Node cursor = n.getFirstChild(); cursor != null; cursor = cursor.getNext())
            visit(cursor, callback);
    }

//    public void visit(Node n, AstAlteredNodeCallback callback) {
//        callback.visit(n);
//        for (Node cursor = n.getFirstChild(); cursor != null; cursor = cursor.getNext())
//            visit(cursor, callback);
//    }
//
//    public void visitAndExitOnAstChange(Node n, AstAlteredNodeCallback callback) {
//        if (callback.visit(n))
//            return;
//        for (Node cursor = n.getFirstChild(); cursor != null; cursor = cursor.getNext())
//            visitAndExitOnAstChange(cursor, callback);
//    }
}
