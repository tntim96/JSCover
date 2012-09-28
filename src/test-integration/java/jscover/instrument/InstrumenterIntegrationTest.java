package jscover.instrument;

import static org.junit.Assert.assertEquals;

import java.net.URISyntaxException;

import jscover.format.PlainFormatter;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import jscover.util.IoUtils;

@RunWith(JUnit4.class)
public class InstrumenterIntegrationTest {
    private FileInstrumenter instrumenter;

    @Test
    public void shouldInstrumentStatements() throws URISyntaxException {
        String fileName = "test-simple.js";
        String source = IoUtils.loadFromClassPath("/" + fileName);
        instrumenter = new FileInstrumenter(fileName, new PlainFormatter(), null);

        String instrumentedSource = instrumenter.instrumentFile(null, source);

        String expectedSource = IoUtils.loadFromClassPath("/test-instrumented.js");
        // assertThat(instrumentedSource, equalTo(expectedSource));
        assertEquals(expectedSource, instrumentedSource);
    }

}
