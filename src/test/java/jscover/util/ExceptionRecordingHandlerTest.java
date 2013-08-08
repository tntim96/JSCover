package jscover.util;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.logging.LogRecord;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class ExceptionRecordingHandlerTest {
    private ExceptionRecordingHandler handler = new ExceptionRecordingHandler();
    private @Mock LogRecord logRecord;

    @Test
    public void shouldRecordException() {
        given(logRecord.getThrown()).willReturn(new RuntimeException("Hey"));

        handler.publish(logRecord);

        assertThat(handler.isExceptionThrown(), is(true));
    }

    @Test
    public void shouldNotRecordException() {
        handler.publish(logRecord);

        assertThat(handler.isExceptionThrown(), is(false));
    }

    @Test
    public void shouldNotThrowExceptionOnFlush() {
        handler.flush();
    }

    @Test
    public void shouldNotThrowExceptionOnClose() {
        handler.close();
    }
}
