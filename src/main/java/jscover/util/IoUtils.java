package jscover.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.util.List;

import org.apache.commons.io.IOUtils;

public abstract class IoUtils {
    public static String toString(InputStream is) {
        try {
            return IOUtils.toString(is);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @SuppressWarnings("unchecked")
    public static List<String> readLines(InputStream is) {
        try {
            return IOUtils.readLines(is);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @SuppressWarnings("unchecked")
    public static List<String> readLines(Reader reader) {
        try {
            return IOUtils.readLines(reader);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static String loadFromClassPath(String dataFile) {
        InputStream is = null;
        try {
//            is = Thread.currentThread().getContextClassLoader().getResourceAsStream(dataFile);
            is = IoUtils.class.getResourceAsStream(dataFile);
            return IOUtils.toString(is, "UTF-8");
        } catch (Throwable e) {
            throw new RuntimeException(String.format("Problem loading file: '%s'",dataFile),e);
        } finally {
            IOUtils.closeQuietly(is);
        }
    }
}
