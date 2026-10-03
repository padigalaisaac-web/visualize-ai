Add-Type -AssemblyName System.Drawing

$rupee = [char]0x20B9
$bullet = " - "

function Create-DemoImage {
    param (
        [string]$Path,
        [int]$Width = 840,
        [int]$Height = 520,
        [string]$BgHex = "#111827",
        [string]$BorderHex = "#6366F1",
        [string]$BadgeText = "DOCUMENT",
        [string]$BadgeColorHex = "#818CF8",
        [string]$Title = "Title",
        [string]$Subtitle = "",
        [string]$CardBgHex = "#1F2937",
        [string]$CardBorderHex = "#374151",
        [string]$QuoteLabel = "Factual Assertion:",
        [string]$QuoteText = "Claim text",
        [string]$QuoteColorHex = "#38BDF8",
        [string[]]$TableRows = @(),
        [string]$FooterText = "Footer details"
    )

    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Background
    $bgColor = [System.Drawing.ColorTranslator]::FromHtml($BgHex)
    $g.Clear($bgColor)

    # Outer border
    $borderColor = [System.Drawing.ColorTranslator]::FromHtml($BorderHex)
    $borderPen = New-Object System.Drawing.Pen($borderColor, 2)
    $g.DrawRectangle($borderPen, 12, 12, $Width - 24, $Height - 24)

    # Header Badge
    $badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($BadgeColorHex))
    $badgeFont = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
    $g.DrawString($BadgeText.ToUpper(), $badgeFont, $badgeBrush, 45, 35)

    # Title
    $titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $titleFont = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)
    $g.DrawString($Title, $titleFont, $titleBrush, 45, 62)

    if ($Subtitle -ne "") {
        $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#94A3B8"))
        $subFont = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)
        $g.DrawString($Subtitle, $subFont, $subBrush, 45, 105)
    }

    # Center Card
    $cardBg = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($CardBgHex))
    $cardBorder = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml($CardBorderHex), 1)
    
    $cardY = 140
    $cardHeight = 285
    $g.FillRectangle($cardBg, 45, $cardY, $Width - 90, $cardHeight)
    $g.DrawRectangle($cardBorder, 45, $cardY, $Width - 90, $cardHeight)

    if ($TableRows.Count -gt 0) {
        # Render Table Mode
        $rowY = $cardY + 22
        $tFontBold = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
        $tFontReg = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Regular)
        $tBrushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $tBrushCyan = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#38BDF8"))
        $tBrushGreen = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#22C55E"))
        $tBrushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#94A3B8"))

        foreach ($r in $TableRows) {
            $parts = $r.Split("|")
            $col1 = $parts[0].Trim()
            $col2 = if ($parts.Length -gt 1) { $parts[1].Trim() } else { "" }
            $col3 = if ($parts.Length -gt 2) { $parts[2].Trim() } else { "" }

            if ($col1.StartsWith("#")) {
                # Header row
                $g.DrawString($col1.TrimStart("#"), $tFontBold, $tBrushMuted, 70, $rowY)
                $g.DrawString($col2, $tFontBold, $tBrushMuted, 310, $rowY)
                $g.DrawString($col3, $tFontBold, $tBrushMuted, 560, $rowY)
                $g.DrawLine($cardBorder, 65, $rowY + 28, $Width - 65, $rowY + 28)
                $rowY += 40
            } else {
                $g.DrawString($col1, $tFontBold, $tBrushWhite, 70, $rowY)
                $g.DrawString($col2, $tFontBold, $tBrushCyan, 310, $rowY)
                $g.DrawString($col3, $tFontReg, $tBrushGreen, 560, $rowY)
                $rowY += 40
            }
        }

        if ($QuoteText -ne "") {
            $sumBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($QuoteColorHex))
            $sumFont = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
            $g.DrawString($QuoteText, $sumFont, $sumBrush, 70, $cardY + $cardHeight - 50)
        }
    } else {
        # Render Statement / Quote Mode
        $qLabelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#CBD5E1"))
        $qLabelFont = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Regular)
        $g.DrawString($QuoteLabel, $qLabelFont, $qLabelBrush, 75, $cardY + 35)

        $qTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($QuoteColorHex))
        $qTextFont = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
        
        $rect = New-Object System.Drawing.RectangleF(75, ($cardY + 85), ($Width - 150), 150)
        $g.DrawString($QuoteText, $qTextFont, $qTextBrush, $rect)
    }

    # Footer
    $footerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#64748B"))
    $footerFont = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
    $g.DrawString($FooterText, $footerFont, $footerBrush, 45, $Height - 42)

    # Save to disk
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bitmap.Dispose()
    Write-Host "Created image: $Path"
}

# Ensure directories exist
$dir1 = "C:\Users\panch\.gemini\antigravity\scratch\visualproof-ai\demo_images"
$dir2 = "C:\Users\panch\.gemini\antigravity\scratch\visualproof-ai\client\public\demo_images"

if (!(Test-Path $dir1)) { New-Item -ItemType Directory -Path $dir1 -Force }
if (!(Test-Path $dir2)) { New-Item -ItemType Directory -Path $dir2 -Force }

