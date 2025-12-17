# Script to convert docx to markdown
param(
    [string]$InputPath,
    [string]$OutputPath
)

# Copy docx to zip and extract
$tempZip = [System.IO.Path]::GetTempFileName() + ".zip"
$tempDir = [System.IO.Path]::GetTempFileName() -replace '\.tmp$', '_extracted'

Copy-Item $InputPath $tempZip
Expand-Archive -Path $tempZip -DestinationPath $tempDir -Force

# Read document.xml
$docPath = Join-Path $tempDir "word\document.xml"
[xml]$xml = Get-Content $docPath -Encoding UTF8

# Extract text from all w:t elements
$ns = @{w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
$paragraphs = @()
$currentPara = ""

foreach ($node in $xml.SelectNodes("//w:p", (New-Object System.Xml.XmlNamespaceManager($xml.NameTable)).Tap({$_.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")}))) {
    $paraText = ""
    foreach ($t in $node.SelectNodes(".//w:t", (New-Object System.Xml.XmlNamespaceManager($xml.NameTable)).Tap({$_.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")}))) {
        $paraText += $t.InnerText
    }
    if ($paraText.Trim()) {
        $paragraphs += $paraText
    }
}

# Join paragraphs with double newlines (markdown paragraph separator)
$markdown = $paragraphs -join "`n`n"

# Write output
$markdown | Out-File -FilePath $OutputPath -Encoding UTF8

# Cleanup
Remove-Item $tempZip -Force
Remove-Item $tempDir -Recurse -Force

Write-Host "Converted: $InputPath -> $OutputPath"
