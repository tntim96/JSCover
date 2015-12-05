package jscover.instrument;

public class IgnoreComment {
    final static String IGNORE_START = "//#JSCOVERAGE_IF";
    final static String IGNORE_END = "//#JSCOVERAGE_END";//Should be //#JSCOVERAGE_ENDIF, but Rhino may truncate comment
    private int start;
    private int end;
    private String condition;

    public IgnoreComment(String condition, int start) {
        this.condition = condition;
        this.start = start;
    }

    public void setEnd(int end) {
        this.end = end;
    }

    public int getStart() {
        return start;
    }

    public int getEnd() {
        return end;
    }

    public String getCondition() {
        return condition;
    }
}
