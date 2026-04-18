package jscover.server;

import jscover.Main;
import org.htmlunit.WebClient;
import org.htmlunit.html.HtmlPage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class WebDaemonTest {
    private Thread server;
    private Main main = new Main();

    protected WebClient webClient = new WebClient();
    private String[] args = new String[]{
            "-ws",
            "--port=8081"
    };

    @BeforeEach
    public void setUp() throws InterruptedException {
        webClient.getOptions().setTimeout(1000);
        server = new Thread(() -> main.runMain(args));
        server.start();
        Thread.sleep(10);
    }

    @Test
    public void shouldStopDaemon() throws Exception {
        HtmlPage page = webClient.getPage("http://localhost:8081/jscoverage.html");
        assertThat(page.getTitleText()).isEqualTo("JSCover");
        main.stop();
        server.join(1000);
        assertThat(server.getState()).isEqualTo(Thread.State.TERMINATED);
    }
}