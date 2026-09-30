$port = 5174
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
$listener.Start()

Write-Host "Portfolio website running at http://localhost:$port/"

try {
    while ($true) {
        try {
            $client = $listener.AcceptTcpClient()
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream)
            $requestLine = $reader.ReadLine()
            
            if ($requestLine) {
                $parts = $requestLine.Split(' ')
                if ($parts.Length -gt 1) {
                    $path = $parts[1]
                    if ($path -eq '/') { $path = '/index.html' }
                    $localPath = Join-Path (Get-Location) $path.TrimStart('/')
                    
                    if (Test-Path $localPath -PathType Leaf) {
                        $bytes = [System.IO.File]::ReadAllBytes($localPath)
                        $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                        $ct = "text/plain"
                        if ($ext -eq ".html") { $ct = "text/html; charset=utf-8" }
                        elseif ($ext -eq ".css") { $ct = "text/css" }
                        elseif ($ext -eq ".js") { $ct = "application/javascript" }
                        elseif ($ext -eq ".png") { $ct = "image/png" }
                        elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $ct = "image/jpeg" }
                        elseif ($ext -eq ".svg") { $ct = "image/svg+xml" }

                        $header = "HTTP/1.1 200 OK`r`nContent-Type: $ct`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                        $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                        $stream.Write($headerBytes, 0, $headerBytes.Length)
                        $stream.Write($bytes, 0, $bytes.Length)
                    } else {
                        $msg = "404 Not Found"
                        $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($msg.Length)`r`nConnection: close`r`n`r`n$msg"
                        $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                        $stream.Write($headerBytes, 0, $headerBytes.Length)
                    }
                }
            }
            $client.Close()
        } catch {
            # Ignore client disconnect exceptions and continue serving
        }
    }
} finally {
    $listener.Stop()
}
