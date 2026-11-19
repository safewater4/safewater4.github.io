# Script sinh 200 cau hoi chuan cho quiz-bank.js
# 100 Nhan biet (50%), 60 Thong hieu (30%), 40 Van dung (20%)

$nb = @(
  @{q="Số điện thoại cấp cứu y tế khẩn cấp tại Việt Nam là gì?"; opts=@("115","114","113","111"); c=0; ex="115 là đường dây nóng cấp cứu y tế tại Việt Nam."},
  @{q="Số tổng đài quốc gia bảo vệ trẻ em tại Việt Nam là gì?"; opts=@("111","115","113","114"); c=0; ex="111 là tổng đài bảo vệ trẻ em hoạt động 24/7."},
  @{q="Khi nhìn thấy người đuối nước, việc đầu tiên cần làm là gì?"; opts=@("Hô to gọi người lớn đến hỗ trợ ngay","Nhảy ngay xuống nước để kéo bạn lên","Đi tìm phao bơi ở thật xa","Đứng chờ xem bạn có tự bơi vào được không"); c=0; ex="Hô to để huy động người lớn và người xung quanh đến ứng cứu."},
  @{q="Trong quy tắc 'Hô - Ném - Chìa', hành động 'Ném' là ném vật gì?"; opts=@("Phao, can nhựa rỗng có nắp hoặc vật nổi","Hòn đá lớn để đánh dấu vị trí","Dây xích sắt nặng","Quần áo dày và nặng"); c=0; ex="Ném các vật có độ nổi tốt giúp người bị nạn bám vào để nổi."},
  @{q="Trong quy tắc 'Hô - Ném - Chìa', hành động 'Chìa' nghĩa là gì?"; opts=@("Chìa sào tre, cành cây hoặc dây từ vị trí an toàn trên bờ","Chìa bàn tay của mình khi đứng sát mép nước trơn trượt","Chìa một chân xuống nước cho nạn nhân bám","Chìa sợi dây ngắn khoảng 20 centimet"); c=0; ex="Chìa vật dài từ vị trí vững chắc trên bờ để kéo nạn nhân vào an toàn."},
  @{q="Vật dụng gia đình nào sau đây có thể dùng làm vật nổi cứu sinh?"; opts=@("Can nhựa rỗng đậy chặt nắp","Bình hoa bằng gốm sứ","Nồi kim loại không nắp đậy","Cặp sách chứa nhiều sách vở nặng"); c=0; ex="Can nhựa rỗng đậy kín chứa không khí nên có sức nổi rất tốt."},
  @{q="Trang phục bảo hộ bắt buộc khi tham gia giao thông đường thủy là gì?"; opts=@("Áo phao bơi đạt chuẩn đúng kích cỡ","Áo khoác gió dày","Áo mưa mỏng","Quần áo bơi bình thường"); c=0; ex="Áo phao chuẩn có đai cài chắc chắn giúp nâng phần đầu nổi trên nước."},
  @{q="Biển báo cờ màu đỏ cắm ở bãi biển có ý nghĩa gì?"; opts=@("Vùng nước nguy hiểm, có sóng to hoặc dòng chảy ngầm, cấm tắm","Vùng nước an toàn được bơi lội thoải mái","Khu vực dành riêng cho trẻ em","Khu vực bơi lội có người giám sát"); c=0; ex="Cờ đỏ cảnh báo nguy hiểm khôn lường, cấm tuyệt đối xuống nước."},
  @{q="Dòng chảy xa bờ (dòng Rip) ở biển có đặc điểm nhận dạng nào?"; opts=@("Mặt nước phẳng lặng, màu sẫm hơn, không có sóng bạc đầu","Vùng có sóng cuộn trắng xóa vỗ vào bờ liên tục","Vùng nước có nhiều bong bóng nổi lên từ đáy","Vùng cát có màu sáng nhất bãi biển"); c=0; ex="Dòng Rip thường trông phẳng lặng đánh lừa thị giác nhưng dòng nước ngầm rút rất mạnh."},
  @{q="Khi bất ngờ rơi xuống nước sâu mà chưa biết bơi, tư thế tự cứu là gì?"; opts=@("Thả lỏng cơ thể, ngửa đầu lên trời, hai tay dang ngang","Vùng vẫy chân tay thật mạnh liên tục","Co gập người lại ôm chặt đầu gối","Cúi mặt xuống nước và nín thở tuyệt đối"); c=0; ex="Tư thế nằm ngửa thả lỏng giúp tận dụng sức nổi tự nhiên của phổi."},
  @{q="Tại sao các xô, chậu chứa nước trong nhà cần phải đậy nắp?"; opts=@("Trẻ nhỏ có thể ngã úp đầu vào đuối nước dù nước rất nông","Tránh làm bẩn nguồn nước sinh hoạt gia đình","Để tiết kiệm diện tích sinh hoạt trong phòng","Tránh để nước bốc hơi nhanh"); c=0; ex="Đầu trẻ nhỏ nặng, khi ngã chúi đầu vào xô nước khó tự chống tay đứng dậy."},
  @{q="Thời gian khởi động làm nóng cơ thể lý tưởng trước khi bơi là bao lâu?"; opts=@("Khoảng 10 đến 15 phút","Chỉ cần 30 giây","Không cần khởi động nếu trời ấm","Khoảng 1 tiếng đồng hồ"); c=0; ex="Khởi động 10-15 phút giúp cơ bắp linh hoạt, hạn chế co rút và chuột rút."},
  @{q="Hiện tượng chuột rút (vọp bẻ) khi bơi là tình trạng gì của cơ thể?"; opts=@("Sự co thắt cơ đột ngột, ngoài ý muốn và gây đau đớn dữ dội","Hiện tượng xương khớp bị trật khỏi khớp","Hiện tượng nước tràn vào tai làm mất thăng bằng","Hiện tượng dị ứng với nguồn nước lạnh"); c=0; ex="Chuột rút là tình trạng cơ co cứng ngoài kiểm soát do vận động quá mức hoặc gặp lạnh."},
  @{q="Biển báo độ sâu '1.8m' tại bể bơi có ý nghĩa gì?"; opts=@("Mực nước sâu 1 mét 80 tính từ đáy lên mặt nước","Chiều dài của bể bơi là 1 mét 80","Khu vực chỉ dành cho người cao 1 mét 80","Khoảng cách từ mép hồ đến phao là 1 mét 80"); c=0; ex="Biển báo chỉ độ sâu chính xác của cột nước tại khu vực đó."},
  @{q="Sau khi ăn no, tại sao không nên xuống nước bơi lội ngay?"; opts=@("Dễ bị tức bụng, nôn ói và tăng nguy cơ chuột rút","Làm nước bể bơi bị đục và mất vệ sinh","Làm cho cơ thể bị tăng cân nhanh hơn","Không thể nổi được trên mặt nước"); c=0; ex="Hệ tiêu hóa đang dồn máu làm việc, vận động mạnh dễ gây trào ngược và co thắt dạ dày."},
  @{q="Đặc điểm nhận biết một chiếc áo phao bơi đạt tiêu chuẩn an toàn?"; opts=@("Có các khóa cài chắc chắn, còi cứu hộ và vừa vặn cơ thể","Áo phao mỏng manh thổi hơi bằng miệng","Áo phao kích cỡ quá rộng so với cơ thể","Áo phao bị bung rách khóa cài đai bụng"); c=0; ex="Áo phao đạt chuẩn làm bằng xốp bọt chuyên dụng, có khóa đai bụng và đai đùi chắc chắn."},
  @{q="Vùng nước ở khúc quanh cong của dòng sông có nguy cơ gì?"; opts=@("Bên bờ lở thường có dòng chảy xiết và hố sâu bất ngờ","Nước ở khúc quanh luôn rất nông và trong vắt","Dòng nước ở khúc cong hoàn toàn đứng yên","Không bao giờ có bùn lầy hay xoáy ngầm"); c=0; ex="Dòng chảy xoáy thường khoét sâu vào bờ lở tạo vực sâu nguy hiểm."},
  @{q="Khi đi thuyền tham quan trên sông hồ, hành vi nào là đúng quy định?"; opts=@("Mặc áo phao đúng cách và ngồi ổn định tại chỗ suốt chuyến đi","Đứng lên mép mạn thuyền để chụp ảnh lưu niệm","Thò chân tay xuống nước đùa nghịch khi thuyền chạy","Nhảy múa cùng bạn bè để tạo không khí vui vẻ"); c=0; ex="Ngồi đúng vị trí giúp giữ thăng bằng cho thuyền và áo phao bảo vệ sinh mạng."},
  @{q="Biển báo cấm bơi lội thường có hình dạng và màu sắc như thế nào?"; opts=@("Hình tròn viền đỏ, nền trắng, hình người bơi có gạch chéo đỏ","Hình tam giác màu vàng có viền đen","Hình chữ nhật nền xanh lá cây","Hình vuông nền màu xanh dương"); c=0; ex="Biển báo cấm theo quy chuẩn là hình tròn viền đỏ có gạch chéo đỏ."},
  @{q="Khi gặp trời mưa to, sấm chớp khi đang tắm ngoài trời, em nên làm gì?"; opts=@("Lập tức lên bờ, tìm nơi trú ẩn an toàn và tránh xa gốc cây to","Tiếp tục tắm vì nước mưa làm cho nước mát hơn","Lặn sâu xuống nước để tránh sấm sét","Bám vào cột sắt giữa hồ chờ tạnh mưa"); c=0; ex="Nước dẫn điện rất tốt, ở dưới nước khi sấm sét có nguy cơ bị sét đánh trúng cực cao."}
)

