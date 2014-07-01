package jscover;

import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;

public class MainHelperTest {
    private MainHelper mainHelper = new MainHelper();

    @Test
    public void shouldDetectMissingJARs() throws IOException {
        List<String> dependantClasses = new ArrayList<String>() {{
            add("this.shouldn't.Exist");
        }};
        try {
            mainHelper.checkDependantClasses(dependantClasses, "MANIFEST-TEST.MF");
            fail("Should have thrown exception");
        } catch(IllegalStateException e) {
            String message = e.getMessage();
            assertThat(message, containsString("Ensure these JARs are in the same directory as JSCover.jar:"));
            assertThat(message, containsString("js.jar"));
        }
    }

    @Test
    public void shouldDetectMissingClassPath() throws IOException {
        ArrayList<String> dependantClasses = new ArrayList<String>() {{
            add("this.shouldn't.Exist");
        }};
        try {
            mainHelper.checkDependantClasses(dependantClasses, "MANIFEST-NO-CLASS-PATH.MF");
            fail("Should have thrown exception");
        } catch(IllegalStateException e) {
            String message = e.getMessage();
            assertThat(message, equalTo("Could not find the 'Class-Path' attribute in the manifest 'MANIFEST-NO-CLASS-PATH.MF'"));
        }
    }

}