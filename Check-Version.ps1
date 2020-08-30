$package = Get-Content package.json | ConvertFrom-Json
$checkVersion = npm view "$($package.name)@$($package.version)"
if ($checkVersion) {
    Write-Host "exists"
} else {
    Write-Host "no exist"
}