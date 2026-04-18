package jscover.server;

import jscover.util.IoUtils;
import org.htmlunit.WebClient;
import org.htmlunit.html.HtmlElement;
import org.htmlunit.html.HtmlPage;
import org.junit.jupiter.api.Test;

import java.io.File;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

public abstract class HtmlServerUnloadedJSTestBaseClass {
    protected WebClient webClient = new WebClient();
    protected IoUtils ioUtils = IoUtils.getInstance();

    protected abstract String getReportDir();

    protected String getIndex() {
        return "index.html";
    }

    protected String getPrefix() {
        return "";
    }

    @Test
    public void shouldIncludeUnloadJSInSavedReport() throws Exception {
        File jsonFile = new File(getReportDir() + "/jscoverage.json");
        if (jsonFile.exists())
            jsonFile.delete();

        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?" + getIndex());

        page.getHtmlElementById("summaryTab").click();
        webClient.waitForBackgroundJavaScript(2000);
        assertEquals("77%", page.getElementById("summaryTotal").getTextContent());

        verifyCoverage(page, getPrefix() + "/root.js", "80%", "50%", "100%");
        verifyCoverage(page, getPrefix() + "/level1/level1.js", "75%", "50%", "N/A");


        page.getHtmlElementById("storeTab").click();
        webClient.waitForBackgroundJavaScript(500);
        HtmlElement storeButton = page.getHtmlElementById("storeButton");
        storeButton.click();
        webClient.waitForBackgroundJavaScript(2000);
        String result = page.getElementById("storeDiv").getTextContent();

        assertThat(result).contains("Coverage data stored at " + new File(getReportDir()).getPath());

        String json = ioUtils.toString(jsonFile);
        assertThat(json).contains("/root.js");
        assertThat(json).contains("/level1/level2/level2.js");

        String url = "file:///" + new File(getReportDir() + "/jscoverage.html").getAbsolutePath();
        page = webClient.getPage(url);
        webClient.waitForBackgroundJavaScript(1000);
        assertEquals("53%", page.getElementById("summaryTotal").getTextContent());
        assertEquals("33%", page.getElementById("branchSummaryTotal").getTextContent());
        assertEquals("50%", page.getElementById("functionSummaryTotal").getTextContent());
        verifyCoverage(page, "/root.js", "80%", "50%", "100%");
        verifyCoverage(page, "/level1/level1.js", "75%", "50%", "N/A");
        verifyCoverage(page, "/level1/level2/level2.js", "0%", "0%", "0%");
    }

    private void verifyCoverage(HtmlPage page, String uri, String linePercentage, String branchPercentage, String functionPercentage) {
        assertThat(getHtmlElement(page, "//tr[@id='row-" + uri + "']/td[11]/span").getTextContent()).isEqualTo(linePercentage);
        assertThat(getHtmlElement(page, "//tr[@id='row-" + uri + "']/td[12]/span").getTextContent()).isEqualTo(branchPercentage);
        assertThat(getHtmlElement(page, "//tr[@id='row-" + uri + "']/td[13]/span").getTextContent()).isEqualTo(functionPercentage);
    }

    private HtmlElement getHtmlElement(HtmlPage page, String xpathExpr) {
        return (HtmlElement) (page.getByXPath(xpathExpr)).get(0);
    }
}
