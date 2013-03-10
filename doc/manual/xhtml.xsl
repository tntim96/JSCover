<?xml version="1.0"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">

<xsl:preserve-space elements="code"/>
<xsl:output	method="html" indent="yes"/>

<xsl:template match="a">
  <a>
    <xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute>
    <xsl:attribute name="target"><xsl:value-of select="@target"/></xsl:attribute>
    <xsl:apply-templates/>
  </a>
</xsl:template>

<xsl:template match="imgThumb">
    <a target="_blank">
        <xsl:attribute name="href"><xsl:value-of select="@src"/></xsl:attribute>
        <xsl:call-template name="img"/>
    </a>
</xsl:template>

<xsl:template match="img" name="img">
    <xsl:choose>
        <xsl:when test="@alt!=''">
            <table>
                <tr><th><xsl:value-of select="@alt"/></th></tr>
                <tr><td><xsl:call-template name="imageTemplate"/></td></tr>
            </table>
        </xsl:when>
        <xsl:otherwise>
            <xsl:call-template name="imageTemplate"/>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template>

<xsl:template name="imageTemplate">
    <img>
        <xsl:attribute name="src"><xsl:value-of select="@src"/></xsl:attribute>
        <xsl:attribute name="alt"><xsl:value-of select="@alt"/></xsl:attribute>
        <xsl:attribute name="title"><xsl:value-of select="@alt"/></xsl:attribute>
        <xsl:attribute name="border">0</xsl:attribute>
        <xsl:choose>
            <xsl:when test="@width!=''">
                <xsl:attribute name="width"><xsl:value-of select="@width"/></xsl:attribute>
            </xsl:when>
        </xsl:choose>
    </img>
</xsl:template>

<xsl:template match="b">
  <b><xsl:apply-templates/></b>
</xsl:template>

<xsl:template match="table">
  <table>
    <xsl:attribute name="class"><xsl:value-of select="@class"/></xsl:attribute>
    <xsl:apply-templates/>
  </table>
</xsl:template>

<xsl:template match="tr">
  <tr><xsl:apply-templates/></tr>
</xsl:template>

<xsl:template match="th">
  <th><xsl:apply-templates/></th>
</xsl:template>

<xsl:template match="td">
  <td>
      <xsl:attribute name="class"><xsl:value-of select="@class"/></xsl:attribute>
      <xsl:apply-templates/>
  </td>
</xsl:template>

<xsl:template match="ul">
  <ul><xsl:apply-templates/></ul>
</xsl:template>

<xsl:template match="ol">
  <ol><xsl:apply-templates/></ol>
</xsl:template>

<xsl:template match="li">
  <li><xsl:apply-templates/></li>
</xsl:template>

<xsl:template match="br">
  <br/>
</xsl:template>

</xsl:stylesheet>
