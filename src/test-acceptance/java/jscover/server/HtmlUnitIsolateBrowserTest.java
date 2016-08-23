package jscover.server;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebWindow;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import jscover.Main;
import jscover.util.IoService;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.File;
import java.io.IOException;

import static org.junit.Assert.assertEquals;

public class HtmlUnitIsolateBrowserTest {
    private static Thread server;
    private static Main main = new Main();
    private static String reportDir = "target/isolateBrowser";

    protected WebClient webClient = new WebClient(BrowserVersion.FIREFOX_45);
    private IoService ioService = new IoService(false);
    private static String[] args = new String[]{
            "-ws",
            "--document-root=src/test-acceptance/resources",
            "--port=9001",
            "--no-instrument=example/lib",
            "--isolate-browser",
            "--report-dir=" + reportDir
    };

    protected String getReportDir() {
        return reportDir;
    }

    @BeforeClass
    public static void setUpOnce() throws IOException {
        server = new Thread(new Runnable() {
            public void run() {
                main.runMain(args);
            }
        });
        server.start();
    }

    @AfterClass
    public static void tearDown() {
        main.stop();
    }

    @Before
    public void setUp() {
        File jsonFile = new File(getReportDir() + "/jscoverage.json");
        if (jsonFile.exists())
            jsonFile.delete();
        ioService.generateJSCoverFilesForWebServer(new File(reportDir), "isolateBrowser");
    }

    protected String getTestUrl() {
        return "example/index.html";
    }

    @Test
    public void shouldNotCombineCoverage() throws IOException, InterruptedException {
        HtmlPage page = webClient.getPage("http://localhost:9001/" + getTestUrl());
        page.getElementById("radio4").click();

        page.getHtmlElementById("launchDuplicate").click();
        webClient.waitForBackgroundJavaScript(100);
        WebWindow webWindow = webClient.getWebWindowByName("JSCoverInvertedModeDuplicateWindow");
        HtmlPage duplicatePage = (HtmlPage)webWindow.getEnclosedPage();
        duplicatePage.getElementById("radio1").click();
        duplicatePage.executeJavaScript("jscoverage_report();");
        webClient.waitForBackgroundJavaScript(2000);
        page = webClient.getPage("file:///"+ new File(getReportDir()+"/jscoverage.html").getAbsolutePath());
        verifyTotal(page, 57, 12, 33);
    }

    protected void verifyTotal(HtmlPage page, int percentage, int branchPercentage, int functionPercentage) throws IOException {
        page = page.getElementById("summaryTab").click();
        webClient.waitForBackgroundJavaScript(2000);
        verifyTotals(page, percentage, branchPercentage, functionPercentage);
    }

    protected void verifyTotals(HtmlPage page, int percentage, int branchPercentage, int functionPercentage) {
        assertEquals(percentage + "%", page.getElementById("summaryTotal").getTextContent());
        assertEquals(branchPercentage + "%", page.getElementById("branchSummaryTotal").getTextContent());
        assertEquals(functionPercentage + "%", page.getElementById("functionSummaryTotal").getTextContent());
    }
}
