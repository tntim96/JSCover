package jscover.server;

import jscover.format.PlainFormatter;
import jscover.format.SourceFormatter;
import jscover.instrument.FileInstrumenter;
import org.apache.commons.io.IOUtils;
import jscover.util.IoUtils;

import java.io.*;
import java.util.Properties;


public class WebServer extends NanoHTTPD {
    private static SourceFormatter sourceFormatter = new PlainFormatter();
    private Configuration configuration;
    private File log;

    public static void main(String[] args) {
        Configuration configuration = Configuration.parse(args);
        if (configuration.showHelp()) {
            System.out.println(configuration.getHelpText());
            System.exit(0);
        } else if (configuration.printVersion()) {
            System.out.println(configuration.getVersionText());
            System.exit(0);
        }

        try {
            File wwwroot = configuration.getDocumentRoot();
            WebServer ws = new WebServer(configuration);
            myOut.println("Now serving files in port " + configuration.getPort() + " from \"" + wwwroot + "\"");

            synchronized (ws) {
                ws.wait();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public WebServer(Configuration configuration) throws IOException {
        super(configuration.getPort(), configuration.getDocumentRoot());
        this.configuration = configuration;
        this.log = new File(configuration.getReportDir(), "errors.log");
        if (this.log.exists()) {
            this.log.delete();
        }
    }

    public Response serve(String uri, String method, Properties header, Properties parms, Properties files, String data) {
        try {
            if (uri.equals("/stop")) {
                synchronized (this) {
                    this.notifyAll();
                }
                return new NanoHTTPD.Response(HTTP_OK, MIME_PLAINTEXT, "Shutting down server.");
            } else if (uri.startsWith("/jscoverage.js")) {
                String serverJS = "jscoverage_isServer = true;";
                return new NanoHTTPD.Response(HTTP_OK, getMime(uri), IoUtils.loadFromClassPath(uri)+serverJS);
            } else if (uri.startsWith("/jscoverage-store")) {
                IOUtils.copy(new StringReader(data), new FileOutputStream(new File(configuration.getReportDir(),"jscoverage.json")));
                copyResourceToDir("jscoverage.css", configuration.getReportDir());
                copyResourceToDir("jscoverage.html", configuration.getReportDir());

                String reportJS = IoUtils.loadFromClassPath("/jscoverage.js") + "\njscoverage_isReport = true;";
                IOUtils.copy(new StringReader(reportJS), new FileOutputStream(new File(configuration.getReportDir(),"jscoverage.js")));

                copyResourceToDir("jscoverage-highlight.css", configuration.getReportDir());
                copyResourceToDir("jscoverage-ie.css", configuration.getReportDir());
                copyResourceToDir("jscoverage-throbber.gif",configuration.getReportDir());
                return new NanoHTTPD.Response(HTTP_OK, HTTP_OK, "Report stored at "+configuration.getReportDir());
            } else if (uri.startsWith("/jscoverage")) {
                return new NanoHTTPD.Response(HTTP_OK, getMime(uri), getClass().getResourceAsStream(uri));
            } else if (uri.endsWith(".js") && !configuration.skipInstrumentation(uri)) {
                FileInstrumenter fileInstrumenter = new FileInstrumenter(uri, sourceFormatter, log);
                String source = IoUtils.toString(new FileInputStream(myRootDir + uri));
                String jsInstrumented = fileInstrumenter.instrumentFile(source);
                return new NanoHTTPD.Response(HTTP_OK, "text/javascript", jsInstrumented);
            } else {
                return super.serve(uri, method, header, parms, files, data);
            }
        } catch (Throwable e) {
            StringWriter stringWriter = new StringWriter();
            e.printStackTrace(new PrintWriter(stringWriter));
            return new NanoHTTPD.Response(HTTP_INTERNALERROR, MIME_PLAINTEXT, stringWriter.toString());
        }
    }

    private void copyResourceToDir(String resource, File parent) throws Exception {
        IOUtils.copy(getClass().getResourceAsStream("/"+resource), new FileOutputStream(new File(parent,resource)));
    }

    private String getMime(String uri) {
        String extension = null;
        int dot = uri.lastIndexOf('.');
        //Get everything after the dot
        if (dot >= 0)
            extension = uri.substring(dot + 1).toLowerCase();

        String mime = (String) theMimeTypes.get(extension);
        if (mime == null)
            mime = MIME_DEFAULT_BINARY;
        return mime;
    }
}
