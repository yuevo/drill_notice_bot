function dorillBot(){
  // WebhookURLを追加
  let testPostUrl = "ここにWebhookURLを追加する";　
  // botを投入したいチャンネル名を追加
  let testPostChannel = "#ここにチャンネル名を追加する"; 

  // 今月のシートを取得する
  var drillSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('rubyドリル');

  var member_lists = drillSheet.getSheetValues(2, 3, 4, 3);
  var hirukai_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シフトシート');
  // メンバーの情報を取得
  let shift_lists = hirukai_sheet.getSheetValues(4, 1 + this_day, 4, 1);
  // 今日出勤のメンバーを取得
  shift_lists.forEach( function(shift, i) {
    if (shift == "外A" || shift == "外B" || shift == "外C") {
      var name = member_lists[1][i];
      if (member_lists[2][i] >= 37) {
        var drill_result = "clear!";
      } else {
        var drill_result = member_lists[2][i];
      }
      if (member_lists[3][i] >= 35) {
        var ruby_result = "clear!";
      } else {
        var ruby_result = member_lists[3][i];
      }
      sendSlack(name, drill_result, ruby_result)
    };
  });
  
  function sendSlack(name, drill_result, ruby_result) {
    let dorill_url = "https://docs.google.com/spreadsheets/d/1lKiDDz87K02CXV3vspusWQOcO8oG_PEKHp06ZakYq4c/edit#gid=620888759"

    if (drill_result != "clear!") {
      if (drill_result < 37) {
        var target_drill = drill_result + 5
        if (target_drill > 37) {
          var target_drill = 37
        }
      }
    }
    if (ruby_result != "clear!") {
      if (ruby_result < 35) {
        var target_ruby = ruby_result + 5
        if (target_ruby > 35) {
          var target_ruby = 35
        }
      }
    }

    if (drill_result != "clear!" && ruby_result != "clear!") {
    sendHttpPost_('こんにちは！ドリル進捗botです:ruby_icon:\
                \n' + name + 'さん\
                \n↓現在のドリル進捗はこちらです↓\
                \n```定着ドリル：' + drill_result + '/37\
                \nrubyドリル：' + ruby_result + '/35```\
                \n↓今週の学習目標はこちらです↓\
                \n```定着ドリル：' + target_drill + '/37\
                \nrubyドリル：' + target_ruby + '/35```\
                \n３月末迄にドリルの学習を終了させましょう！\
                \nドリルURL：' + dorill_url +'','ドリル進捗bot',':ruby_icon:');
    } else {
      // 両方クリア済みなので投稿しない
      return;
    }

        // ポストするための記述
    function sendHttpPost_(message, username, icon) {
      let jsonData = {
        "channel" : testPostChannel,
        "username" : username,
        "icon_emoji": icon,
        "text" : message
      };
      let payload = JSON.stringify(jsonData);
      let options = {
        "method" : "post",
        "contentType" : "application/json",
        "payload" : payload
      };
      UrlFetchApp.fetch(testPostUrl, options);
    }
  }
};
