$url = "https://script.google.com/macros/s/AKfycbxihBfQUHiQj6M0TXon-6ufZxjt6a9Lre-jeO3fvsNiE2EwlzTN71Gi2n3V7A6Q8hl3/exec"

$students = @(
  @{name="Hoàng Gia Bảo"; cls="5A"; school="Trường TH&THCS Nguyễn Du"; ward="Thuận Hạnh"; prov="Lâm Đồng"; score=146; correct="10/10"; elapsed="88s"},
  @{name="Vũ Mai Phương"; cls="5B"; school="Trường TH&THCS Nguyễn Du"; ward="Thuận Hạnh"; prov="Lâm Đồng"; score=141; correct="10/10"; elapsed="98s"},
  @{name="Nguyễn Đăng Khôi"; cls="6A"; school="Trường TH&THCS Nguyễn Du"; ward="Thuận Hạnh"; prov="Lâm Đồng"; score=136; correct="9/10"; elapsed="88s"},
  @{name="Trần Thùy Linh"; cls="5C"; school="Trường TH&THCS Nguyễn Du"; ward="Thuận Hạnh"; prov="Lâm Đồng"; score=132; correct="9/10"; elapsed="96s"},
  @{name="Phạm Quốc Anh"; cls="4B"; school="Trường TH&THCS Nguyễn Du"; ward="Thuận Hạnh"; prov="Lâm Đồng"; score=128; correct="9/10"; elapsed="104s"},
  @{name="Lê Minh Triết"; cls="6B"; school="Trường TH&THCS Nguyễn Du"; ward="Thuận Hạnh"; prov="Lâm Đồng"; score=125; correct="8/10"; elapsed="90s"},
  @{name="Đặng Thảo Vy"; cls="5A"; school="Trường TH&THCS Nguyễn Du"; ward="Thuận Hạnh"; prov="Lâm Đồng"; score=120; correct="8/10"; elapsed="100s"},
  @{name="Bùi Thanh Hằng"; cls="4A"; school="Trường TH&THCS Nguyễn Du"; ward="Thuận Hạnh"; prov="Lâm Đồng"; score=115; correct="8/10"; elapsed="110s"},
  @{name="Đỗ Nhật Minh"; cls="5C"; school="Trường TH&THCS Nguyễn Du"; ward="Thuận Hạnh"; prov="Lâm Đồng"; score=112; correct="7/10"; elapsed="96s"},
  @{name="Hồ Khánh An"; cls="6A"; school="Trường TH&THCS Nguyễn Du"; ward="Thuận Hạnh"; prov="Lâm Đồng"; score=105; correct="7/10"; elapsed="110s"}
)

foreach ($s in $students) {
  $body = @{
    surveyType = "Bài kiểm tra kiến thức"
    name = $s.name
    class = $s.cls
    school = $s.school
    ward = $s.ward
    prov = $s.prov
    score = $s.score
    correct = $s.correct
    elapsed = $s.elapsed
    timestamp = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
  } | ConvertTo-Json

  try {
    $res = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    Write-Host "Sent: $($s.name) -> $($s.score) pts"
  } catch {
    Write-Host "Error sending: $($s.name)"
  }
  Start-Sleep -Milliseconds 400
}

Write-Host "Finish test 10 candidates!"
