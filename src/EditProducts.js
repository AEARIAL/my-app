import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './EditProducts.css';
import EditProductModal from './EditProductModal';

const EditProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 1000, image: '' });

  // CSVファイルを読み込み、商品の情報を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // キャッシュからデータを読み込む
        const cachedProducts = localStorage.getItem('products');
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts)); // キャッシュがあればそれを使う
        } else {
          // キャッシュがなければCSVから読み込む
          const itemNameResponse = await fetch('https://aearial.github.io/my-app/items/ItemName.csv');
          const itemNameText = await itemNameResponse.text();
          const itemNameData = Papa.parse(itemNameText, { header: false }).data;

          const itemFlavResponse = await fetch('https://aearial.github.io/my-app/items/ItemFlav.csv');
          const itemFlavText = await itemFlavResponse.text();
          const itemFlavData = Papa.parse(itemFlavText, { header: false }).data;

          const parsedProducts = itemNameData.map((row, index) => ({
            id: index + 1,
            name: row[1],
            description: itemFlavData[index] ? itemFlavData[index][1] : '説明なし',
            price: index % 5 + 3, // 仮の価格
            image: `https://aearial.github.io/my-app/items/${index + 1}.png`, // 仮の画像URL
          }));

          setProducts(parsedProducts);
          localStorage.setItem('products', JSON.stringify(parsedProducts)); // CSV読み込み後、キャッシュに保存
        }
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
      }
    };

    fetchData();
  }, []);

  // 編集データの保存
  const handleSaveEdit = (updatedProduct) => {
    const updatedProducts = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // キャッシュに保存
    setEditProduct(null); // モーダルを閉じる
  };

  // 新規商品の追加
  const handleAddProduct = () => {
    const newId = products.length + 1;
    const updatedProducts = [...products, { ...newProduct, id: newId }];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // キャッシュに保存
    setNewProduct({ name: '', description: '', price: 4, image: '' });
  };

  // CSV出力
  const handleDownloadCSV = () => {
    const itemNames = products.map((product) => [product.id, product.name]);
    const itemFlavs = products.map((product) => [product.id, product.description]);

    const itemNameCSV = Papa.unparse(itemNames);
    const itemFlavCSV = Papa.unparse(itemFlavs);

    const downloadCSV = (filename, content) => {
      const link = document.createElement('a');
      link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content);
      link.download = filename;
      link.click();
    };

    downloadCSV('ItemName.csv', itemNameCSV);
    downloadCSV('ItemFlav.csv', itemFlavCSV);
  };

  // サーバー保存機能
  const handleSaveToServer = async () => {
    const itemNames = products.map((product) => [product.id, product.name]);
    const itemFlavs = products.map((product) => [product.id, product.description]);

    const itemNameCSV = Papa.unparse(itemNames);
    const itemFlavCSV = Papa.unparse(itemFlavs);

    try {
      await fetch('http://localhost:3001/save-item-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemNameCSV }),
      });

      await fetch('http://localhost:3001/save-item-flav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemFlavCSV }),
      });

      alert('データが保存されました');
    } catch (error) {
      console.error('保存エラー:', error);
      alert('データの保存に失敗しました');
    }
  };

  return (
    <div className="edit-products">
      <h2>商品の追加‐変更</h2>
      {/* 新規商品追加 */}
      <div className="new-product-form">
        <h3>新規商品を追加</h3>
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          placeholder="商品名"
        />
        <input
          type="text"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          placeholder="説明"
        />
        <input
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          placeholder="価格"
        />
        <input
          type="text"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          placeholder="画像URL"
        />
        <button onClick={handleAddProduct}>商品を追加</button>
      </div>

      {/* 操作ボタン */}
      <div className="action-buttons">
        <button onClick={handleDownloadCSV}>CSVを出力</button>
        <button onClick={handleSaveToServer}>保存</button>
      </div>
      <h2>以下、選択して編集可能</h2>
      {/* 商品リスト */}
      <div className="product-table">
        {products.map((product) => (
          <div key={product.id} className="product-row" onClick={() => setEditProduct(product)}>
            <div className="product-info">
              {product.image && <img src={product.image} alt={product.name} className="product-image" />}
              <span>{product.name}</span>
              <span>{product.description}</span>
              <span>Cost: {product.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 編集モーダル */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onSave={handleSaveEdit}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  );
};

export default EditProducts;
