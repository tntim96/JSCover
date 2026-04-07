package jscover.server;

import jscover.util.IoUtils;
import org.htmlunit.Page;
import org.htmlunit.WebClient;
import org.htmlunit.WebWindow;
import org.htmlunit.html.HtmlInput;
import org.htmlunit.html.HtmlPage;
import org.htmlunit.html.HtmlTable;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;

public abstract class HtmlUnitServerTestBaseClass {
    protected WebClient webClient = new WebClient();
    protected IoUtils ioUtils = IoUtils.getInstance();
    protected abstract String getReportDir();

    protected String getTestUrl() {
        return "example/index.html";
    }

    @BeforeEach
    public void setUp() {
        webClient.getOptions().setFileProtocolForXMLHttpRequestsAllowed(true);
        webClient.getOptions().setTimeout(1000);
    }

    @Test
    public void shouldNotInstrument() throws Exception {
        Page page = webClient.getPage("http://localhost:9001/example/lib/noInstrument.js");
        assertThat(page.getWebResponse().getContentAsString(), equalTo("alert('Hey');"));
    }

    @Test
    public void shouldWorkWithServerIFrameByURL() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?" + getTestUrl());
        verifyTotal(webClient, page, 15);
    }

    @Test
    public void shouldWorkWithServerIFrameByURLParameterU() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?u=" + getTestUrl());
        verifyTotal(webClient, page, 15);
    }

    @Test
    public void shouldWorkWithServerIFrameByURLParameterURL() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?url=" + getTestUrl());
        verifyTotal(webClient, page, 15);
    }

    @Test
    public void shouldWorkWithServerIFrameByURLParameterF() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?f=" + getTestUrl());
        verifyTotal(webClient, page, 15);
    }

    @Test
    public void shouldWorkWithServerIFrameByURLParameterFrame() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?frame=" + getTestUrl());
        verifyTotal(webClient, page, 15);
    }

    @Test
    public void shouldWorkWithServerIFrameByURLWithDOMInteraction() throws Exception {
        testWorkWithServerIFrameByURLWithDOMInteraction(0, 0);
    }

    protected void testWorkWithServerIFrameByURLWithDOMInteraction(int branchPercentage, int functionPercentage) throws IOException {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?" + getTestUrl());
        HtmlPage frame = (HtmlPage)page.getFrameByName("browserIframe").getEnclosedPage();

        frame.getHtmlElementById("radio2").click();
        webClient.waitForBackgroundJavaScript(500);
        verifyTotal(webClient, page, 68, branchPercentage, functionPercentage);
    }

    @Test
    public void shouldDisplayCoverageInformationOnSourcePage() throws IOException {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?" + getTestUrl());
        HtmlPage frame = (HtmlPage)page.getFrameByName("browserIframe").getEnclosedPage();

        verifyTotal(webClient, page, 15);

        page.getAnchorByText("/example/script.js").click();
        webClient.waitForBackgroundJavaScript(2000);
        HtmlTable sourceTable = (HtmlTable)page.getElementById("sourceTable");
        verifySource(sourceTable, 11, 0, "  else if (element.id === 'radio2') {");
        verifySource(sourceTable, 12, 0, "    message = getMessage(2);");

        frame.getHtmlElementById("radio2").click();
        webClient.waitForBackgroundJavaScript(500);
        verifyTotal(webClient, page, 68, 0, 0);

        page.getAnchorByText("/example/script.js").click();
        webClient.waitForBackgroundJavaScript(2000);
        sourceTable = (HtmlTable)page.getElementById("sourceTable");
        verifySource(sourceTable, 11, 1, "  else if (element.id === 'radio2') {");
        verifySource(sourceTable, 12, 1, "    message = getMessage(2);");
    }

    private void verifySource(HtmlTable sourceTable, int row, int coverageCount, String source) {
        assertThat(sourceTable.getRow(row).getCell(1).asNormalizedText(), equalTo(""+coverageCount));
        assertThat(sourceTable.getRow(row).getCell(2).asNormalizedText(), equalTo(source));
    }

    @Test
    public void shouldStoreAndLoadResult() throws Exception {
        testStoreAndLoadResult(0, 0);
    }

    protected void testStoreAndLoadResult(int branchPercentage, int functionPercentage) throws IOException {
        File jsonFile = new File(getReportDir()+"/jscoverage.json");
        if (jsonFile.exists())
            jsonFile.delete();

        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?" + getTestUrl());
        HtmlPage frame = (HtmlPage)page.getFrameByName("browserIframe").getEnclosedPage();
        frame.getHtmlElementById("radio2").click();
        frame.getHtmlElementById("radio4").click();

        page.getHtmlElementById("storeTab").click();
        webClient.waitForBackgroundJavaScript(500);
        page.getHtmlElementById("storeButton").click();
        webClient.waitForBackgroundJavaScript(2000);
        String result = page.getElementById("storeDiv").getTextContent();

        assertThat(result, containsString("Coverage data stored at target"));

        String json = ioUtils.toString(jsonFile);
        assertThat(json, containsString("/script.js"));

        page = webClient.getPage("file:///"+ new File(getReportDir()+"/jscoverage.html").getAbsolutePath());
        verifyTotal(webClient, page, 89, branchPercentage, functionPercentage);
    }

    @Test
    public void shouldStoreResultViaJavaScriptCall() throws Exception {
        File jsonFile = new File(getReportDir() + "/directory/jscoverage.json");
        if (jsonFile.exists())
            jsonFile.delete();

        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html");
        ((HtmlInput)page.getHtmlElementById("location")).setValue("http://localhost:9001/example/index.html");
        page.getHtmlElementById("openInWindowButton").click();
        webClient.waitForBackgroundJavaScript(100);

        verifyTotal(webClient, page, 15);

        WebWindow webWindow = webClient.getWebWindowByName("jscoverage_window");
        ((HtmlPage)webWindow.getEnclosedPage()).executeJavaScript("jscoverage_report('directory');");
        webClient.waitForBackgroundJavaScript(2000);

        String json = ioUtils.toString(jsonFile);
        assertThat(json, containsString("/script.js"));

        page = webClient.getPage("file:///"+ new File(getReportDir()+"/directory/jscoverage.html").getAbsolutePath());
        verifyTotal(webClient, page, 15);
    }

    @Test
    public void shouldStoreResultViaJavaScriptCallWithoutUI() throws Exception {
        File jsonFile = new File(getReportDir() + "/directory-no-ui/jscoverage.json");
        if (jsonFile.exists())
            jsonFile.delete();

        HtmlPage page = webClient.getPage("http://localhost:9001/example/index.html");

        page.executeJavaScript("jscoverage_report('directory-no-ui');");
        webClient.waitForBackgroundJavaScript(2000);

        String json = ioUtils.toString(jsonFile);
        assertThat(json, containsString("/script.js"));

        page = webClient.getPage("file:///"+ new File(getReportDir()+"/directory-no-ui/jscoverage.html").getAbsolutePath());
        verifyTotal(webClient, page, 15);
    }

    @Test
    public void shouldStoreResultViaJavaScriptCallWithoutUIAsync() throws Exception {
        File jsonFile = new File(getReportDir() + "/directory-no-ui-cb/jscoverage.json");
        if (jsonFile.exists())
            jsonFile.delete();

        HtmlPage page = webClient.getPage("http://localhost:9001/example/index.html");

        page.executeJavaScript("jscoverage_report('directory-no-ui-cb', function(response){});");
        webClient.waitForBackgroundJavaScript(100);

        String json = ioUtils.toString(jsonFile);
        assertThat(json, containsString("/script.js"));

        page = webClient.getPage("file:///"+ new File(getReportDir()+"/directory-no-ui-cb/jscoverage.html").getAbsolutePath());
        verifyTotal(webClient, page, 15);
    }

    @Test
    public void shouldWorkWithServerIFrameByNavigationButtons() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html");
        ((HtmlInput)page.getHtmlElementById("location")).setValue("http://localhost:9001/example/index.html");
        page.getHtmlElementById("openInFrameButton").click();
        webClient.waitForBackgroundJavaScript(100);

        verifyTotal(webClient, page, 15);
    }

    @Test
    public void shouldWorkWithServerWindowByNavigationButtons() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html");
        ((HtmlInput)page.getHtmlElementById("location")).setValue("http://localhost:9001/example/index.html");
        page.getHtmlElementById("openInWindowButton").click();
        webClient.waitForBackgroundJavaScript(100);

        verifyTotal(webClient, page, 15);
    }

    @Test
    public void shouldWorkInInvertedMode() throws Exception {
        testWorkInInvertedMode(0, 0, 0, 0);
    }

    protected void testWorkInInvertedMode(int branchPercentage1, int branchPercentage2, int functionPercentage1, int functionPercentage2) throws IOException {
        HtmlPage page = webClient.getPage("http://localhost:9001/example/index.html");
        page.getHtmlElementById("launchJSCover").click();
        webClient.waitForBackgroundJavaScript(100);

        WebWindow webWindow = webClient.getWebWindowByName("JSCoverInvertedMode");
        HtmlPage jsCoverPage = (HtmlPage)webWindow.getEnclosedPage();

        verifyTotal(webClient, jsCoverPage, 15, branchPercentage1, functionPercentage1);

        page.getHtmlElementById("radio3").click();
        webClient.waitForBackgroundJavaScript(100);

        jsCoverPage.executeJavaScript("jscoverage_recalculateSummaryTab();");
        webClient.waitForBackgroundJavaScript(500);
        verifyTotal(webClient, jsCoverPage, 73, branchPercentage2, functionPercentage2);
    }

    @Test
    public void shouldIncreaseCoverage() throws Exception {
        int[] branchPercentages = new int[]{0, 0, 0, 0};
        int[] functionPercentages = new int[]{0, 0, 0, 0};
        testIncreaseCoverage(branchPercentages, functionPercentages);
    }

    protected void testIncreaseCoverage(int[] branchPercentages, int[] functionPercentages) throws IOException {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?" + getTestUrl());

        verifyTotal(webClient, page, 15);

        page.getHtmlElementById("browserTab").click();
        HtmlPage frame = (HtmlPage)page.getFrameByName("browserIframe").getEnclosedPage();
        frame.getHtmlElementById("radio1").click();
        page.executeJavaScript("jscoverage_recalculateSummaryTab();");
        verifyTotals(page, 57, branchPercentages[0], functionPercentages[0]);
        frame.getHtmlElementById("radio2").click();
        page.executeJavaScript("jscoverage_recalculateSummaryTab();");
        verifyTotals(page, 73, branchPercentages[1], functionPercentages[1]);
        frame.getHtmlElementById("radio3").click();
        page.executeJavaScript("jscoverage_recalculateSummaryTab();");
        verifyTotals(page, 84, branchPercentages[2], functionPercentages[2]);
        frame.getHtmlElementById("radio4").click();
        page.executeJavaScript("jscoverage_recalculateSummaryTab();");
        verifyTotals(page, 100, branchPercentages[3], functionPercentages[3]);
    }

    @Test
    public void shouldWorkWithPost() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:9001/example/post.html");
        ((HtmlInput)page.getHtmlElementById("inputName")).setValue("POST data!!!");
        page = page.getHtmlElementById("submitButton").click();

        String data = page.getHtmlElementById("postData").getTextContent();
        assertThat(data, equalTo("inputName=POST+data%21%21%21"));
    }

    @Test
    public void shouldWorkWithFileNoBOMUpload() throws Exception {
        testFileUpload("data/test-utf-no-bom.txt");
    }

    @Test
    public void shouldWorkWithFileBOMUpload() throws Exception {
        testFileUpload("data/test-utf-bom.txt");
    }

    @Test
    public void shouldWorkWithLargeUpload() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:9001/example/upload.html");
        ((HtmlInput)page.getHtmlElementById("uploader")).setValue("lib/runtime/js.jar");
        page = page.getHtmlElementById("submitButton").click();

        String data = page.getHtmlElementById("postData").getTextContent();
        assertThat(data, containsString("js.jar"));
    }

    private void testFileUpload(String postFile) throws IOException {
        HtmlPage page = webClient.getPage("http://localhost:9001/example/upload.html");
        ((HtmlInput)page.getHtmlElementById("uploader")).setValue(postFile);
        page = page.getHtmlElementById("submitButton").click();

        String data = page.getHtmlElementById("postData").getTextContent();
        assertThat(data, containsString("Line 1\nLine 2"));
    }

    protected void verifyTotal(WebClient webClient, HtmlPage page, int percentage) throws IOException {
        verifyTotal(webClient, page, percentage, 0, 0);
    }

    protected void verifyTotal(WebClient webClient, HtmlPage page, int percentage, int branchPercentage, int functionPercentage) throws IOException {
        page.getHtmlElementById("summaryTab").click();
        webClient.waitForBackgroundJavaScript(2000);
        verifyTotals(page, percentage, branchPercentage, functionPercentage);
    }

    protected void verifyTotals(HtmlPage page, int percentage, int branchPercentage, int functionPercentage) {
        assertEquals(percentage + "%", page.getElementById("summaryTotal").getTextContent());
        assertEquals(branchPercentage + "%", page.getElementById("branchSummaryTotal").getTextContent());
        assertEquals(functionPercentage + "%", page.getElementById("functionSummaryTotal").getTextContent());
    }
}
