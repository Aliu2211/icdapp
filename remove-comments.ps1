$fileExtensions = @("*.ts", "*.tsx", "*.js", "*.jsx", "*.css", "*.scss", "*.json", "*.md")
$excludeDirs = @("node_modules", ".git", ".next", "build", "dist")

function Remove-Comments {
    param (
        [string]$filePath,
        [string]$fileType
    )

    $content = Get-Content -Path $filePath -Raw

    switch ($fileType) {
        { $_ -in @(".ts", ".tsx", ".js", ".jsx") } {
            # Remove single-line comments
            $content = $content -replace "//.*?`n", "`n"
            # Remove multi-line comments
            $content = $content -replace "(?s)/\*.*?\*/", ""
        }
        { $_ -in @(".css", ".scss") } {
            # Remove CSS comments
            $content = $content -replace "(?s)/\*.*?\*/", ""
        }
        { $_ -in @(".json") } {
            # Only process legitimate JSON files (package.json might have comments)
            try {
                $jsonObj = $content | ConvertFrom-Json
                $content = $jsonObj | ConvertTo-Json -Depth 10
            }
            catch {
                Write-Host "Skipping $filePath - not a valid JSON file"
            }
        }
        { $_ -in @(".md") } {
            # Remove HTML comments
            $content = $content -replace "(?s)<!--.*?-->", ""
        }
    }

    Set-Content -Path $filePath -Value $content
    Write-Host "Processed: $filePath"
}

$baseDir = Get-Location

Get-ChildItem -Path $baseDir -Recurse -File -Include $fileExtensions | ForEach-Object {
    $shouldProcess = $true
    
    foreach ($dir in $excludeDirs) {
        if ($_.FullName -like "*\$dir\*") {
            $shouldProcess = $false
            break
        }
    }
    
    if ($shouldProcess) {
        $extension = $_.Extension.ToLower()
        Remove-Comments -filePath $_.FullName -fileType $extension
    }
}

Write-Host "Comment removal complete!"
