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
    public void shouldStoreAndLoadResult() throws Exception {
        File jsonFile = new File(reportDir+"/jscoverage.json");
        if (jsonFile.exists())
            jsonFile.delete();

        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?" + getTestUrl());
        HtmlPage frame = (HtmlPage)page.getFrameByName("browserIframe").getEnclosedPage();
        frame.getElementById("radio2").click();
        frame.getElementById("radio4").click();

        page.getHtmlElementById("storeTab").click();
        webClient.waitForBackgroundJavaScript(500);
        HtmlElement storeButton = page.getHtmlElementById("storeButton");
        storeButton.click();
        webClient.waitForBackgroundJavaScript(2000);
        String result = page.getElementById("storeDiv").getTextContent();

        assertThat(result, containsString("Coverage data stored at target"));

        String json = ioUtils.toString(jsonFile);
        assertThat(json, containsString("/script.js"));

        page = webClient.getPage("file:///"+ new File(reportDir+"/jscoverage.html").getAbsolutePath());
        verifyTotal(webClient, page, 86, 25);
    }

    @Test
    @Override
    public void shouldIncreaseCoverage() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?" + getTestUrl());

        verifyTotal(webClient, page, 6, 0);

        page.getHtmlElementById("browserTab").click();
        HtmlPage frame = (HtmlPage)page.getFrameByName("browserIframe").getEnclosedPage();
        frame.getElementById("radio1").click();
        page.executeJavaScript("jscoverage_recalculateSummaryTab();");
        verifyTotals(page, 60, 0);
        frame.getElementById("radio2").click();
        page.executeJavaScript("jscoverage_recalculateSummaryTab();");
        verifyTotals(page, 73, 25);
        frame.getElementById("radio3").click();
        page.executeJavaScript("jscoverage_recalculateSummaryTab();");
        verifyTotals(page, 86, 50);
        frame.getElementById("radio4").click();
        page.executeJavaScript("jscoverage_recalculateSummaryTab();");
        verifyTotals(page, 100, 75);
    }
}
