package jscover.instrument;

import com.google.javascript.rhino.Node;

public interface NodeVisitor {
    boolean visit(Node node);
}
