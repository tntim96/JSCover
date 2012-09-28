package jscover.format;

import static java.lang.String.format;

import java.io.StringReader;

import jscover.util.IoUtils;

public class PlainFormatter implements SourceFormatter {
    public String toJsArrayOfHtml(String source) {
        StringBuffer sb = new StringBuffer();
        for (String line : IoUtils.readLines(new StringReader(source))) {
            if (sb.length() > 0) {
                sb.append(",");
            }
            sb.append("\"");
            sb.append(escapeHtml(line));
            sb.append("\"");
        }
        return sb.toString();
    }

    private String escapeHtml(String string) {
        StringBuffer result = new StringBuffer();
        for (int i = 0; i < string.length(); i++) {
            char c = string.charAt(i);
            switch (c) {
            case '&':
                result.append("&amp;");
                break;
            case '<':
                result.append("&lt;");
                break;
            case '>':
                result.append("&gt;");
                break;
            case '"':
                result.append("\\\"");
                break;
            case '\\':
                result.append("\\\\");
                break;
            case '\t':
                result.append("\\t");
                break;
            default:
                if (32 <= c && c <= 126) {
                    result.append(c);
                } else {
                    result.append(format("&#%d;", (int)c));
                }
                break;
            }
        }
        return result.toString();
    }
}
