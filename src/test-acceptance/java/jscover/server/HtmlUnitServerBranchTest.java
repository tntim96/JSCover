package jscover.server;

import com.gargoylesoftware.htmlunit.AlertHandler;
import com.gargoylesoftware.htmlunit.Page;
import com.gargoylesoftware.htmlunit.html.*;
import jscover.Main;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.equalTo;
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

    @Test
    @Override
    public void shouldDisplayCoverageInformationOnSourcePage() throws IOException {
        HtmlPage page = webClient.getPage("http://localhost:9001/jscoverage.html?" + getTestUrl());
        HtmlPage frame = (HtmlPage)page.getFrameByName("browserIframe").getEnclosedPage();

        verifyTotal(webClient, page, 6);

        page.getAnchorByText("/example/script.js").click();
        webClient.waitForBackgroundJavaScript(2000);
        HtmlTable sourceTable = (HtmlTable)page.getElementById("sourceTable");
        verifySource(sourceTable, 5, 0, "else if (element.id === 'radio2') {", "Condition never evaluated         :\telement.id === 'radio2'", "r");
        verifySource(sourceTable, 6, 0, "message = 'You selected the number 2.';", null, "");

        frame.getHtmlElementById("radio2").click();
        webClient.waitForBackgroundJavaScript(500);
        verifyTotal(webClient, page, 66, 25);

        page.getAnchorByText("/example/script.js").click();
        webClient.waitForBackgroundJavaScript(2000);
        sourceTable = (HtmlTable)page.getElementById("sourceTable");
        verifySource(sourceTable, 5, 1, "else if (element.id === 'radio2') {", "Condition never evaluated to false:\telement.id === 'radio2'", "r");
        verifySource(sourceTable, 6, 1, "message = 'You selected the number 2.';", null, "");

        frame.getHtmlElementById("radio4").click();
        webClient.waitForBackgroundJavaScript(500);
        verifyTotal(webClient, page, 86, 62);

        page.getAnchorByText("/example/script.js").click();
        webClient.waitForBackgroundJavaScript(2000);
        sourceTable = (HtmlTable)page.getElementById("sourceTable");
        verifySource(sourceTable, 5, 2, "else if (element.id === 'radio2') {", null, "g");
        verifySource(sourceTable, 6, 1, "message = 'You selected the number 2.';", null, "");
    }

    private void verifySource(HtmlTable sourceTable, int row, int coverageCount, String source, String alertLine, String cssClass) throws IOException {
        assertThat(sourceTable.getRow(row).getCell(1).asText(), equalTo(""+coverageCount));
        assertThat(sourceTable.getRow(row).getCell(3).asText(), equalTo(source));

        HtmlTableCell branchCell = sourceTable.getRow(row).getCell(2);
        if (alertLine == null) {
            assertThat(branchCell.asText(), equalTo(" "));
            assertThat(branchCell.getAttribute("class"), equalTo("numeric "+cssClass));
        } else {
            assertThat(branchCell.asText(), equalTo("info"));
            HtmlAnchor anchor = (HtmlAnchor) branchCell.getFirstChild().getFirstChild();

            final String alert[] = new String[1];
            webClient.setAlertHandler(new AlertHandler() {
                public void handleAlert(Page page, String message) {
                    alert[0] = message;
                }
            });

            anchor.click();
            assertThat(alert[0], containsString(alertLine));
        }
    }
}