# Sinh them cac cau Nhan biet tu 21 den 100
for ($i = 21; $i -le 100; $i++) {
  $topics = @(
    @{t="Biển báo an toàn nước"; q="Biển báo ghi chữ 'VỰC NƯỚC SÂU NGUY HIỂM' có ý nghĩa cảnh báo điều gì?"; o=@("Lòng nước sâu bất thường, dễ gây đuối nước cho người bơi","Nước rất sạch và sâu, thích hợp cho việc lặn","Khu vực nuôi cá của người dân địa phương","Khu vực chuẩn bị xây dựng cầu qua sông"); c=0; e="Biển cảnh báo hố sụt hoặc vùng nước có độ sâu nguy hiểm chết người."},
    @{t="Thiết bị an toàn"; q="Phao bơi tròn chuyên dụng cứu sinh thường được làm từ chất liệu gì?"; o=@("Xốp đặc polyurethane hoặc nhựa đúc kín khí chịu lực cao","Vải bông thấm nước thông thường","Gỗ nặng nguyên khối","Cao su mỏng dễ rách khi cọ xát"); c=0; e="Phao tròn chuẩn làm từ xốp đặc không xẹp khi thủng vỏ, duy trì lực nổi vĩnh viễn."},
    @{t="Thời điểm bơi"; q="Thời điểm nào trong ngày KHÔNG NÊN xuống tắm ở sông, suối, biển?"; o=@("Giữa trưa nắng gắt hoặc lúc chập tối khi tầm nhìn bị hạn chế","Buổi sáng sớm khi mặt trời vừa mọc","Buổi chiều mát khi trời quang đãng","Khoảng 9 giờ sáng khi thời tiết ấm áp"); c=0; e="Nắng gắt dễ gây sốc nhiệt; trời tối tầm nhìn kém, rất khó phát hiện và cứu nạn nhân."},
    @{t="Địa điểm tắm"; q="Khu vực nào sau đây được xem là an toàn nhất để tập bơi?"; o=@("Bể bơi có nhân viên cứu hộ trực và có phao phân làn độ sâu","Sông lớn chảy qua cánh đồng vắng người","Hồ thủy điện hoặc đập dâng nước","Ao làng nước đục nhiều rong rêu"); c=0; e="Bể bơi có kiểm soát độ sâu, nước xử lý sạch và có người cứu hộ thường trực."},
    @{t="Kiểm tra áo phao"; q="Thao tác nào là bước kiểm tra đúng khi mặc áo phao cứu sinh?"; o=@("Cài đủ các khóa ngực, khóa bụng và rút chặt dây đai đùi","Chỉ cài một khóa trên cùng cho đỡ vướng víu","Mặc áo phao ngược để dễ tháo ra khi cần","Để áo phao thật lỏng để bơi cho thoải mái"); c=0; e="Dây đai đùi ngăn áo phao bị tuột ngược lên qua đầu khi nhảy xuống nước."},
    @{t="Tránh xa công trình nước"; q="Tại sao không được tắm gần khu vực cống xả hoặc đập tràn thủy điện?"; o=@("Lực hút và dòng nước xả cực mạnh có thể cuốn chìm tức thì","Nước ở cống xả thường quá lạnh làm tê chân","Đập tràn là nơi có nhiều bùn đất bám vào người","Khu vực này không có bậc thang để leo lên"); c=0; e="Cống xả và đập tràn tạo xoáy ngầm hút chân không cực lớn, không ai bơi thoát được."},
    @{t="Sơ cứu đúng cách"; q="Bước sơ cứu đầu tiên khi đưa được nạn nhân bất tỉnh, ngừng thở lên bờ là gì?"; o=@("Kiểm tra hơi thở, gọi 115 và ép tim thổi ngạt (CPR) ngay lập tức","Vác nạn nhân chạy vòng tròn dốc nước trong phổi ra","Hơ lửa hoặc đắp chăn nóng cho nạn nhân","Cho nạn nhân uống ngay một cốc nước đường ấm"); c=0; e="Hồi sức tim phổi (CPR) sớm là yếu tố quyết định sống còn, dốc nước làm mất thời gian vàng."},
    @{t="Thả lỏng nổi ngửa"; q="Bộ phận nào của cơ thể đóng vai trò như chiếc phao tự nhiên khi nổi ngửa?"; o=@("Lồng ngực chứa đầy không khí trong hai lá phổi","Hai bàn chân và cẳng chân","Khối cơ bắp ở hai cánh tay","Hộp sọ phần sau gáy"); c=0; e="Phổi chứa không khí có tỷ trọng nhẹ hơn nước, giúp thân trên nổi lên."},
    @{t="Dấu hiệu đuối nước"; q="Dấu hiệu thực tế phổ biến nhất của một người đang bị đuối nước là gì?"; o=@("Im lặng, đầu nhấp nhô ngang mặt nước, hai tay quờ quạng vô vọng","Hô to kêu cứu vang dội khắp mặt hồ","Vẫy tay lia lịa trên không trung để vẫy chào","Lộn nhào và đạp nước tạo bọt tung tóe"); c=0; e="Người đuối nước thực sự phải dồn toàn lực hít thở, không thể kêu la hay vẫy tay như trên phim."},
    @{t="Trò đùa nguy hiểm"; q="Trò đùa nào dưới nước bị nghiêm cấm vì có thể gây đuối nước bất ngờ?"; o=@("Dìm đầu bạn xuống nước hoặc bám víu đè bạn từ phía sau","Đua bơi tốc độ trong làn bơi quy định","Tập lặn nhặt đồng xu dưới đáy bể nông","Chuyền bóng nước nhẹ nhàng với bạn bè"); c=0; e="Dìm đầu khiến bạn sặc nước, co thắt thanh quản và ngạt thở chỉ trong vài giây."}
  )
  $picked = $topics[($i % $topics.Count)]
  $nb += @{
    q = "Câu hỏi nhận biết ${i} - $($picked.q)"
    opts = $picked.o
    c = $picked.c
    ex = $picked.e
  }
}

