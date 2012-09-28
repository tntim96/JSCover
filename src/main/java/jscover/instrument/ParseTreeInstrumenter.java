package jscover.instrument;

import org.mozilla.javascript.Token;
import org.mozilla.javascript.ast.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;

public class ParseTreeInstrumenter implements NodeVisitor {
    private final File log;
    private String fileName;
    private SortedSet<Integer> validLines = new TreeSet<Integer>();

    public ParseTreeInstrumenter(String fileName, File log) {
        this.fileName = fileName;
        this.log = log;
    }

    public SortedSet<Integer> getValidLines() {
        return validLines;
    }

    public ExpressionStatement buildInstrumentationStatement(int lineNumber) {
        if (lineNumber < 1)
            throw new IllegalStateException("Illegal line number: " + lineNumber);
        validLines.add(lineNumber);

        Name var = new Name(0, "_$jscoverage");
        StringLiteral fileNameLiteral = new StringLiteral();
        fileNameLiteral.setValue(fileName);
        fileNameLiteral.setQuoteCharacter('\'');
        ElementGet indexJSFile = new ElementGet(var, fileNameLiteral);

        NumberLiteral lineNumberLiteral = new NumberLiteral();
        lineNumberLiteral.setValue("" + lineNumber);
        ElementGet indexLineNumber = new ElementGet(indexJSFile, lineNumberLiteral);

        boolean postFix = true;
        UnaryExpression unaryExpression = new UnaryExpression(Token.INC, 0, indexLineNumber, postFix);
        return new ExpressionStatement(unaryExpression);
    }

    public boolean visit(AstNode node) {
        try {
            return internalVisit(node);
        } catch (RuntimeException t) {
            if (log == null) {
                throw t;
            }
            synchronized (log) {
                try {
                    PrintStream ps = new PrintStream(new FileOutputStream(log, true));
                    ps.println("-------------------------------------------------------------------------------");
                    ps.println(String.format("Error on line %s of %s", node.getLineno(), fileName));
                    t.printStackTrace(ps);
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }
            }
            return true;
        }
    }

    private boolean internalVisit(AstNode node) {
        if (validLines.contains(node.getLineno())) {
            // Don't add instrumentation if already there
            return true;
        }

        if (node.getParent() != null && node.getLineno() == node.getParent().getLineno()) {
            // Don't add instrumentation if it will be added by parent for the
            // same line
            // TODO Need logic to determine if instrumentation will be added to
            // parent.
            // return true;
        }

        AstNode parent = node.getParent();
        if (parent instanceof ObjectProperty || parent instanceof FunctionCall) {
            return true;
        }
        if (node instanceof SwitchStatement || node instanceof WithStatement) {
            ExpressionStatement newChild = buildInstrumentationStatement(node.getLineno());
            parent.addChildBefore(newChild, node);
        } else if (node instanceof SwitchCase) {
            List<AstNode> statements = ((SwitchCase) node).getStatements();
            if (statements == null) {
                return true;
            }
            for (int i = statements.size() - 1; i >= 0; i--) {
                AstNode statement = statements.get(i);
                ExpressionStatement newChild = buildInstrumentationStatement(statement.getLineno());
                statements.add(i, newChild);
            }
        } else if (node instanceof ExpressionStatement || node instanceof EmptyExpression || node instanceof ContinueStatement
                || node instanceof BreakStatement || node instanceof EmptyStatement || node instanceof ThrowStatement) {

            if (node.getLineno() < 1) {
                //Must be a case expression
                return true;
            }
            ExpressionStatement newChild = buildInstrumentationStatement(node.getLineno());
            if (parent instanceof IfStatement) {
                IfStatement parentIf = (IfStatement) parent;
                Scope scope = new Scope();
                scope.addChild(newChild);
                scope.addChild(node);
                if (parentIf.getThenPart() == node) {
                    parentIf.setThenPart(scope);
                } else if (parentIf.getElsePart() == node) {
                    parentIf.setElsePart(scope);
                }
            } else if (parent instanceof Loop) {
                Loop parentLoop = (Loop) parent;
                Scope scope = new Scope();
                scope.addChild(newChild);
                scope.addChild(node);
                parentLoop.setBody(scope);
            } else if (parent instanceof SwitchCase) {
                //Don't do anything here. Direct modification of statements will result in concurrent modification exception.
            } else {
                if (parent != null) {
                    parent.addChildBefore(newChild, node);
                }
            }
        } else if (node instanceof FunctionNode || node instanceof TryStatement || isDebugStatement(node)) {
            ExpressionStatement newChild = buildInstrumentationStatement(node.getLineno());
            parent.addChildBefore(newChild, node);
        } else if (node instanceof ReturnStatement) {
            ExpressionStatement newChild = buildInstrumentationStatement(node.getLineno());
            if (parent instanceof Block) {
                parent.addChildBefore(newChild, node);
            } else if (parent instanceof IfStatement) {
                IfStatement parentIf = (IfStatement) parent;
                Scope scope = new Scope();
                scope.addChild(newChild);
                scope.addChild(node);
                if (parentIf.getThenPart() == node) {
                    parentIf.setThenPart(scope);
                } else if (parentIf.getElsePart() == node) {
                    parentIf.setElsePart(scope);
                }
            } else {
                parent.addChildBefore(newChild, node);
            }
        } else if (node instanceof VariableDeclaration || node instanceof LetNode) {
            ExpressionStatement newChild = buildInstrumentationStatement(node.getLineno());
            if (!(parent instanceof LetNode)) {// TODO this is a bit specific
                parent.addChildBefore(newChild, node);
            }
        } else if (node instanceof Loop) {
            ExpressionStatement newChild = buildInstrumentationStatement(node.getLineno());
            parent.addChildBefore(newChild, node);
        } else if (node instanceof Label) {
            ExpressionStatement newChild = buildInstrumentationStatement(node.getLineno());
            if (parent instanceof LabeledStatement) {
                LabeledStatement parentLabel = (LabeledStatement) parent;
                Scope scope = new Scope();
                scope.addChild(newChild);
                scope.addChild(parentLabel.getStatement());
                parentLabel.setStatement(scope);
            } else {
                parent.addChildAfter(newChild, node);
            }
        } else if (node instanceof IfStatement) {
            ExpressionStatement newChild = buildInstrumentationStatement(node.getLineno());
            if (parent instanceof IfStatement) {
                IfStatement parentIf = (IfStatement) parent;
                Scope scope = new Scope();
                scope.addChild(newChild);
                scope.addChild(node);
                if (parentIf.getElsePart() == node) {
                    parentIf.setElsePart(scope);
                }
            } else {
                parent.addChildBefore(newChild, node);
            }
        }
        return true;
    }

    private boolean isDebugStatement(AstNode node) {
        if (!(node instanceof KeywordLiteral))
            return false;
        KeywordLiteral keywordLiteral = (KeywordLiteral) node;
        return keywordLiteral.getType() == Token.DEBUGGER;
    }
}
