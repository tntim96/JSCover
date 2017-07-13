package jscover.instrument;

import com.google.javascript.rhino.Node;

public interface NodeVisitorCC {
    boolean visit(Node node);
}
