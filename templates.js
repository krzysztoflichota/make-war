module.exports = {
    urlrewriteXmlContent,
    webXmlContent,
};

function urlrewriteXmlContent(directFilesRegex, passThrough) {
    return Buffer.from(`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE urlrewrite
        PUBLIC "-//tuckey.org//DTD UrlRewrite 4.0//EN"
        "http://www.tuckey.org/res/dtds/urlrewrite4.0.dtd">
<urlrewrite>
    <rule>
        <from>^/index.html$</from>
        <to last="true">-</to>
    </rule>
    ${ passThrough.map(regex => `
        <rule>
            <from>${regex}</from>
            <to last="true">-</to>
        </rule>
    `).join('')}
    <rule>
        <from>^/(${directFilesRegex})$</from>
        <to last="true">-</to>
    </rule>
    <rule>
        <from>^/(.*)$</from>
        <to>/index.html</to>
    </rule>
</urlrewrite>`);
}

function webXmlContent(displayName, description) {
    return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd" version="4.0" metadata-complete="true">
    <description>${description}</description>
    <display-name>${displayName}</display-name>
    <filter>
        <filter-name>UrlRewriteFilter</filter-name>
        <filter-class>org.tuckey.web.filters.urlrewrite.UrlRewriteFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>UrlRewriteFilter</filter-name>
        <url-pattern>/*</url-pattern>
        <dispatcher>REQUEST</dispatcher>
        <dispatcher>FORWARD</dispatcher>
    </filter-mapping>
</web-app>`, 'utf8');
}
