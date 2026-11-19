$port = 5500
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    $port = 5501
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  SafeWater Local Server da khoi dong thanh cong!" -ForegroundColor Green
Write-Host "  Dia chi: http://localhost:$port" -ForegroundColor Yellow
Write-Host "  Micro va Giong noi tieng Viet hoat dong 100%!" -ForegroundColor Green
Write-Host "  (De dong may chu, ban chi can dong cua so nay)" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Cyan

Start-Process "http://localhost:$port/index.html"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".mp3"  = "audio/mpeg"
    ".wav"  = "audio/wav"
    ".mp4"  = "video/mp4"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $urlPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = "index.html" }
        $urlPath = [System.Uri]::UnescapeDataString($urlPath)
        $localFile = Join-Path $root ($urlPath -replace '/', '\')

        if (Test-Path $localFile -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFile).ToLower()
            $res.ContentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $res.AddHeader("Access-Control-Allow-Origin", "*")
            $bytes = [System.IO.File]::ReadAllBytes($localFile)
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $buf = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.OutputStream.Write($buf, 0, $buf.Length)
        }
        $res.OutputStream.Close()
    } catch {
        # Bo qua loi ngat ket noi khi tab dong
    }
}
