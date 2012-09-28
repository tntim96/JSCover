package jscover.server;

import jscover.util.IoUtils;
import org.mozilla.javascript.Context;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;
import java.util.jar.Attributes;
import java.util.jar.Manifest;

import static java.lang.String.format;

public class Configuration {
    public static final String HELP_PREFIX1 = "-h";
    public static final String HELP_PREFIX2 = "--help";
    public static final String VERSION_PREFIX1 = "-V";
    public static final String VERSION_PREFIX2 = "--version";
    public static final String DOC_ROOT_PREFIX = "--document-root=";
    public static final String PORT_PREFIX = "--port=";
    public static final String REPORT_DIR_PREFIX = "--report-dir=";
    public static final String NO_INSTRUMENT_PREFIX = "--no-instrument=";
    public static final String JS_VERSION_PREFIX = "--js-version=";

    public static final Properties properties = new Properties();

    static {
        try {
            properties.load(Configuration.class.getResourceAsStream("configuration.properties"));
        } catch (Exception e) {
            e.printStackTrace(System.err);
            System.exit(1);
        }
        try {
            Class.forName("org.apache.commons.lang.ClassUtils");
            Class.forName("org.apache.commons.io.IOUtils");
            Class.forName("org.mozilla.javascript.ast.AstNode");
        } catch (Exception e) {
            e.printStackTrace(System.err);
            try {
                Manifest mf = new Manifest(Configuration.class.getResourceAsStream("/META-INF/MANIFEST.MF"));
                Attributes mainAttributes = mf.getMainAttributes();
                String name = mainAttributes.get(Attributes.Name.IMPLEMENTATION_TITLE).toString();
                String classPathJARs = mainAttributes.get(Attributes.Name.CLASS_PATH).toString();
                String message = "%nEnsure these JARs are in the same directory as %s.jar:%n%s";
                System.err.println(format(message, name , classPathJARs));
            } catch (IOException error) {
                error.printStackTrace(System.err);
            }
            System.exit(1);
        }
    }

    private boolean showHelp;
    private boolean printVersion;
    private File documentRoot = new File(System.getProperty("user.dir"));
    private Integer port = 8080;
    private final Set<String> noInstruments = new HashSet<String>();
    private File reportDir = new File(System.getProperty("user.dir"));
    private int JSVersion = Context.VERSION_1_8;

    public Boolean showHelp() {
        return showHelp;
    }

    public boolean printVersion() {
        return printVersion;
    }

    public File getDocumentRoot() {
        return documentRoot;
    }

    public Integer getPort() {
        return port;
    }

    public File getReportDir() {
        return reportDir;
    }

    public boolean skipInstrumentation(String uri) {
        for (String noInstrument : noInstruments) {
            if (uri.startsWith(noInstrument))
                return true;
        }
        return false;
    }

/*

-h, --help
    Display a brief help message.
-V, --version
    Display the version of the program.
-v, --verbose
    Explain what is being done.
--document-root=PATH
    Serve web content from the directory given by PATH. The default is the current directory. This option may not be given with the --proxy option.
--encoding=ENCODING
    Assume that all JavaScript files use the given character encoding. The default is ISO-8859-1. Note that if you use the --proxy option, the character encoding will be determined from the charset parameter in the Content-Type HTTP header.
--ip-address=ADDRESS
    Run the server on the IP address given by ADDRESS. The default is 127.0.0.1. Specify 0.0.0.0 to use any address.
--js-version=VERSION
    Use the specified JavaScript version; valid values for VERSION are 1.0, 1.1, 1.2, ..., 1.8, or ECMAv3 (the default).
--mozilla
    Specify that the source directory contains an application based on the Mozilla platform (see below).
--no-highlight
    Do not perform syntax highlighting of JavaScript code.
--no-instrument=URL
    Do not instrument JavaScript code from URL. If you are running jscoverage-server with the --proxy option, URL should be a full URL. For example:

    jscoverage-server --proxy --no-instrument=http://example.com/scripts/

    Without --proxy, URL should be only the path portion of a URL:

    jscoverage-server --no-instrument=/scripts/

    This option may be given multiple times.
--port=PORT
    Run the server on the port given by PORT. The default is port 8080.
--proxy
    Run as a proxy server.
--report-dir=PATH
    Use the directory given by PATH for storing coverage reports. The default is jscoverage-report/ in the current directory.
--shutdown
    Stop a running instance of the server.
 */

    public static Configuration parse(String[] args) {
        Configuration configuration = new Configuration();
        for (String arg : args) {
            if (arg.equals(HELP_PREFIX1) || arg.equals(HELP_PREFIX2)) {
                configuration.showHelp = true;
            } else if (arg.equals(VERSION_PREFIX1) || arg.equals(VERSION_PREFIX2)) {
                configuration.printVersion = true;
            } else if (arg.startsWith(DOC_ROOT_PREFIX)) {
                configuration.documentRoot = new File(arg.substring(DOC_ROOT_PREFIX.length()));
            } else if (arg.startsWith(PORT_PREFIX)) {
                configuration.port = Integer.valueOf(arg.substring(PORT_PREFIX.length()));
            } else if (arg.startsWith(REPORT_DIR_PREFIX)) {
                configuration.reportDir = new File(arg.substring(REPORT_DIR_PREFIX.length()));
                configuration.reportDir.mkdirs();
            } else if (arg.startsWith(NO_INSTRUMENT_PREFIX)) {
                configuration.noInstruments.add(arg.substring(NO_INSTRUMENT_PREFIX.length()));
            } else if (arg.startsWith(JS_VERSION_PREFIX)) {
                configuration.JSVersion = Integer.valueOf(arg.substring(JS_VERSION_PREFIX.length()));
            } else {
                configuration.showHelp = true;
            }
        }
        return configuration;
    }

    public String getHelpText() {
        return IoUtils.toString(Configuration.class.getResourceAsStream("help.txt"));
    }

    public String getVersionText() {
        return "JSCover version: " + properties.getProperty("version");
    }

    public int getJSVersion() {
        return JSVersion;
    }
}
