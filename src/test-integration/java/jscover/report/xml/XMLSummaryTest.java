package jscover.report.xml;

import jscover.report.Coverable;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.StringContains.containsString;
import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class XMLSummaryTest {
    private XMLSummary xmlSummary = new XMLSummary();
    @Mock Coverable data;

    @Test
    public void shouldGenerateSummaryXML() {
        given(data.getCodeLineCount()).willReturn(1);
        given(data.getCodeLinesCoveredCount()).willReturn(2);
        given(data.getLineCoverRate()).willReturn(.3d);
        given(data.getBranchCount()).willReturn(4);
        given(data.getBranchesCoveredCount()).willReturn(5);
        given(data.getBranchRate()).willReturn(.6d);

        String xml = xmlSummary.getSummary(data);
        assertThat(xml, containsString("line-rate=\"0.3\""));
        assertThat(xml, containsString("branch-rate=\"0.6\""));
        assertThat(xml, containsString("lines-covered=\"2\""));
        assertThat(xml, containsString("lines=\"1\""));
        assertThat(xml, containsString("branches-covered=\"5\""));
        assertThat(xml, containsString("branches=\"4\""));
    }
}
