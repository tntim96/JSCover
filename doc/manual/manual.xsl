<?xml version="1.0"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        version="1.0">
    <xsl:preserve-space elements="code"/>
    <xsl:output method="html" indent="yes"/>
    <xsl:include href="xhtml.xsl"/>

    <xsl:template match="document">
        <html>
            <head>
                <title>
                    <xsl:value-of select="title"/>
                </title>
                <link REL="stylesheet" TYPE="text/css" href="manual.css"/>
                <script type="text/javascript" src="manual.js"></script>
            </head>
            <body>
                <a name="top"></a>
                <div class="floating-menu">
                    <h1><xsl:value-of select="title"/></h1>
                    <xsl:apply-templates select="item">
                        <xsl:with-param name="area">contents</xsl:with-param>
                    </xsl:apply-templates>
                </div>
                <div class="content">
                <xsl:apply-templates select="item">
                    <xsl:with-param name="area">body</xsl:with-param>
                </xsl:apply-templates>
                </div>
                <p style="margin-top: 800px;">&#160;</p>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="item">
        <xsl:param name="area" select="''"/>
        <xsl:apply-templates>
            <xsl:with-param name="area">
                <xsl:value-of select="$area"/>
            </xsl:with-param>
        </xsl:apply-templates>
    </xsl:template>

    <xsl:template match="section">
        <xsl:param name="area" select="''"/>
        <div>
            <xsl:choose>
                <xsl:when test="$area='contents'">
                    <xsl:attribute name="id"><xsl:value-of select="concat(../heading/@id,'Section')"/></xsl:attribute>
                    <xsl:attribute name="style">display: none;</xsl:attribute>
                </xsl:when>
                <xsl:when test="$area='body'"/>
                <xsl:otherwise>
                    Error in XSL: param area=<xsl:value-of select="$area"/>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:apply-templates>
                <xsl:with-param name="area">
                    <xsl:value-of select="$area"/>
                </xsl:with-param>
            </xsl:apply-templates>
        </div>
    </xsl:template>

    <xsl:template match="heading">
        <xsl:param name="area" select="''"/>
        <xsl:variable name="level" select="count(ancestor::item)"/>
        <xsl:variable name="levelNumber">
            <xsl:number count="item" format="1" level="multiple" grouping-separator="."/>
        </xsl:variable>
        <xsl:choose>
            <xsl:when test="$area='contents'">
                <div>
                    <xsl:choose>
                        <xsl:when test="$level = 1">
                            <a><xsl:attribute name="id"><xsl:value-of select="@id"/>Toggle</xsl:attribute>
                                <xsl:attribute name="class">ExpandCollapse</xsl:attribute>
                                <xsl:attribute name="href">javascript:toggle_visibility('<xsl:value-of select="@id"/>Toggle', '<xsl:value-of select="@id"/>Section');</xsl:attribute>
                                +</a>
                        </xsl:when>
                    </xsl:choose>
                    <span>
                        <xsl:attribute name="class">contentHeading<xsl:value-of select="$level"/></xsl:attribute>
                        <xsl:attribute name="style">padding-left:<xsl:value-of select="$level*10-10"/>px;</xsl:attribute>
                        <xsl:value-of select="$levelNumber"/>
                    </span>
                    <a>
                        <xsl:attribute name="href">#<xsl:value-of select="@id"/></xsl:attribute>
                        <xsl:attribute name="class">contentHeading<xsl:value-of select="$level"/></xsl:attribute>
                        <xsl:attribute name="style">padding-left:10px;</xsl:attribute>
                        <xsl:value-of select="."/>
                    </a>
                </div>
            </xsl:when>
            <xsl:when test="$area='body'">
                <div style="margin-top:20px;">
                    <xsl:attribute name="class">heading<xsl:value-of select="$level"/></xsl:attribute>
                    <a>
                        <xsl:attribute name="name">
                            <xsl:value-of select="@id"/>
                        </xsl:attribute>
                    </a>
                    <xsl:value-of select="$levelNumber"/>
                    <span>
                        <xsl:attribute name="style">padding-left:10px;</xsl:attribute>
                        <xsl:value-of select="."/>
                    </span>
                </div>
            </xsl:when>
            <xsl:otherwise>
                Error in XSL: param area=<xsl:value-of select="$area"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="text">
        <xsl:param name="area" select="''"/>
        <xsl:variable name="level" select="count(ancestor::item)"/>
        <xsl:variable name="levelNumber">
            <xsl:number count="item" format="1" level="multiple" grouping-separator="."/>
        </xsl:variable>
        <xsl:choose>
            <xsl:when test="$area='contents'"/>
            <xsl:when test="$area='body'">
                <p>
                    <xsl:apply-templates/>
                </p>
                <!--<div>-->
                    <!--<a href="#top">Contents</a>-->
                <!--</div>-->
            </xsl:when>
            <xsl:otherwise>
                Error in XSL: param area=<xsl:value-of select="$area"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="code">
        <pre><xsl:apply-templates/></pre>
    </xsl:template>

    <xsl:template match="var">
        <span class="var"><xsl:apply-templates/></span>
    </xsl:template>

    <xsl:template match="note">
        <span class="note"><xsl:apply-templates/></span>
    </xsl:template>

</xsl:stylesheet>
