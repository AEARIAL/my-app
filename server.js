const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// JSONリクエストボディの解析用
app.use(express.json());

// CSVファイルを保存するディレクトリ
const itemsDirectory = path.join(__dirname, 'items');

// もしディレクトリがない場合は作成
if (!fs.existsSync(itemsDirectory)) {
  fs.mkdirSync(itemsDirectory);
}

// POSTリクエストでCSVを受け取り、保存する処理
app.post('/save-item-name', (req, res) => {
  const { itemNameCSV } = req.body;  // クライアントから送られてきたCSVデータ
  if (!itemNameCSV) {
    return res.status(400).send('ItemName CSV is missing');
  }

  // ItemName.csvの保存
  const filePath = path.join(itemsDirectory, 'ItemName.csv');
  fs.writeFile(filePath, itemNameCSV, (err) => {
    if (err) {
      return res.status(500).send('Error saving ItemName.csv');
    }
    res.send('ItemName.csv saved successfully');
  });
});

app.post('/save-item-flav', (req, res) => {
  const { itemFlavCSV } = req.body;  // クライアントから送られてきたCSVデータ
  if (!itemFlavCSV) {
    return res.status(400).send('ItemFlav CSV is missing');
  }

  // ItemFlav.csvの保存
  const filePath = path.join(itemsDirectory, 'ItemFlav.csv');
  fs.writeFile(filePath, itemFlavCSV, (err) => {
    if (err) {
      return res.status(500).send('Error saving ItemFlav.csv');
    }
    res.send('ItemFlav.csv saved successfully');
  });
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
