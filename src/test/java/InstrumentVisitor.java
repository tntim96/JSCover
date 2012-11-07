
import java.io.StringReader;

import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.Parser;
import org.mozilla.javascript.ast.AstNode;
import org.mozilla.javascript.ast.AstRoot;
import org.mozilla.javascript.ast.NodeVisitor;

import jscover.util.IoUtils;


public class InstrumentVisitor implements NodeVisitor {
    private static IoUtils ioUtils = IoUtils.getInstance();

    public static void main(String args[]) throws Exception {
        String source = ioUtils.loadFromClassPath("/test.js");
//        String source = "let ({x: x0, y: y0} = point) {\n  print(x0);\n  print(y0);\n}";
        CompilerEnvirons compilerEnv = new CompilerEnvirons();
        compilerEnv.setLanguageVersion(180);
        Parser parser = new Parser(compilerEnv);
        AstRoot astRoot = parser.parse(new StringReader(source), null, 1);
        astRoot.visitAll(new InstrumentVisitor());
        System.out.println(astRoot.toSource());
//        System.out.println("****************************");
//
//        source = "label:{\nx++;\nwhile (x) {\n  if (x) {\n    continue label;\n  }\n}}";
//        parser = new Parser();
//        astRoot = parser.parse(new StringReader(source), null, 1);
//        astRoot.visitAll(new InstrumentVisitor());
    }

    public boolean visit(AstNode node) {
        for (int i=0;i<node.depth();i++) {
            System.out.print("  "); 
        }
        
//      String type = Token.typeToName(node.getType());
//        switch (node.getType()) {
//            case Token.MUL: type = "STAR";break;
//          case Token.EXPR_RESULT: type = "SEMI";break;
//        }
        System.out.println(node.getClass().getSimpleName());
//        int nodePosition = getNodePosition(node);
//        System.out.println(String.format("%s: starts at line %d, column %d, ends at line %d, column %d",
//                type,
//                node.getLineno(),
//                nodePosition,
//                node.getLastChild()==null?node.getLineno():node.getLastChild().getLineno(),
//                (nodePosition+node.getLength())));
        return true;
    }

//    private int getNodePosition(AstNode node) {
//        int nodePosition = node.getPosition();
//        AstNode parent = node.getParent();
//        if (parent!=null) {
//            if (parent.getLineno()==node.getLineno())
//                nodePosition += parent.getPosition();
//        }
//        return nodePosition;
//    }

}
