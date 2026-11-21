/* data/survey.js – Dữ liệu Phiếu khảo sát nhận thức và kỹ năng SafeWater 4.0 */
window.SW = window.SW || {};
SW.data = SW.data || {};

SW.data.survey = {
  header: {
    title: 'PHIẾU KHẢO SÁT',
    subtitle: 'Khảo sát người dùng hệ sinh thái SafeWater 4.0: nhận thức và kĩ năng phòng, chống đuối nước',
    stage: 'Đợt: Sau trải nghiệm website',
    intro: 'Các em thân mến! Phiếu này giúp nhóm nghiên cứu biết các em đã hiểu gì về phòng, chống đuối nước và đánh giá hệ sinh thái SafeWater 4.0. Đây không phải bài kiểm tra tính điểm, phiếu không ghi tên, các em cứ chọn theo hiểu biết của mình. Cảm ơn các em!'
  },

  partA: {
    grade: {
      label: '1. Em học khối:',
      options: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9', 'Khác']
    },
    swim: {
      label: '2. Em có biết bơi không?',
      options: ['Biết', 'Biết một chút', 'Không biết']
    }
  },

  partB: [
    {
      tcId: 1,
      tcName: 'Tiêu chí 1. Nhận biết khu vực có nguy cơ',
      questions: [
        {
          num: 1,
          q: 'Sau những ngày mưa lớn, nơi nào dưới đây có nguy cơ đuối nước cao nhất?',
          options: [
            'A. Bể bơi nước trong, có người cứu hộ trực',
            'B. Ao nước lặng gần nhà, có rào chắn xung quanh',
            'C. Suối nước đục, chảy xiết, bờ trơn trượt',
            'D. Hồ nước rộng nhưng có biển cảnh báo và người trông coi'
          ],
          correct: 2 // C
        },
        {
          num: 2,
          q: 'Dấu hiệu nào cho thấy khu vực nước KHÔNG an toàn để lại gần?',
          options: [
            'A. Nước trong, nhìn thấy đáy nên chắc chắn nông',
            'B. Có nhiều người đang tắm nên chắc an toàn',
            'C. Bờ dốc, trơn, không rào chắn, không biết độ sâu',
            'D. Mặt nước phẳng lặng, không có sóng'
          ],
          correct: 2 // C
        }
      ]
    },
    {
      tcId: 2,
      tcName: 'Tiêu chí 2. Hiểu nguyên tắc phòng, chống đuối nước',
      questions: [
        {
          num: 3,
          q: 'Nguyên tắc nào sau đây giúp phòng, chống đuối nước ĐÚNG nhất?',
          options: [
            'A. Đi tắm cùng nhóm bạn bằng tuổi là đủ an toàn',
            'B. Chỉ bơi ở nơi quen thuộc, không cần báo ai',
            'C. Chỉ tắm, bơi ở nơi an toàn khi có người lớn biết bơi giám sát',
            'D. Bơi giỏi thì có thể tự đi bơi mà không cần người lớn'
          ],
          correct: 2 // C
        },
        {
          num: 4,
          q: 'Đúng hay sai: “Người biết bơi vẫn có thể bị đuối nước khi gặp nước xoáy, dòng chảy mạnh, chuột rút hoặc kiệt sức”.',
          options: [
            'A. Đúng',
            'B. Sai'
          ],
          correct: 0 // A
        }
      ]
    },
    {
      tcId: 3,
      tcName: 'Tiêu chí 3. Nhận diện tình huống mất an toàn',
      questions: [
        {
          num: 5,
          q: 'Tình huống nào DƯỚI ĐÂY là mất an toàn?',
          options: [
            'A. Học bơi ở bể bơi có huấn luyện viên và áo phao',
            'B. Đứng xem suối ở chỗ có hàng rào chắn',
            'C. Đi trên đường cách xa bờ suối',
            'D. Hai bạn nhỏ ngồi chơi sát mép suối, không có người lớn đi cùng'
          ],
          correct: 3 // D
        },
        {
          num: 6,
          q: 'Dấu hiệu nào cho thấy một người đang đuối nước và cần giúp ngay?',
          options: [
            'A. Vẫy tay, la hét thật to và bơi vòng quanh',
            'B. Nằm ngửa thả lỏng, thở đều',
            'C. Đầu ngửa ra sau, miệng ngang mặt nước, ngoi lên hụp xuống, vùng vẫy yếu, không kêu thành tiếng',
            'D. Lặn xuống rồi nổi lên cười đùa'
          ],
          correct: 2 // C
        }
      ]
    },
    {
      tcId: 4,
      tcName: 'Tiêu chí 4. Lựa chọn phương án ứng xử an toàn',
      questions: [
        {
          num: 7,
          q: 'Sau cơn mưa lớn, em và bạn phải đi qua suối, nước đang dâng nhanh nhưng mới ngang đầu gối. Em chọn:',
          options: [
            'A. Cố băng qua thật nhanh vì nước còn thấp',
            'B. Nắm tay nhau thành hàng rồi cùng lội qua',
            'C. Chờ vài phút xem nước có xuống không rồi mới qua',
            'D. Không băng qua, đứng xa mép nước, quay lại và báo người lớn'
          ],
          correct: 3 // D
        },
        {
          num: 8,
          q: 'Quả bóng của em rơi xuống ao sâu, còn cách bờ không xa. Em nên:',
          options: [
            'A. Nằm sấp trên bờ, với tay hoặc cành cây để lấy bóng',
            'B. Đứng sát mép bờ, nhoài người ra để lấy bóng',
            'C. Rủ thêm bạn, một bạn giữ tay bạn kia để lấy bóng',
            'D. Không nhoài người hay xuống nhặt, nhờ người lớn giúp'
          ],
          correct: 3 // D
        }
      ]
    },
    {
      tcId: 5,
      tcName: 'Tiêu chí 5. Biết báo người lớn và tìm trợ giúp',
      questions: [
        {
          num: 9,
          q: 'Thấy một bạn đang chới với dưới nước, việc em làm ĐẦU TIÊN là:',
          options: [
            'A. Chạy về nhà gọi bố mẹ rồi quay lại',
            'B. Gọi điện thoại hoặc nhắn tin cho bạn bè đến giúp',
            'C. Quan sát kĩ xem bạn có thật sự đuối nước không rồi mới báo',
            'D. Hô to gọi người lớn, nhờ người lớn gọi cấp cứu và cứu hộ'
          ],
          correct: 3 // D
        },
        {
          num: 10,
          q: 'Số tổng đài bảo vệ trẻ em, em có thể gọi khi cần giúp đỡ, là số nào?',
          options: [
            'A. 113',
            'B. 111',
            'C. 115',
            'D. 114'
          ],
          correct: 1 // B
        }
      ]
    },
    {
      tcId: 6,
      tcName: 'Tiêu chí 6. Không tự ý xuống nước cứu người',
      questions: [
        {
          num: 11,
          q: 'Thấy bạn đuối nước ở suối, em chưa biết cách cứu hộ. Em nên:',
          options: [
            'A. Nhảy xuống kéo bạn vào bờ rồi mới gọi người lớn',
            'B. Xuống nước nhưng bám vào một gốc cây ven bờ để kéo bạn',
            'C. Rủ thêm bạn khác cùng xuống nước để kéo bạn lên',
            'D. Không nhảy xuống; gọi người lớn và chìa gậy hoặc ném phao, vật nổi khi đứng ở chỗ chắc chắn, an toàn'
          ],
          correct: 3 // D
        },
        {
          num: 12,
          q: 'Vì sao KHÔNG nên tự ý nhảy xuống nước cứu người khi chưa biết cứu hộ?',
          options: [
            'A. Vì nước lạnh làm em bị co cứng cơ',
            'B. Vì sẽ làm bạn hoảng sợ hơn',
            'C. Vì người đuối nước có thể bám, ghì chặt khiến người cứu cũng bị chìm và đuối nước',
            'D. Vì người lớn sẽ la mắng em'
          ],
          correct: 2 // C
        }
      ]
    }
  ],

  partC: {
    q13: {
      num: 13,
      q: 'Em thích học nội dung phòng, chống đuối nước bằng hình thức nào? (chọn tối đa 2)',
      options: ['Kiến thức', 'Trò chơi', 'Trợ lý AI', 'Tình huống tương tác', 'Khác'],
      maxSelect: 2
    },
    q14: {
      num: 14,
      q: 'Ý kiến góp ý thêm (nếu có):',
      placeholder: 'Nhập cảm nhận hoặc đề xuất cải tiến của em dành cho website SafeWater...'
    }
  }
};
