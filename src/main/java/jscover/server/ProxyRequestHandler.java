package jscover.server;

import jscover.util.IoUtils;

import java.io.*;
import java.net.Socket;
import java.net.URL;
import java.util.List;
import java.util.Map;

import static java.lang.String.format;

public class ProxyRequestHandler extends HttpServer {

    public ProxyRequestHandler(Socket socket, File wwwRoot) {
        super(socket, wwwRoot);
    }

    protected void handleProxyGet(HttpRequest request) {
        URL url = request.getUrl();
        Socket socket = null;
        InputStream remoteInputStream = null;
        OutputStream remoteOutputStream = null;
        try {
            int port = url.getPort();
            socket = new Socket(url.getHost(), port == -1 ? 80 : port);
            remoteInputStream = socket.getInputStream();
            remoteOutputStream = socket.getOutputStream();
            PrintWriter remotePrintWriter = new PrintWriter(remoteOutputStream);

            String uri = url.getPath();
            if (url.getQuery()!= null && url.getQuery().length()!=0) {
                uri += "?"+url.getQuery();
            }
            remotePrintWriter.print("GET "+uri+" HTTP/1.0\n");
            sendHeaders(request, remotePrintWriter);
            IoUtils.copyNoClose(remoteInputStream, os);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            IoUtils.closeQuietly(remoteOutputStream);
            IoUtils.closeQuietly(remoteInputStream);
        }
    }

    protected void handleProxyPost(HttpRequest request, String data) {
        URL url = request.getUrl();
        Socket socket = null;
        InputStream remoteInputStream = null;
        OutputStream remoteOutputStream = null;
        try {
            int port = url.getPort();
            socket = new Socket(url.getHost(), port == -1 ? 80 : port);
            remoteInputStream = socket.getInputStream();
            remoteOutputStream = socket.getOutputStream();
            PrintWriter remotePrintWriter = new PrintWriter(remoteOutputStream);

            String uri = url.getPath();
            if (url.getQuery()!= null && url.getQuery().length()!=0) {
                uri += "?"+url.getQuery();
            }
            remotePrintWriter.print("POST "+uri+" HTTP/1.0\n");
            sendHeaders(request, remotePrintWriter);
            IoUtils.copyNoClose(new ByteArrayInputStream(data.getBytes()), remoteOutputStream);
            IoUtils.copyNoClose(remoteInputStream, os);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            IoUtils.closeQuietly(remoteOutputStream);
            IoUtils.closeQuietly(remoteInputStream);
        }
    }

    private void sendHeaders(HttpRequest request, PrintWriter remotePrintWriter) {
        Map<String, List<String>> clientHeaders = request.getHeaders();
        for (String header : clientHeaders.keySet()) {
            List<String> values = clientHeaders.get(header);
            for (String value : values) {
                remotePrintWriter.print(format("%s: %s\n",header, value));
            }
        }
        remotePrintWriter.print("\n");
        remotePrintWriter.flush();
    }
}
