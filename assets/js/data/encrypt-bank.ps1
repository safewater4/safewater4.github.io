$srcPath = "e:\Google Driver\DU_AN\safe-water\assets\js\data\quiz-bank.js"
$rawContent = [System.IO.File]::ReadAllText($srcPath, [System.Text.Encoding]::UTF8)

# Lay phan JSON
$jsonStart = $rawContent.IndexOf('{')
$jsonEnd = $rawContent.LastIndexOf('}')
$jsonStr = $rawContent.Substring($jsonStart, $jsonEnd - $jsonStart + 1)
$data = $jsonStr | ConvertFrom-Json

# Ham xao tron chuoi ma hoa
function Encrypt-String ($str) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($str)
    $scrambled = @()
    for ($i = 0; $i -lt $bytes.Length; $i++) {
        $scrambled += [byte]($bytes[$i] -bxor 0x5A) # XOR voi khoa 0x5A
    }
    return [System.Convert]::ToBase64String($scrambled)
}

function Obfuscate-List ($list) {
    $res = @()
    foreach ($item in $list) {
        $encQ = Encrypt-String $item.q
        $encOpts = @()
        foreach ($o in $item.opts) {
            $encOpts += (Encrypt-String $o)
        }
        $encEx = Encrypt-String $item.ex
        # Hash dap an dung kem muoi (salt) de khong the do ra vi tri dap an
        $correctHash = Encrypt-String ("ans_salt_" + $item.c)

        $res += @{
            q = $encQ
            o = $encOpts
            h = $correctHash
            e = $encEx
        }
    }
    return $res
}

$obfObj = @{
    nb = Obfuscate-List $data.nhanBiet
    th = Obfuscate-List $data.thongHieu
    vd = Obfuscate-List $data.vanDung
}

$obfJson = $obfObj | ConvertTo-Json -Depth 5 -Compress

$finalJS = @"
/* assets/js/data/quiz-bank.js - Encrypted & Obfuscated Question Bank */
window.SW = window.SW || {};
window.SW.data = window.SW.data || {};
window.SW.data._k = 0x5A;
window.SW.data._d = function(b64){
  try{
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for(var i=0; i<bin.length; i++) bytes[i] = bin.charCodeAt(i) ^ window.SW.data._k;
    return new TextDecoder().decode(bytes);
  }catch(e){return '';}
};
window.SW.data._v = function(h, idx){
  return h === window.SW.data._e('ans_salt_' + idx);
};
window.SW.data._e = function(str){
  var bytes = new TextEncoder().encode(str);
  var s = '';
  for(var i=0; i<bytes.length; i++) s += String.fromCharCode(bytes[i] ^ window.SW.data._k);
  return btoa(s);
};
window.SW.data.quizEncrypted = $obfJson;
"@

[System.IO.File]::WriteAllText($srcPath, $finalJS, [System.Text.Encoding]::UTF8)
Write-Host "Successfully encrypted and obfuscated quiz-bank.js!"
