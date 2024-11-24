import React, { useState } from 'react';
import ProductList from './ProductList';
import Cart from './Cart';
import EditProducts from './EditProducts'; // 新しい編集画面のインポート
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevItems, product];
    });
  };

  return (
    <div>
      {/* タブメニュー */}
      <div className="tab-menu">
        <button
          className={activeTab === 'products' ? 'active-tab' : ''}
          onClick={() => setActiveTab('products')}
        >
          商品一覧
        </button>
        <button
          className={activeTab === 'cart' ? 'active-tab' : ''}
          onClick={() => setActiveTab('cart')}
        >
          カート
        </button>
        <button
          className={activeTab === 'edit' ? 'active-tab' : ''}  // 編集タブを追加
          onClick={() => setActiveTab('edit')}
        >
          編集
        </button>
      </div>

      {/* タブ内容 */}
      <div className="tab-content">
        {activeTab === 'products' && <ProductList addToCart={addToCart} />}
        {activeTab === 'cart' && <Cart cartItems={cartItems} />}
        {activeTab === 'edit' && <EditProducts />}  {/* 編集画面を表示 */}
      </div>
    </div>
  );
};

export default App;