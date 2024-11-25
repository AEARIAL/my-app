import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './EditProducts.css';
import EditProductModal from './EditProductModal';

const EditProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 1000, image: '' });

  // 初期データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedProducts = localStorage.getItem('products');
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts)); // キャッシュがあればそれを使う
        } else {
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
          localStorage.setItem('products', JSON.stringify(parsedProducts)); // キャッシュに保存
        }
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
      }
    };

    fetchData();
  }, []);

  // CSV取り込み機能
  const handleFileUpload = (file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = Papa.parse(e.target.result, { header: false }).data;

      if (type === 'ItemName') {
        const updatedProducts = data.map((row, index) => ({
          id: index + 1,
          name: row[1] || '',
          description: products[index]?.description || '',
          price: products[index]?.price || '',
          image: products[index]?.image || '',
        }));
        setProducts(updatedProducts);
      } else if (type === 'ItemFlav') {
        const updatedProducts = products.map((product, index) => ({
          ...product,
          description: data[index] ? data[index][1] : product.description,
        }));
        setProducts(updatedProducts);
      }
    };
    reader.readAsText(file);
  };

  // 新規商品の追加
  const handleAddProduct = () => {
    const newId = products.length + 1;
    const updatedProducts = [...products, { ...newProduct, id: newId }];
    setProducts(updatedProducts);
    setNewProduct({ name: '', description: '', price: 4, image: '' });
  };

  // 編集データの保存
  const handleSaveEdit = (updatedProduct) => {
    const updatedProducts = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // キャッシュに保存
    setEditProduct(null);
  };

  // CSV保存機能
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

  // CSV取り込みボタンをトリガーするための関数
  const triggerFileInput = (fileInputId) => {
    document.getElementById(fileInputId).click();
  };

  return (
    <div className="edit-products">
      <h2>商品の追加・変更</h2>

      {/* コントロールセクション: CSV取り込み、出力、編集 */}
      <div className="controls">
        <div className="section">
          <h3>CSV取り込み</h3>
          <div>
            <label htmlFor="itemNameCSV">商品名CSV:</label>
            <input
              type="file"
              id="itemNameCSV"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files[0], 'ItemName')}
            />
            <button onClick={() => triggerFileInput('itemNameCSV')}>商品名CSVを選択</button>
          </div>
          <div>
            <label htmlFor="itemFlavCSV">商品説明CSV:</label>
            <input
              type="file"
              id="itemFlavCSV"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files[0], 'ItemFlav')}
            />
            <button onClick={() => triggerFileInput('itemFlavCSV')}>商品説明CSVを選択</button>
          </div>
        </div>

        <div className="section">
          <h3>CSVを出力</h3>
          <button onClick={handleDownloadCSV}>CSVを出力</button>
        </div>

        <div className="section">
          <h3>新規商品追加</h3>
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
      </div>

      {/* 商品リスト */}
      <h2>商品一覧</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-item" onClick={() => setEditProduct(product)}>
            {product.image && <img src={product.image} alt={product.name} className="product-image" />}
            <h3>{product.name}</h3>
            <p>{product.description}</p>
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
