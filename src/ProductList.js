import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import QuantityPopup from './QuantityPopup';
import './ProductList.css';

const ProductList = ({ addToCart, activeTab }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [displaySize, setDisplaySize] = useState('medium');

  const fetchData = async () => {
    setLoading(true);
    const cachedProducts = localStorage.getItem('products');
    if (cachedProducts) {
      const productsData = JSON.parse(cachedProducts);
      const sortedProducts = productsData.sort((a, b) => a.name.localeCompare(b.name)); // 名称順にソート
      setProducts(sortedProducts);
      setFilteredProducts(sortedProducts); // 初期値を設定
    } else {
      try {
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
          image: `https://aearial.github.io/my-app/items/${index + 1}.png`,
          price: index % 5 + 3,
        }));
        const sortedProducts = parsedProducts.sort((a, b) => a.name.localeCompare(b.name)); // 名称順にソート
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts); // 初期値を設定
        localStorage.setItem('products', JSON.stringify(sortedProducts));
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
      }
    }
    setLoading(false);
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      return (
        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        product.price >= minPrice &&
        product.price <= maxPrice
      );
    });

    if (sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    if (activeTab === 'products') {
      fetchData(); // 商品データをロード
    }
  }, [activeTab]);

  useEffect(() => {
    filterAndSortProducts(); // フィルタリングとソートを適用
  }, [products, searchQuery, minPrice, maxPrice, sortOrder]);

  if (loading) {
    return <div>データを読み込んでいます...</div>;
  }

  return (
    <div className="product-list-container">
      {/* 検索・ソート・表示サイズ変更ボタン */}
      <div className="product-list-controls">
        <button onClick={() => setSortOrder('asc')}>価格昇順</button>
        <button onClick={() => setSortOrder('desc')}>価格降順</button>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="商品名・説明で検索"
        />

        <button onClick={() => setDisplaySize('small')}>小</button>
        <button onClick={() => setDisplaySize('medium')}>中</button>
        <button onClick={() => setDisplaySize('large')}>大</button>
      </div>

      {/* 商品リスト */}
      <div className="product-list-wrapper">
        <h2>商品一覧</h2>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-item-card"
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                style={{
                  width: displaySize === 'small' ? '70px' : displaySize === 'medium' ? '90px' : '120px',
                  height: displaySize === 'small' ? '70px' : displaySize === 'medium' ? '90px' : '120px',
                }}
              />
              <h3
                style={{
                  fontSize: displaySize === 'small' ? '1.2rem' : displaySize === 'medium' ? '1.5rem' : '1.8rem',
                }}
              >
                {product.name}
              </h3>
              <p
                style={{
                  fontSize: displaySize === 'small' ? '0.8rem' : displaySize === 'medium' ? '1rem' : '1.2rem',
                }}
              >
                {product.description}
              </p>
              <p>Cost: {product.price}</p>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <QuantityPopup
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            addToCart={addToCart}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
