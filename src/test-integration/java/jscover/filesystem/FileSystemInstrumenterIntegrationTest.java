package jscover.filesystem;

import jscover.ConfigurationCommon;
import jscover.report.FileData;
import jscover.report.JSONDataMerger;
import jscover.util.IoUtils;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.util.Properties;
import java.util.SortedMap;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

public class FileSystemInstrumenterIntegrationTest {
    private FileSystemInstrumenter fileSystemInstrumenter = new FileSystemInstrumenter();
    private ConfigurationForFS configurationForFS = new ConfigurationForFS();
    private IoUtils ioUtils = IoUtils.getInstance();
    private JSONDataMerger jsonMerger = new JSONDataMerger();
    private File srcDir = new File("src/test-integration/resources/jsSearch");
    private File destDir = new File("target/fs-test");

    @Before
    public void setUp() {
        Properties properties = new Properties();
        properties.put("version", "test");
        configurationForFS.setProperties(properties);
        File jsCoverJSON = new File(destDir, "jscoverage.json");
        if (jsCoverJSON.exists())
            jsCoverJSON.delete();
    }

    @Test
    public void shouldGenerateEmptyCoverageDataFile() {
        configurationForFS.setSrcDir(srcDir);
        configurationForFS.setDestDir(destDir);
        configurationForFS.setIncludeUnloadedJS(true);
        fileSystemInstrumenter.run(configurationForFS);

        String json = ioUtils.loadFromFileSystem(new File(destDir, "jscoverage.json"));
        SortedMap<String, FileData> map = jsonMerger.jsonToMap(json);

        assertThat(map.keySet().size(), equalTo(6));
        assertThat(map.containsKey("/root.js"), is(true));
        assertThat(map.containsKey("/root-empty.js"), is(true));
        assertThat(map.containsKey("/level1/level1.js"), is(true));
        assertThat(map.containsKey("/level1/level2/level2-empty.js"), is(true));
        assertThat(map.containsKey("/level1/level2/level2.js"), is(true));
        assertThat(map.containsKey("/noInstrument/noInstrument.js"), is(true));

        FileData fileData = map.get("/level1/level1.js");
        assertThat(fileData.getLines().size(), equalTo(5));
        assertThat(fileData.getLines().get(0), nullValue());
        assertThat(fileData.getLines().get(1), equalTo(0));
        assertThat(fileData.getLines().get(2), equalTo(0));
        assertThat(fileData.getLines().get(3), equalTo(0));
        assertThat(fileData.getLines().get(4), equalTo(0));
    }

    @Test
    public void shouldGenerateEmptyCoverageDataFileWithExclusions() {
        configurationForFS.setSrcDir(srcDir);
        configurationForFS.setDestDir(destDir);
        configurationForFS.setIncludeUnloadedJS(true);
        configurationForFS.addNoInstrument(ConfigurationCommon.NO_INSTRUMENT_PREFIX + "/noInstrument");
        configurationForFS.addExclude(ConfigurationForFS.EXLCUDE_PREFIX + "/level1/level2");
        fileSystemInstrumenter.run(configurationForFS);

        String json = ioUtils.loadFromFileSystem(new File(destDir, "jscoverage.json"));
        SortedMap<String, FileData> map = jsonMerger.jsonToMap(json);

        assertThat(map.keySet().size(), equalTo(3));
        assertThat(map.containsKey("/root.js"), is(true));
        assertThat(map.containsKey("/root-empty.js"), is(true));
        assertThat(map.containsKey("/level1/level1.js"), is(true));
        assertThat(map.containsKey("/level1/level2/level2-empty.js"), is(false));
        assertThat(map.containsKey("/level1/level2/level2.js"), is(false));
        assertThat(map.containsKey("/noInstrument/noInstrument.js"), is(false));

        FileData fileData = map.get("/level1/level1.js");
        assertThat(fileData.getLines().size(), equalTo(5));
        assertThat(fileData.getLines().get(0), nullValue());
        assertThat(fileData.getLines().get(1), equalTo(0));
        assertThat(fileData.getLines().get(2), equalTo(0));
        assertThat(fileData.getLines().get(3), equalTo(0));
        assertThat(fileData.getLines().get(4), equalTo(0));
    }
}
