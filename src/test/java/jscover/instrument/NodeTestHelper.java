package jscover.instrument;


import com.google.javascript.rhino.Node;
import com.google.javascript.rhino.Token;

public class NodeTestHelper {

    public static Node findNode(Node node, Token token) {
        if (node.getToken() == token)
            return node;
        for (Node cursor = node.getFirstChild(); cursor != null; cursor = cursor.getNext()) {
            Node found = findNode(cursor, token);
            if (found != null)
                return found;
        }
        return null;
    }

}
