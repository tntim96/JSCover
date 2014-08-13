package jscover.server;

import static java.util.logging.Level.FINE;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.Socket;
import java.nio.charset.Charset;
import java.util.logging.Logger;

import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpException;
import org.apache.http.HttpRequest;
import org.apache.http.HttpServerConnection;
import org.apache.http.HttpStatus;
import org.apache.http.HttpVersion;
import org.apache.http.entity.BasicHttpEntity;
import org.apache.http.impl.DefaultBHttpServerConnection;
import org.apache.http.message.BasicHttpResponse;
import org.apache.http.util.EntityUtils;

/**
 * This is a server that always server the same static content and 
 * attempts use persistent connections.  The connection will remain 
 * open unless closed by the other side.
 */
public class PersistentStaticHttpServer implements Runnable {
    private static final Logger logger = Logger.getLogger(PersistentStaticHttpServer.class.getName());
    
    protected final Socket socket;
    protected String content;
    /** To force the connection to be persistent regardless of headers. */
    protected boolean forceKeepAlive;
    
    public PersistentStaticHttpServer(Socket socket) {
        this(socket, "Some content", false);
    }
    
    public PersistentStaticHttpServer(Socket socket, String content, boolean forceKeepAlive) {
        if( socket == null ) throw new NullPointerException("socket is null");
        this.socket = socket;
        this.content = content;
        this.forceKeepAlive = forceKeepAlive;
    }
    
    public void run() {
        DefaultBHttpServerConnection conn = new DefaultBHttpServerConnection(8 * 1024);
        try {
            conn.bind(socket);
            try {
                boolean keepAlive = true;
                while( keepAlive && !socket.isClosed() ) {
                    // fully read the request, whatever it is
                    HttpRequest request = conn.receiveRequestHeader();
                    logger.log(FINE, "Received request: {0}", request);
                    keepAlive = forceKeepAlive || isKeepAlive(request);
                    
                    if (request instanceof HttpEntityEnclosingRequest) {
                        conn.receiveRequestEntity((HttpEntityEnclosingRequest) request);
                        HttpEntity entity = ((HttpEntityEnclosingRequest) request)
                                .getEntity();
                        if (entity != null) {
                            // consume all content to allow reuse
                            EntityUtils.consume(entity);
                        }
                    }
                    
                    // send static content or reject the method
                    String method = request.getRequestLine().getMethod();
                    if( method.matches("(?i)get|post|put") )
                        sendOkContent(conn);
                    else
                        rejectMethod(conn);
                }
            } finally {
                IOUtils.closeQuietly(conn);
                IOUtils.closeQuietly(socket);
            }
        } catch( HttpException e ) {
            e.printStackTrace();
            IOUtils.closeQuietly(socket);
        } catch (IOException e ) {
            e.printStackTrace();
            IOUtils.closeQuietly(socket);
        }
    }
    
    protected boolean isKeepAlive(HttpRequest request) {
        for (Header header: request.getAllHeaders()) {
            String name = header.getName().toLowerCase();
            if ("connection".equals(name) || "proxy-connection".equals(name)) {
                String value = header.getValue();
                if ("keep-alive".equalsIgnoreCase(value))
                    return true;
            }
        }
        return false;
    }
    
    protected void sendOkContent(HttpServerConnection conn) throws IOException, HttpException {
        // send a 200 OK with the static content
        BasicHttpResponse response = new BasicHttpResponse(HttpVersion.HTTP_1_1,
                HttpStatus.SC_OK, "OK") ;
        BasicHttpEntity entity = new BasicHttpEntity();
        byte[] message = content.getBytes(Charset.forName("UTF-8"));
        entity.setContent(new ByteArrayInputStream(message));
        entity.setContentLength(message.length);
        response.setEntity(entity);
        
        // force Content-Length header so the client doesn't expect us to close the connection to end the response
        response.addHeader("Content-Length", String.valueOf(message.length));
        
        conn.sendResponseHeader(response);
        conn.sendResponseEntity(response);
        conn.flush();
        logger.log(FINE, "Sent 200 OK");
    }
    
    protected void rejectMethod(HttpServerConnection conn) throws IOException, HttpException {
        BasicHttpResponse response = new BasicHttpResponse(HttpVersion.HTTP_1_1, 
                HttpStatus.SC_METHOD_NOT_ALLOWED, "Must be GET, POST or PUT");
        conn.sendResponseHeader(response);
        conn.flush();
        logger.log(FINE, "Sent 405 Method Not Allowed");
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Socket getSocket() {
        return socket;
    }
    
    public void setForceKeepAlive(boolean forceKeepAlive) {
        this.forceKeepAlive = forceKeepAlive;
    }
    
    public boolean isForceKeepAlive() {
        return forceKeepAlive;
    }
}