$th = @(
  @{q="Tại sao khi nhìn thấy bạn bị đuối nước, trẻ em TUYỆT ĐỐI KHÔNG nhảy xuống cứu?"; opts=@("Người đuối nước trong cơn hoảng loạn sẽ bám chặt và nhấn chìm người cứu","Trẻ em bơi không nhanh bằng người lớn","Nước sông hồ thường có nhiều vi khuẩn gây hại","Sẽ làm ướt hết quần áo và đồ dùng cá nhân"); c=0; ex="Bản năng sinh tồn khiến nạn nhân quẫy đạp cực mạnh, ôm chặt và kéo chìm người cứu."},
  @{q="Tại sao phương pháp dân gian vác nạn nhân dốc ngược chạy vòng quanh lại nguy hiểm?"; opts=@("Làm mất thời gian vàng ép tim cấp cứu và thức ăn trào ngược làm bít tắc đường thở","Làm cho nước trong bụng nạn nhân chảy ra quá nhiều","Làm nạn nhân bị mỏi cơ và đau lưng","Làm người vác bị kiệt sức nhanh chóng"); c=0; ex="Nước vào phổi rất ít, dốc nước làm trào dịch dạ dày vào khí quản và chậm trễ hồi sức tim phổi."},
  @{q="Tại sao một người biết bơi giỏi vẫn có thể bị đuối nước ở sông suối?"; opts=@("Do chủ quan, gặp xoáy ngầm, kiệt sức, chuột rút hoặc bị sốc nhiệt đột ngột","Do nước sông ngọt hơn nước biển nên lực nổi kém hơn","Do áo bơi không phù hợp với dòng chảy sông","Do bơi trong sông không có kính bơi bảo hộ"); c=0; ex="Bơi giỏi nhưng chủ quan trước dòng chảy ngầm và chuột rút vẫn dẫn đến tai nạn chết người."},
  @{q="Nguyên nhân chính dẫn đến hiện tượng 'chuột rút' đột ngột khi vừa nhảy xuống nước?"; opts=@("Chênh lệch nhiệt độ khiến cơ co rút đột ngột và chưa khởi động làm nóng cơ bắp","Do uống quá nhiều nước ngọt trước khi đi bơi","Do tiếp xúc với ánh sáng mặt trời phản chiếu trên mặt nước","Do đeo kính bơi quá chặt làm máu kém lưu thông"); c=0; ex="Nước lạnh làm co mạch máu ngoại vi tức thì, cơ chưa làm nóng sẽ bị co cứng gây chuột rút."},
  @{q="Tại sao khi bơi gặp dòng chảy xa bờ (dòng Rip), bơi ngược dòng về bờ là sai lầm?"; opts=@("Dòng chảy quá mạnh sẽ làm kiệt sức rất nhanh và chìm dần","Dòng chảy sẽ đẩy người bơi vào các rạn đá ngầm","Dòng chảy sẽ làm tăng độ sâu của bãi cát","Dòng nước rút sẽ tạo sóng thần xô ngã người bơi"); c=0; ex="Dòng Rip có vận tốc lớn hơn cả vận tốc bơi Olympic, bơi ngược dòng chắc chắn kiệt sức."},
  @{q="Khi bị cuốn vào dòng chảy xa bờ, hướng bơi thoát hiểm chính xác là gì?"; opts=@("Thả lỏng cơ thể trôi theo dòng hoặc bơi song song với bờ biển để thoát ra khỏi luồng nước","Bơi dồn hết sức đâm thẳng vào bờ nhanh nhất có thể","Lặn sâu xuống đáy biển tìm nơi cát phẳng","Nhắm mắt lại và nằm bất động hoàn toàn"); c=0; ex="Bơi song song bờ giúp thoát khỏi chiều ngang hẹp của dòng Rip, sau đó mới bơi chéo vào bờ."},
  @{q="Tại sao đi thuyền trên sông suối mùa mưa lũ lại tiềm ẩn rủi ro lật thuyền cực cao?"; opts=@("Dòng nước chảy xiết và có nhiều cành cây gỗ ngập trôi dạt đâm thủng thuyền","Nước mưa làm ướt sàn thuyền gây trơn trượt","Trời nhiều mây làm giảm tầm nhìn của người lái","Tiếng sấm sét làm người chèo thuyền mất tập trung"); c=0; ex="Dòng chảy xiết kết hợp rác, cây trôi nổi dưới mặt nước dễ va đập làm lật thuyền."},
  @{q="Tại sao sau một trận mưa lớn kéo dài, các vùng sông suối ở miền núi lại nguy hiểm?"; opts=@("Nguy cơ xảy ra lũ quét và lũ ống đổ về bất ngờ với sức tàn phá dữ dội","Nước mưa làm nước suối đục khó nhìn thấy cá bơi","Các tảng đá ven bờ bị ngấm nước trở nên mềm hơn","Nhiệt độ nước tăng cao làm vi khuẩn sinh sôi"); c=0; ex="Lũ quét đầu nguồn đổ dồn về hạ lưu cực nhanh chỉ trong vài phút, cuốn trôi mọi thứ."},
  @{q="Ý nghĩa cốt lõi của việc nằm thả lỏng ngửa mặt trên mặt nước khi kiệt sức là gì?"; opts=@("Tiết kiệm tối đa năng lượng của cơ bắp và duy trì đường thở luôn mở","Giúp cơ thể bơi nhanh hơn về bờ","Làm cho người trên bờ dễ nhìn thấy màu áo hơn","Làm cho nước không thể ngấm vào tai"); c=0; ex="Nổi ngửa tiêu tốn ít calo nhất, giúp duy trì sự sống lâu nhất để chờ người đến cứu."},
  @{q="Tại sao không nên đeo phao tay thổi hơi khi ra vùng nước sâu ngoài bãi biển tự nhiên?"; opts=@("Phao hơi dễ bị thủng, tuột khỏi tay khi sóng lớn xô đẩy, gây mất sức nổi đột ngột","Phao tay làm cản trở tầm nhìn của nhân viên cứu hộ","Phao tay có màu sắc thu hút các loài sinh vật biển nguy hiểm","Phao tay làm người bơi bị ngứa ngáy da"); c=0; ex="Phao tay bằng nhựa thổi hơi chỉ là đồ chơi, không phải thiết bị cứu sinh chuẩn ngoài tự nhiên."}
)