# Demo 1 - Sales
Create-DemoImage -Path "$dir1\demo1_claim.png" `
    -BgHex "#111827" -BorderHex "#6366F1" `
    -BadgeText "FY2026 INVESTOR PRESENTATION - COMMERCIAL HIGHLIGHTS" -BadgeColorHex "#818CF8" `
    -Title "Executive Performance Review" `
    -Subtitle "Document Reference: Q4-EXEC-SUMMARY-P04" `
    -CardBgHex "#1E2333" -CardBorderHex "#334155" `
    -QuoteLabel "Official Executive Statement on Commercial Growth:" `
    -QuoteText "`"Sales increased by 300%.`"" `
    -QuoteColorHex "#38BDF8" `
    -FooterText "CONFIDENTIAL - TechCorp Annual Shareholder Deck - Slide 4"

Create-DemoImage -Path "$dir1\demo1_evidence.png" `
    -BgHex "#0F172A" -BorderHex "#38BDF8" `
    -BadgeText "AUDITED FINANCIAL STATEMENT - STATUTORY REPORT" -BadgeColorHex "#38BDF8" `
    -Title "Annual Sales Comparison (INR)" `
    -Subtitle "Audited ledger figures for FY2025 and FY2026" `
    -CardBgHex "#172033" -CardBorderHex "#334155" `
    -TableRows @(
        "# Fiscal Period | Audited Sales | Verification Status",
        "Fiscal Year 2025 | $rupee 10 Lakh | Audited & Verified",
        "Fiscal Year 2026 | $rupee 15 Lakh | Audited & Verified"
    ) `
    -QuoteText "Audited Result: Increase from $rupee 10 Lakh to $rupee 15 Lakh (+50.0% increase, not 300%)" `
    -QuoteColorHex "#4ADE80" `
    -FooterText "Signed: Grant & Partners Certified Public Accountants - Regulatory Filing 2026"

# Demo 2 - Revenue 50%
Create-DemoImage -Path "$dir1\demo2_claim.png" `
    -BgHex "#0D1B1E" -BorderHex "#22C55E" `
    -BadgeText "PUBLIC PRESS RELEASE - FISCAL MILESTONE" -BadgeColorHex "#4ADE80" `
    -Title "Apex Cloud Services Annual Report" `
    -Subtitle "Authorized for immediate global press distribution" `
    -CardBgHex "#13262A" -CardBorderHex "#1F3A3F" `
    -QuoteLabel "Public Factual Claim Statement:" `
    -QuoteText "`"Revenue increased by 50%.`"" `
    -QuoteColorHex "#4ADE80" `
    -FooterText "Apex Group Media Relations - Reference PR-2026-REV"

Create-DemoImage -Path "$dir1\demo2_evidence.png" `
    -BgHex "#0A1F18" -BorderHex "#10B981" `
    -BadgeText "STATUTORY REVENUE RECONCILIATION" -BadgeColorHex "#10B981" `
    -Title "Statutory Revenue Progress (2025 - 2026)" `
    -Subtitle "Official ledger balances verified by external auditing board" `
    -CardBgHex "#112C23" -CardBorderHex "#1A4336" `
    -TableRows @(
        "# Audit Period | Audited Revenue | Reconciliation Status",
        "Base Year (2025) | $rupee 10,00,000 (10L) | Certified Baseline",
        "Current Year (2026) | $rupee 15,00,000 (15L) | Certified Final"
    ) `
    -QuoteText "Calculation: (15L - 10L) / 10L = +0.50 (+50.0% Verified Increase)" `
    -QuoteColorHex "#34D399" `
    -FooterText "Signed by Audit Committee Chairperson - Apex Cloud Services Statutory Board"

# Demo 3 - Battery & Price
Create-DemoImage -Path "$dir1\demo3_claim.png" `
    -BgHex "#1F1715" -BorderHex "#F59E0B" `
    -BadgeText "PRODUCT MARKETING FLYER - HARDWARE LAUNCH" -BadgeColorHex "#FBBF24" `
    -Title "UltraPack Pro Performance Announcement" `
    -Subtitle "Consumer tech product showcase guide" `
    -CardBgHex "#2A1E1B" -CardBorderHex "#45302A" `
    -QuoteLabel "Primary Product Marketing Claim:" `
    -QuoteText "`"Our product is cheaper and lasts twice as long.`"" `
    -QuoteColorHex "#FBBF24" `
    -FooterText "UltraPack Technologies - Fall Hardware Campaign P01"

Create-DemoImage -Path "$dir1\demo3_evidence.png" `
    -BgHex "#181424" -BorderHex "#A855F7" `
    -BadgeText "INDEPENDENT CONSUMER LAB BENCHMARK REPORT" -BadgeColorHex "#C084FC" `
    -Title "Hardware Comparison Metrics" `
    -Subtitle "Standardized continuous testing by Hardware Evaluation Labs" `
    -CardBgHex "#221C33" -CardBorderHex "#3B3158" `
    -TableRows @(
        "# Metric Tested | Leading Competitor | UltraPack Pro",
        "Retail Price | `$100 USD | `$80 USD (Cheaper by 20%)",
        "Battery Duration | 10.0 Hours | 12.0 Hours (+20% only)"
    ) `
    -QuoteText "Benchmark Findings: Price is lower (`$80 vs `$100), but battery life is 12h vs 10h (+20%, not 2x)." `
    -QuoteColorHex "#FBBF24" `
    -FooterText "Hardware Evaluation Labs v4.1 - Continuous Video Playback Lab Test"


# Copy all to client public folder as well
Copy-Item "$dir1\*.png" -Destination $dir2 -Force
Write-Host "All demo images created and copied successfully to client/public/demo_images!"
