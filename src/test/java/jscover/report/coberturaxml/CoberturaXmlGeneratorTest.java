package jscover.report.coberturaxml;

import org.junit.Test;

public class CoberturaXmlGeneratorTest {
    private CoberturaXmlGenerator generator = new CoberturaXmlGenerator();

    @Test(expected = RuntimeException.class)
    public void shouldWrapException() {
        generator.generateXml(null, null);
    }
}
