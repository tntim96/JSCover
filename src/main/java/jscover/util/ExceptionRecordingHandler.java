package jscover.util;

import java.util.logging.Handler;
import java.util.logging.LogRecord;

public class ExceptionRecordingHandler extends Handler {
    private boolean exceptionThrown;

    public boolean isExceptionThrown() {
        return exceptionThrown;
    }

    @Override
    public void publish(LogRecord record) {
        if (record.getThrown() != null)
            exceptionThrown = true;
    }

    @Override
    public void flush() {
    }

    @Override
    public void close() throws SecurityException {
    }
}