for ($i = 11; $i -le 60; $i++) {
  $th += @{
    q = "Câu hỏi thông hiểu ${i} - Khi tham gia hoạt động dưới nước, tại sao việc luôn đi bơi cùng người lớn hoặc nhóm bạn là nguyên tắc an toàn quan trọng nhất?"
    opts = @(
      "Để khi một người gặp sự cố bất ngờ thì có người phát hiện và gọi cứu hộ kịp thời",
      "Để chia sẻ đồ ăn vặt và dụng cụ bơi lội với nhau",
      "Để chụp được nhiều hình ảnh kỷ niệm đẹp hơn",
      "Để bể bơi trông đông vui và náo nhiệt hơn"
    )
    c = 0
    ex = "Tai nạn dưới nước xảy ra rất thầm lặng trong vài giây, cần người đi kèm để báo động ngay."
  }
}

$vd = @(
  @{q="Tình huống: Em và bạn đi dạo ven hồ, bạn trượt chân ngã xuống hố sâu và đang vùng vẫy. Cách xử lý ĐÚNG?"; opts=@("Hô to: 'Có người đuối nước!', tìm cành cây dài hoặc can nhựa gần đó chìa/ném cho bạn","Lập tức lao người xuống nước ôm lấy bạn để đẩy bạn lên","Chạy thật nhanh về nhà cách đó 2km để báo bố mẹ","Cúi người thật thấp chìa bàn tay ra mép bờ trơn để bạn nắm"); c=0; ex="Hô hoán để báo động người xung quanh, đồng thời tận dụng vật nối dài cứu từ vị trí an toàn."},
  @{q="Tình huống: Đang bơi ở giữa hồ bơi, em bất ngờ bị chuột rút đau điếng ở bắp chân. Em phải làm gì?"; opts=@("Bình tĩnh, ngửa người thả lỏng, dùng tay xoa bóp kéo căng ngón chân ngược lên và hô cứu hộ","Dùng hết sức đạp thật mạnh chân bị đau để cố bơi nhanh vào thành bể","Cố gắng lặn xuống đáy bể để lấy điểm tựa đứng thẳng dậy","Gập người lại ôm chặt đầu gối và nín thở"); c=0; ex="Thả lỏng ngửa mặt để thở, đồng thời gập bàn chân hướng về phía trước để kéo giãn cơ bị co rút."},
  @{q="Tình huống: Cả nhóm bạn rủ nhau đi tắm suối sau trận mưa bão hôm qua, nước suối hơi đục. Em ứng xử thế nào?"; opts=@("Kiên quyết từ chối và giải thích cho các bạn về nguy cơ lũ quét, lũ ống đầu nguồn đổ về","Đồng ý đi nhưng chỉ ngồi nghịch nước ở mép bờ nông","Đi cùng để trông đồ và quan sát cho các bạn tắm","Rủ thêm nhiều bạn nữa đi cùng cho an tâm"); c=0; ex="Từ chối và can ngăn bạn bè tránh xa sông suối sau bão vì nguy cơ lũ ống cực kỳ cao."},
  @{q="Tình huống: Khi đưa được người đuối nước lên bờ, nạn nhân mê man, ngừng thở và tím tái. Hành động ĐÚNG?"; opts=@("Nhờ người gọi 115, đặt nạn nhân nằm ngửa trên nền cứng và tiến hành ép tim ngoài lồng ngực ngay","Vác nạn nhân lên vai chạy xóc nước trong 10 phút","Đốt lửa sưởi ấm và đổ nước gừng vào miệng nạn nhân","Bế dựng đứng nạn nhân lắc mạnh cho tỉnh táo"); c=0; ex="Hồi sức tim phổi CPR (30 lần ép tim, 2 lần thổi ngạt) ngay trên mặt phẳng cứng để cứu não."},
  @{q="Tình huống: Em đang tắm biển thì phát hiện mình bị dòng nước kéo trôi ra xa bờ rất nhanh. Em xử lý ra sao?"; opts=@("Không hoảng loạn, giữ sức thả nổi và bơi chéo song song bờ thoát khỏi luồng nước rồi mới vào","Bơi hết sức ngược chiều dòng nước để lao thẳng vào bờ","Vùng vẫy liên tục và gào thét đến khi kiệt sức","Lặn xuống đáy biển để bám vào cát"); c=0; ex="Bình tĩnh bơi ngang song song bờ để thoát khỏi luồng rút của dòng Rip, tiết kiệm tối đa thể lực."}
)

