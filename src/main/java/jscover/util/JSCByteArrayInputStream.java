package jscover.util;

import java.io.ByteArrayInputStream;

public class JSCByteArrayInputStream extends ByteArrayInputStream {

    public JSCByteArrayInputStream(byte[] buf, int offset, int length) {
        super(buf, offset, length);
    }

    public int getPosition() {
        return pos;
    }
}
