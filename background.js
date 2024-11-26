chrome.runtime.onInstalled.addListener(() => {
  fetch(chrome.runtime.getURL('answer_utf8.json'))
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({questions: data}, () => {
        console.log('Local data loaded into chrome.storage.local');
      });
    })
    .catch(error => console.error('Failed to load local data:', error));
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "searchText") {
    findAnswer(request.text, sendResponse);
    return true;  
  }
});

function checkStringType(str) {
  // 正则表达式匹配只包含大写英文字母 A-Z 的字符串
  if (/^[A-Z]+$/.test(str)) {
    return "Only uppercase English letters A-Z";
  }

  // 正则表达式匹配只包含中文字符的字符串
  else if (/^[\u4e00-\u9fff]+$/.test(str)) {
    return "Only Chinese characters";
  }

  else {
    return "Mixed or other characters";
  }
}

// search for the answer to the question
function findAnswer(text, sendResponse) {
  chrome.storage.local.get('questions', (data) => {
    let questions = data.questions || [];

    const rx = /】\s*(.*?)(?=\(\d+\.\d+分\))/;
    const match_result = text.match(rx);

    // 检查是否有匹配结果
    if (match_result && match_result[1]) {
        // 如果有匹配，输出清理后的内容
        text = match_result[1].trim();
    } else {
        // 如果没有找到匹配项，保持原字符串不变
        text = text.trim();
    }
    text = text.replace(/\(\d+\.\d+分\)$/, '');

    console.log(text);
    console.log(questions);

    let result = questions.find(question => question.description && question.description.includes(text));
    //console.log(result);

    if (result) {
      let responseText = 'You searched for: ' + result.description + "\n -------------------" // 加入问题描述
      // if answer key is from A to Z, then parse
      let answerKey = result.answer || ''; // 获取 answer 字符串，例如 "AB"
      //console.log(answerKey);
      if (checkStringType(answerKey) === "Only uppercase English letters A-Z") {
        // 遍历 answer 字符串中的每个字符
        let cnt = 0;
        for (let i = 0; i < answerKey.length; i++) {
          let option = answerKey.charAt(i); // 获取选项字母，如 'A' 或 'B'
          if (result[option]) { // 检查该选项是否存在
            cnt++;
            responseText += `\n${cnt}. ${result[option]}`; // 如果存在，添加到响应字符串
          }
        }
      } else if (checkStringType(answerKey) === "Only Chinese characters") {
        responseText += `\n${result.answer}`;
      } else {
        responseText += `\n${result.answer}`;
      }
      sendResponse({answer: responseText});
    } else {
      sendResponse({answer: "No match found"});
    }
  });
}

