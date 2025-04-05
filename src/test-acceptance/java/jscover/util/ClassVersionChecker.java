package jscover.util;

import org.junit.Test;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

public class ClassVersionChecker {
    @Test
    public void testClasses() throws IOException {
        File zipFile = new File("target/dist/JSCover-all.jar");
        ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile));
        ZipEntry ze;
        while ((ze = zis.getNextEntry()) != null) {
            String fileName = ze.getName();
            if (!fileName.startsWith("jscover/") || !fileName.endsWith(".class"))
                continue;
            checkClassVersion2(new File(new File("target/tmp"), fileName));
        }
        zis.closeEntry();
        zis.close();
    }

    private static void checkClassVersion2(File file) throws IOException {
        byte[] buffer = new byte[8];

        FileInputStream in = new FileInputStream(file);
        in.read(buffer, 0, 8);
        in.close();

        int majorVersion = buffer[6] << 8 | buffer[7];
        //int minorVersion = buffer[4] << 8 | buffer[5];
        assertThat(file + " is not a 1.8 class! Major version " + majorVersion, majorVersion, equalTo(65));
    }
}
