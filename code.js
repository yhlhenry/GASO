function doGet() {
  return HtmlService.createHtmlOutputFromFile("index.html");
}

function getGraphData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const nodeSheet = ss.getSheetByName("Node");
  const edgeSheet = ss.getSheetByName("Edge");

  // A=Node Id, B=Label, C=Attribute, D=Status, E=Prompt (新增提示欄位)
  const nodes = nodeSheet.getRange(2, 1, nodeSheet.getLastRow() - 1, 5).getValues();
  const edges = edgeSheet.getRange(2, 1, edgeSheet.getLastRow() - 1, 2).getValues();

  let dot = `
    digraph G {
      graph [splines=curved];
      graph [overlap=false];
    `;

  // 儲存節點詳細資訊
  const nodeDetails = [];

  nodes.forEach(([id, label, attr, status, prompt]) => {
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
      nodeDetails.push({
        id: id,
        label: label,
        attribute: attr || "",
        status: status || "",
        statusText: statusText,
        prompt: prompt || `這是 ${label} 節點的詳細說明。`,
        color: color
      });

      // 如果 Attribute 有值，直接拼進去
      let extra = attr ? `, ${attr}` : "";
      dot += `  ${id} [label="${label}", style=filled, fillcolor="${color}"${extra}];\n`;
    }
  });

  edges.forEach(([src, tgt]) => {
    if (src && tgt) {
      dot += `  ${src} -> ${tgt};\n`;
    }
  });

  dot += "}";

  // 返回 DOT 語法和節點詳細資訊
  return {
    dot: dot,
    nodeDetails: nodeDetails
  };
}