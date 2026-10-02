Add-Type -AssemblyName System.Drawing
$imagePath = 'C:\Users\HP\.gemini\antigravity\brain\3132b4d5-0d69-43d4-93fb-e8a9ff66a870\.user_uploaded\media_1790925765980.png'
$destPath = "C:\Users\HP\Downloads\app_icon_512.png"

$image = [System.Drawing.Image]::FromFile($imagePath)
$newImage = New-Object System.Drawing.Bitmap(512, 512)
$graphics = [System.Drawing.Graphics]::FromImage($newImage)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($image, 0, 0, 512, 512)

$newImage.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$newImage.Dispose()
$image.Dispose()
Write-Output 'Resized successfully'
