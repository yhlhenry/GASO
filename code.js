function doGet() {
  return HtmlService.createHtmlOutputFromFile("index.html");
}

function getGraphData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const nodeSheet = ss.getSheetByName("Node");
  const edgeSheet = ss.getSheetByName("Edge");

  // A=Node Id, B=Label, C=Attribute, D=Status
  const nodes = nodeSheet.getRange(2, 1, nodeSheet.getLastRow() - 1, 4).getValues();
  const edges = edgeSheet.getRange(2, 1, edgeSheet.getLastRow() - 1, 2).getValues();

  let dot = `
    digraph G {
      graph [splines=curved];
      graph [overlap=false];
    `;

  nodes.forEach(([id, label, attr, status]) => {
    if (id && label) {
      let color = "white";
      switch (status) {
        case "ToDo": color = "lightgray"; break;
        case "InProgress": color = "gold"; break;
        case "Done": color = "lightgreen"; break;
      }

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

  return dot;
}