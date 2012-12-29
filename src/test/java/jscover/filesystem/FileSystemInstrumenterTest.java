package jscover.filesystem;

import jscover.instrument.InstrumenterService;
import jscover.util.IoService;
import jscover.util.IoUtils;
import jscover.util.ReflectionUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mozilla.javascript.CompilerEnvirons;

import java.io.File;
import java.io.FilenameFilter;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class FileSystemInstrumenterTest {
    private FileSystemInstrumenter fsi = new FileSystemInstrumenter();
    private @Mock IoService ioService;
    private @Mock InstrumenterService instrumenterService;
    private @Mock IoUtils ioUtils;
    private @Mock ConfigurationForFS configuration;
    private @Mock File log;
    private @Mock File src;
    private @Mock File dest;
    private @Mock File destParent;
    private @Mock CompilerEnvirons compilerEnvirons;
    private boolean includeBranch = true;
    private FilenameFilter acceptAll =  new FilenameFilter() {
        public boolean accept(File dir, String name) {
            return true;
        }
    };


    @Before
    public void setUp() {
        ReflectionUtils.setField(fsi, "ioService", ioService);
        ReflectionUtils.setField(fsi, "instrumenterService", instrumenterService);
        ReflectionUtils.setField(fsi, "ioUtils", ioUtils);
        ReflectionUtils.setField(fsi, "configuration", configuration);
        ReflectionUtils.setField(fsi, "log", log);

        given(dest.getParentFile()).willReturn(destParent);

        given(configuration.getCompilerEnvirons()).willReturn(compilerEnvirons);
        given(configuration.getCompilerEnvirons()).willReturn(compilerEnvirons);
    }

    @Test
    public void shouldInstrumentJSFile() {
        String path = "somePath.js";
        given(ioUtils.getRelativePath(any(File.class), any(File.class))).willReturn(path);
        given(configuration.exclude(path)).willReturn(false);
        given(src.isDirectory()).willReturn(false);
        given(src.toString()).willReturn(path);
        given(configuration.skipInstrumentation(path)).willReturn(false);

        fsi.copyFolder(src, dest);

        verify(instrumenterService).instrumentJSForFileSystem(compilerEnvirons, src, dest, path, configuration.isIncludeBranch());
        verify(destParent).mkdirs();
    }

    @Test
    public void shouldNotMakeSubDirectoriesIfExist() {
        String path = "somePath.js";
        given(ioUtils.getRelativePath(any(File.class), any(File.class))).willReturn(path);
        given(configuration.exclude(path)).willReturn(false);
        given(src.isDirectory()).willReturn(false);
        given(src.toString()).willReturn(path);
        given(configuration.skipInstrumentation(path)).willReturn(false);
        given(destParent.exists()).willReturn(true);

        fsi.copyFolder(src, dest);

        verify(instrumenterService).instrumentJSForFileSystem(compilerEnvirons, src, dest, path, configuration.isIncludeBranch());
        verify(destParent, times(0)).mkdirs();
    }

    @Test
    public void shouldNotInstrumentNonJSFile() {
        String path = "somePath.html";
        given(ioUtils.getRelativePath(any(File.class), any(File.class))).willReturn(path);
        given(configuration.exclude(path)).willReturn(false);
        given(src.isDirectory()).willReturn(false);
        given(src.toString()).willReturn(path);
        given(configuration.skipInstrumentation(path)).willReturn(false);

        fsi.copyFolder(src, dest);

        verifyZeroInteractions(instrumenterService);
    }

    @Test
    public void shouldNotInstrumentSkippedJSFile() {
        String path = "somePath.js";
        given(ioUtils.getRelativePath(any(File.class), any(File.class))).willReturn(path);
        given(configuration.exclude(path)).willReturn(false);
        given(src.isDirectory()).willReturn(false);
        given(src.toString()).willReturn(path);
        given(configuration.skipInstrumentation(path)).willReturn(true);

        fsi.copyFolder(src, dest);

        verifyZeroInteractions(instrumenterService);
    }

    @Test
    public void shouldNotInstrumentJSFileIfCopyingReport() {
        String path = "somePath.js";
        given(ioUtils.getRelativePath(any(File.class), any(File.class))).willReturn(path);
        given(configuration.exclude(path)).willReturn(false);
        given(src.isDirectory()).willReturn(false);
        given(src.toString()).willReturn(path);
        given(configuration.skipInstrumentation(path)).willReturn(false);

        fsi.copyFolder(src, dest, acceptAll, true);

        verifyZeroInteractions(instrumenterService);
        verify(ioUtils).copy(src, dest);
    }

    @Test
    public void shouldNotCopyNonInstrumentedJSFileIfCopyingReport() {
        String path = "somePath.js";
        given(ioUtils.getRelativePath(any(File.class), any(File.class))).willReturn(path);
        given(configuration.exclude(path)).willReturn(false);
        given(src.isDirectory()).willReturn(false);
        given(src.toString()).willReturn(path);
        given(configuration.skipInstrumentation(path)).willReturn(true);

        fsi.copyFolder(src, dest, acceptAll, true);

        verifyZeroInteractions(instrumenterService);
        verify(ioUtils, times(0)).copy(src, dest);
    }
}
