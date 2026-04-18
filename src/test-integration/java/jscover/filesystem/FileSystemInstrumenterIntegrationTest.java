package jscover.filesystem;

import jscover.ConfigurationCommon;
import jscover.report.FileData;
import jscover.report.JSONDataMerger;
import jscover.util.IoUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.util.Properties;
import java.util.SortedMap;

import static org.assertj.core.api.Assertions.assertThat;

public class FileSystemInstrumenterIntegrationTest {
    private FileSystemInstrumenter fileSystemInstrumenter = new FileSystemInstrumenter();
    private ConfigurationForFS configurationForFS = new ConfigurationForFS();
    private IoUtils ioUtils = IoUtils.getInstance();
    private JSONDataMerger jsonMerger = new JSONDataMerger();
    private File srcDir = new File("src/test-integration/resources/jsSearch");
    private File destDir = new File("target/fs-test");

    @BeforeEach
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

        assertThat(map.keySet().size()).isEqualTo(6);
        assertThat(map.containsKey("/root.js")).isTrue();
        assertThat(map.containsKey("/root-empty.js")).isTrue();
        assertThat(map.containsKey("/level1/level1.js")).isTrue();
        assertThat(map.containsKey("/level1/level2/level2-empty.js")).isTrue();
        assertThat(map.containsKey("/level1/level2/level2.js")).isTrue();
        assertThat(map.containsKey("/noInstrument/noInstrument.js")).isTrue();

        FileData fileData = map.get("/level1/level1.js");
        assertThat(fileData.getLines().size()).isEqualTo(5);
        assertThat(fileData.getLines().get(0)).isNull();
        assertThat(fileData.getLines().get(1)).isEqualTo(0);
        assertThat(fileData.getLines().get(2)).isEqualTo(0);
        assertThat(fileData.getLines().get(3)).isEqualTo(0);
        assertThat(fileData.getLines().get(4)).isEqualTo(0);
    }

    @Test
    public void shouldGenerateEmptyCoverageDataFileWithExclusions() {
        configurationForFS.setSrcDir(srcDir);
        configurationForFS.setDestDir(destDir);
        configurationForFS.setIncludeUnloadedJS(true);
        configurationForFS.addNoInstrument(ConfigurationCommon.NO_INSTRUMENT_PREFIX + "/noInstrument");
        configurationForFS.addExclude(ConfigurationForFS.EXCLUDE_PREFIX + "/level1/level2");
        fileSystemInstrumenter.run(configurationForFS);

        String json = ioUtils.loadFromFileSystem(new File(destDir, "jscoverage.json"));
        SortedMap<String, FileData> map = jsonMerger.jsonToMap(json);

        assertThat(map.keySet().size()).isEqualTo(3);
        assertThat(map.containsKey("/root.js")).isTrue();
        assertThat(map.containsKey("/root-empty.js")).isTrue();
        assertThat(map.containsKey("/level1/level1.js")).isTrue();
        assertThat(map.containsKey("/level1/level2/level2-empty.js")).isFalse();
        assertThat(map.containsKey("/level1/level2/level2.js")).isFalse();
        assertThat(map.containsKey("/noInstrument/noInstrument.js")).isFalse();

        FileData fileData = map.get("/level1/level1.js");
        assertThat(fileData.getLines().size()).isEqualTo(5);
        assertThat(fileData.getLines().get(0)).isNull();
        assertThat(fileData.getLines().get(1)).isEqualTo(0);
        assertThat(fileData.getLines().get(2)).isEqualTo(0);
        assertThat(fileData.getLines().get(3)).isEqualTo(0);
        assertThat(fileData.getLines().get(4)).isEqualTo(0);
    }
}
