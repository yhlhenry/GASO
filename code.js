function doGet() {
  return HtmlService.createHtmlOutputFromFile("index.html");
}

/**
 * 讀取設定（Script Properties）
 * 可設定：
 * - SPREADSHEET_ID: 資料所在的試算表 ID（若非綁定專案時需要）
 * - BACKGROUND_IMAGE_URL: 背景圖網址（可用雲端硬碟分享連結或其他公開 URL）
 */
function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    spreadsheetId: props.getProperty('SPREADSHEET_ID') || '',
    backgroundImageUrl: props.getProperty('BACKGROUND_IMAGE_URL') || ''
  };
}

/**
 * 取得試算表：
 * - 優先使用 ActiveSpreadsheet（當此專案綁定在試算表時）
 * - 否則使用 Script Properties 的 SPREADSHEET_ID
 */
function getSpreadsheet() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  const { spreadsheetId } = getConfig();
  if (spreadsheetId) return SpreadsheetApp.openById(spreadsheetId);
  throw new Error('找不到可用的試算表。請在 Script Properties 設定 SPREADSHEET_ID，或將此 Apps Script 綁定在目標試算表後再執行。');
}

function getGraphData() {
  const ss = getSpreadsheet();
  const { backgroundImageUrl } = getConfig();
  const nodeSheet = ss.getSheetByName("Node");
  const edgeSheet = ss.getSheetByName("Edge");

  // A=Node Id, B=Label, C=Attribute, D=Status, E=Prompt (新增提示欄位)
  const nodes = nodeSheet.getRange(2, 1, nodeSheet.getLastRow() - 1, 5).getValues();
  const edges = edgeSheet.getRange(2, 1, edgeSheet.getLastRow() - 1, 2).getValues();
  
  console.log("原始 nodes 資料:", nodes);

  let dot = `
    digraph G {
      graph [overlap=false];
    `;

  // 儲存節點詳細資訊
  const nodeDetails = [];
  // 儲存邊的詳細資訊
  const edgeDetails = [];
  // 建立鄰接表用於路徑查找
  const adjacencyList = {};

  nodes.forEach(([id, label, attr, status, prompt]) => {
    console.log(`處理節點: id=${id}, label=${label}, prompt=${prompt}`);
    if (id && label) {
      let color = "white";
      let statusText = "未設定";
      switch (status) {
        case "ToDo": 
          color = "lightgray"; 
          statusText = "待辦";
          break;
        case "InProgress": 
          color = "gold"; 
          statusText = "進行中";
          break;
        case "Done": 
          color = "lightgreen"; 
          statusText = "已完成";
          break;
      }

      // 儲存節點詳細資訊
      const finalPrompt = prompt || `這是 ${label} 節點的詳細說明。`;
      console.log(`節點 ${id} 的最終 prompt:`, finalPrompt);
      
      nodeDetails.push({
        id: id,
        label: label,
        attribute: attr || "",
        status: status || "",
        statusText: statusText,
        prompt: finalPrompt,
        color: color
      });

      // 如果 Attribute 有值，直接拼進去
      let extra = attr ? `, ${attr}` : "";
      // 確保節點 ID 被正確設定，使用引號包圍 ID
      dot += `  "${id}" [label="${label}", style=filled, fillcolor="${color}"${extra}];\n`;
    }
  });

  // 初始化鄰接表
  nodes.forEach(([id]) => {
    if (id) {
      adjacencyList[id] = [];
    }
  });

  edges.forEach(([src, tgt]) => {
    if (src && tgt) {
      // 儲存邊的詳細資訊
      edgeDetails.push({
        source: src,
        target: tgt,
        id: `${src}_${tgt}` // 邊的唯一識別碼
      });
      
      // 建立鄰接表
      if (!adjacencyList[src]) {
        adjacencyList[src] = [];
      }
      adjacencyList[src].push(tgt);
      
      dot += `  "${src}" -> "${tgt}" [id="${src}_${tgt}"];\n`;
    }
  });

  dot += "}";

  console.log("最終 nodeDetails:", nodeDetails);
  console.log("最終 edgeDetails:", edgeDetails);
  console.log("鄰接表:", adjacencyList);
  console.log("生成的 DOT 語法:", dot);
  
  // 返回 DOT 語法、節點詳細資訊、邊詳細資訊和鄰接表
  return {
    dot: dot,
    nodeDetails: nodeDetails,
    edgeDetails: edgeDetails,
    adjacencyList: adjacencyList,
    backgroundImageUrl: backgroundImageUrl
  };
}