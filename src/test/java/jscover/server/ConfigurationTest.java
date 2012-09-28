package jscover.server;

import org.junit.Test;

import java.io.File;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

public class ConfigurationTest {

    @Test
    public void shouldHaveDefaults() {
        Configuration configuration = Configuration.parse(new String[]{});
        assertThat(configuration.showHelp(), equalTo(false));
        assertThat(configuration.getDocumentRoot().toString(), equalTo(System.getProperty("user.dir")));
        assertThat(configuration.getPort(), equalTo(8080));
        assertThat(configuration.skipInstrumentation("/"), equalTo(false));
    }

    @Test
    public void shouldShowHelpOnError() {
        assertThat(Configuration.parse(new String[]{"unknown"}).showHelp(), equalTo(true));
    }

    @Test
    public void shouldParseHelp() {
        assertThat(Configuration.parse(new String[]{}).showHelp(), equalTo(false));
        assertThat(Configuration.parse(new String[]{"-h"}).showHelp(), equalTo(true));
        assertThat(Configuration.parse(new String[]{"--help"}).showHelp(), equalTo(true));
    }

    @Test
    public void shouldParseVersion() {
        assertThat(Configuration.parse(new String[]{}).printVersion(), equalTo(false));
        assertThat(Configuration.parse(new String[]{"-V"}).printVersion(), equalTo(true));
        assertThat(Configuration.parse(new String[]{"--version"}).printVersion(), equalTo(true));
    }

    @Test
    public void shouldGetVersionText() {
        assertThat(new Configuration().getVersionText(), equalTo("JSCover version: 0.0.1"));
    }

    @Test
    public void shouldParseDocumentRoot() {
        assertThat(Configuration.parse(new String[]{"--document-root=/"}).getDocumentRoot(), equalTo(new File("/")));
    }

    @Test
    public void shouldParsePort() {
        assertThat(Configuration.parse(new String[]{"--port=80"}).getPort(), equalTo(80));
    }

    @Test
    public void shouldParseReportDir() {
        assertThat(Configuration.parse(new String[]{"--report-dir=/"}).getReportDir(), equalTo(new File("/")));
    }

    @Test
    public void shouldParseNoInstrument() {
        Configuration configuration = Configuration.parse(new String[]{"--no-instrument=/lib1","--no-instrument=/lib2"});
        assertThat(configuration.skipInstrumentation("/test.js"), equalTo(false));
        assertThat(configuration.skipInstrumentation("/lib1/test.js"), equalTo(true));
        assertThat(configuration.skipInstrumentation("/lib2/test.js"), equalTo(true));
        assertThat(configuration.skipInstrumentation("/lib3/test.js"), equalTo(false));
    }

    @Test
    public void shouldRetrieveHelpText() {
        String helpText = new Configuration().getHelpText();
        assertThat(helpText, containsString("Usage: java -jar jscover.jar [OPTION]..."));
    }
}
