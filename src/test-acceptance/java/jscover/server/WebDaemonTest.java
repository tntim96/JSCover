package jscover.server;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import jscover.Main;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertThat;

public class WebDaemonTest {
    private Thread server;
    private Main main = new Main();

    protected WebClient webClient = new WebClient();
    private String[] args = new String[]{
            "-ws",
            "--port=8081"
    };

    @Before
    public void setUp() throws IOException {
        server = new Thread(new Runnable() {
            public void run() {
                main.runMain(args);
            }
        });
        server.start();
    }

    @Test
    public void shouldStopDaemon() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:8081/jscoverage.html");
        assertThat(page.getTitleText(), equalTo("JSCover"));
        main.stop();
        server.join(1000);
        assertThat(server.getState(), equalTo(Thread.State.TERMINATED));
    }
}