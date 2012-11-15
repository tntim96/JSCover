package jscover.server;

import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import org.junit.Test;

import java.io.File;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;

public class HtmlUnitServerBranchTest extends HtmlUnitServerTest {
    protected String[] args = new String[]{
            "-ws",
            "--document-root=src/test-acceptance/resources",
            "--port=9001",
            "--no-instrument=example/lib",
            "--branch",
            "--report-dir=" + reportDir
    };

    @Override
    protected String[] getArgs() {
        return args;
    }

    @Test
    @Override
    public void shouldWorkWithServerIFrameByURLWithDOMInteraction() throws Exception {
        testWorkWithServerIFrameByURLWithDOMInteraction(25);
    }

    @Test
    @Override
    public void shouldWorkInInvertedMode() throws Exception {
        testWorkInInvertedMode(0, 37);
    }

    @Test
    @Override
    public void shouldIncreaseCoverage() throws Exception {
        testIncreaseCoverage(12, 37, 62, 87);
    }

    @Test
    @Override
    public void shouldStoreAndLoadResult() throws Exception {
        testStoreAndLoadResult(62);
    }
}