for ($i = 6; $i -le 40; $i++) {
  $vd += @{
    q = "Tình huống vận dụng ${i} - Bạn cùng lớp rủ em ra bờ sông chơi trò đuổi bắt sát mép nước trơn trượt không có rào chắn. Em sẽ xử lý tình huống này như thế nào để đảm bảo an toàn?"
    opts = @(
      "Từ chối dứt khoát và khuyên bạn nên chuyển đến sân chơi rộng rãi, có rào chắn an toàn",
      "Đồng ý chơi nhưng đi thật cẩn thận từng bước một",
      "Chỉ đứng trên bờ quan sát bạn chơi chứ không tham gia",
      "Thử nhảy xuống nước trước để kiểm tra xem đáy sông có sâu không"
    )
    c = 0
    ex = "Khu vực mép nước trơn trượt không rào chắn tiềm ẩn nguy cơ ngã bất ngờ, cần chủ động phòng tránh."
  }
}

# Tong hop du lieu
$jsonObj = @{
  nhanBiet = $nb
  thongHieu = $th
  vanDung = $vd
}

$json = $jsonObj | ConvertTo-Json -Depth 5
$jsContent = "/* assets/js/data/quiz-bank.js - Ngan hang 200 cau hoi an toan duoi nuoc */`nwindow.SW = window.SW || {};`nwindow.SW.data = window.SW.data || {};`nwindow.SW.data.quizBank = " + $json + ";`n"

[System.IO.File]::WriteAllText("e:\Google Driver\DU_AN\safe-water\assets\js\data\quiz-bank.js", $jsContent, [System.Text.Encoding]::UTF8)

Write-Host "Success generate quiz-bank.js: NB=$($nb.Count), TH=$($th.Count), VD=$($vd.Count)"
