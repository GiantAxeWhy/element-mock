// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// const vscode = require("vscode");

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed

// /**
//  * @param {vscode.ExtensionContext} context
//  */
// function activate(context) {
//   // Use the console to output diagnostic information (console.log) and errors (console.error)
//   // This line of code will only be executed once when your extension is activated
//   console.log('Congratulations, your extension "element-mock" is now active!');

//   // The command has been defined in the package.json file
//   // Now provide the implementation of the command with  registerCommand
//   // The commandId parameter must match the command field in package.json
//   let disposable = vscode.commands.registerCommand(
//     "extension.generateTableData",
//     function () {
//       // The code you place here will be executed every time your command is executed

//       // Display a message box to the user
//       vscode.window.showInformationMessage("Hello World from element-mock!");
//     }
//   );

//   context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// function deactivate() {}

// module.exports = {
//   activate,
//   deactivate,
// };
const vscode = require("vscode");
// class TableDataCodeLensProvider {
//   provideCodeLenses(document, token) {
//     const codeLenses = [];
//     const text = document.getText();
//     const elTableColumnRegex =
//       /<el-table-column[\s\S]*?prop="([^"]+)"[\s\S]*?label="([^"]+)"/g;
//     let match;
//     while ((match = elTableColumnRegex.exec(text))) {
//       const prop = match[1];
//       const label = match[2];
//       const range = new vscode.Range(
//         document.positionAt(match.index),
//         document.positionAt(match.index + match[0].length)
//       );
//       const command = {
//         title: "生成表格数据",
//         command: "extension.generateTableData",
//         arguments: [prop, label],
//       };
//       const codeLens = new vscode.CodeLens(range, command);
//       codeLenses.push(codeLens);
//     }
//     return codeLenses;
//   }
// }

// 解析 <el-table-column> 代码块，提取属性和标签信息
function parseTableColumns(selectedText) {
  const columns = [];

  // 此处示例简化，你需要根据实际情况编写正则表达式或其他解析逻辑
  const propMatch = /prop="([^"]+)"/g;
  const labelMatch = /label="([^"]+)"/g;

  let prop, label;
  while (
    (prop = propMatch.exec(selectedText)) !== null &&
    (label = labelMatch.exec(selectedText)) !== null
  ) {
    const column = {
      prop: prop[1],
      label: label[1],
    };
    columns.push(column);
  }

  return columns;
}

function generateTableData() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("没有打开的文本编辑器。");
    return;
  }

  const selectedText = editor.document.getText(editor.selection);

  // 解析选中的文本，提取 <el-table-column> 代码块的属性和标签
  const tableColumns = parseTableColumns(selectedText);

  // 合并属性和标签为一个对象
  const mergedData = {};
  tableColumns.forEach((column) => {
    mergedData[column.prop] = column.label;
  });

  // 创建包含合并数据的数组
  const tableData = [mergedData];

  const tableDataString = JSON.stringify(tableData, null, 2);
  // // 解析选中的文本，提取 prop 属性
  // const propMatches = selectedText.match(/prop="([^"]+)"/g);
  // //提取label属性
  // const labelMatches = selectedText.match(/label="([^"]+)"/g);

  // if (!propMatches) {
  //   vscode.window.showErrorMessage(
  //     "没有找到 prop 属性。请确保选择了 el-table-column 代码片段。"
  //   );
  //   return;
  // }

  // const tableData = [];
  // propMatches.forEach((match, index) => {
  //   const propValue = match.match(/prop="([^"]+)"/)[1];
  //   const labelValue = labelMatches[index].match(/label="([^"]+)"/)[1];
  //   tableData.push({
  //     [propValue]: labelValue,
  //   });
  // });
  // console.log("tableData", tableData);
  // // 使用 Array.map 和 Object.assign 合并对象
  // const mergedObject = tableData.reduce(
  //   (acc, obj) => Object.assign(acc, obj),
  //   {}
  // );
  // console.log("mergedObject", mergedObject);
  // // 将合并后的对象放入新的数组
  // const newArray = [mergedObject];

  // const tableDataString = JSON.stringify(newArray);

  editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.end, "/n" + tableDataString);
  });
  // const tableData = [
  //   {
  //     [prop]: label,
  //   },
  // ];
  // const tableDataString = JSON.stringify(tableData, null, 2);
  // editor.edit((editBuilder) => {
  //   editBuilder.insert(editor.selection.end, "\n" + tableDataString);
  // });

  vscode.window.showInformationMessage("已生成表格数据。");
}

function activate(context) {
  // let codeLensProvider = new TableDataCodeLensProvider();
  let disposable = vscode.commands.registerCommand(
    "extension.generateTableData",
    generateTableData
  );

  const contextMenuDisposable = vscode.languages.registerCodeActionsProvider(
    "vue",
    {
      provideCodeActions(document, range) {
        const codeAction = new vscode.CodeAction(
          "Generate Table Data",
          vscode.CodeActionKind.Empty
        );

        codeAction.command = {
          command: "extension.generateTableData",
          title: "Generate Table Data",
          tooltip:
            "Generate table data based on selected <el-table-column> code",
          arguments: [document.getText(range)], // 将选中的文本传递给命令
        };
        return [codeAction];
      },
    }
  );
  context.subscriptions.push(disposable, contextMenuDisposable);

  //context.subscriptions.push(disposable);
}
exports.activate = activate;
