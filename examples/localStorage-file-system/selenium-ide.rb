require "selenium-webdriver"
require "rspec"
include RSpec::Expectations

describe "SeleniumIde" do

  before(:each) do
    @driver = Selenium::WebDriver.for :firefox
    @base_url = "http://localhost:8080/"
    @accept_next_alert = true
    @driver.manage.timeouts.implicit_wait = 30
    @verification_errors = []
  end

  after(:each) do
    @driver.quit
    expect(@verification_errors).to eq([])
  end

  it "test_selenium_ide" do
    @driver.get(@base_url + "/index.html")
    @driver.find_element(:id, "radio1").click
    @driver.get(@base_url + "/index.html")
    @driver.find_element(:id, "radio2").click
    @driver.get(@base_url + "/jscoverage.html")
    coverageJSON = @driver.execute_script("return jscoverage_serializeCoverageToJSON();")
    File.open '../../target/example-fs-localStorage/jscoverage.json', "w" do |f|
      f.write coverageJSON
    end
    jsCoverJSFile = '../../target/example-fs-localStorage/jscoverage.js'
    jsCoverJS = File.read(jsCoverJSFile)
    jsReportCode = "\njscoverage_isReport = true;"
    if jsCoverJS.index(jsReportCode) == nil
      File.open jsCoverJSFile, "a" do |f|
        f.write jsReportCode
      end
    end
    @driver.find_element(:id, "summaryTab").click
  end

end
