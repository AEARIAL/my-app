import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import QuantityPopup from './QuantityPopup';
import './ProductList.css';

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態

  // CSVファイルを読み込み、商品の情報を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 商品名のCSV読み込み
        const itemNameResponse = await fetch('/items/ItemName.csv');
        const itemNameText = await itemNameResponse.text();
        const itemNameData = Papa.parse(itemNameText, { header: false }).data;

        // 商品説明のCSV読み込み
        const itemFlavResponse = await fetch('/items/ItemFlav.csv');
        const itemFlavText = await itemFlavResponse.text();
        const itemFlavData = Papa.parse(itemFlavText, { header: false }).data;

        // 商品名と説明を統合して商品リストを作成
        const parsedProducts = itemNameData.map((row, index) => ({
          id: index + 1,
          name: row[1],  // ITEMx_NAME
          description: itemFlavData[index] ? itemFlavData[index][1] : '説明なし',  // ITEMx_FLAV
          image: `/items/${index + 1}.png`,  // 商品画像のパス修正
          price: 3,
        }));

        setProducts(parsedProducts);  // 商品リストの設定
        setLoading(false); // データ読み込み完了
      } catch (error) {
        console.error("データの読み込みに失敗しました:", error);
        setLoading(false);
      }
    };

    fetchData();  // データを読み込む
  }, []);  // コンポーネントがマウントされるときに実行

  // 商品リストの表示
  if (loading) {
    return <div>データを読み込んでいます...</div>;  // ローディング中の表示
  }

  return (
    <div className="product-list">
      <h2>商品一覧</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>{product.description}</p>  {/* 商品説明の表示 */}
            <p>Cost:{product.price}</p>
            <button onClick={() => setSelectedProduct(product)}>選択</button>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <QuantityPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}  // 親コンポーネントからのカート追加関数
        />
      )}
    </div>
  );
};

export default ProductList;
