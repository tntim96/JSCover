package jscover.util;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class IoUtilsTest {
    @Test(expected = RuntimeException.class)
    public void shouldWrapExceptionsInReadLinesInputStream() {
        IoUtils.readLines(new MyInputStream());
    }

    @Test(expected = RuntimeException.class)
    public void shouldWrapExceptionsInReadLinesStringReader() {
        IoUtils.readLines(new MyReader());
    }

    @Test(expected = RuntimeException.class)
    public void shouldWrapExceptionsInToStringInputStream() {
        IoUtils.toString(new MyInputStream());
    }

    @Test
    public void shouldLoadFileFromClasspathAbsolutePath() {
        assertEquals(IoUtils.loadFromClassPath("/jscover/util/test.txt"),"Working!");
    }

    @Test//(expected = RuntimeException.class)
    public void shouldLoadFileFromClasspathRelativePath() {
        assertEquals(IoUtils.loadFromClassPath("test.txt"),"Working!");
    }

    @Test(expected = RuntimeException.class)
    public void shouldNotLoadFileFromClasspath() {
        IoUtils.loadFromClassPath("/test.txt");
    }

    static class MyInputStream extends InputStream {
        @Override
        public int read() throws IOException {
            throw new IOException();
        }

    }

    static class MyReader extends Reader {
        @Override
        public void close() throws IOException {
            throw new IOException();
        }

        @Override
        public int read(char[] arg0, int arg1, int arg2) throws IOException {
            throw new IOException();
        }
    }
}
