import React, { useState } from 'react';
import './Cart.css'; // カートのスタイルを追加

const Cart = ({ cartItems, setCartItems }) => {
  const [showPopup, setShowPopup] = useState(false); // ポップアップの表示状態
  const [selectedItem, setSelectedItem] = useState(null); // 選択されたアイテム

  // 合計金額の計算
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleItemClick = (item) => {
    setSelectedItem(item); // アイテムを選択
    setShowPopup(true); // ポップアップを表示
  };

  const handleClosePopup = () => {
    setShowPopup(false); // ポップアップを閉じる
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // 0以下の数量を無効化
    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);
  };

  return (
    <div className="cart">
      <h2>カート</h2>

      {cartItems.length === 0 ? (
        <p>カートにアイテムがありません。</p>
      ) : (
        <div className="cart-items">
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                {/* 商品画像と商品名 */}
                <div className="cart-item-image-container">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    onClick={() => handleItemClick(item)} // 画像部分クリックで発火
                  />
                  <div
                    className="cart-item-name"
                    onClick={() => handleItemClick(item)} // 商品名部分クリックで発火
                  >
                    {item.name}
                  </div>
                </div>

                {/* 単価と数量 */}
                <div className="cart-item-pricing">
                  <p>Cost: {item.price}</p>
                  <div>
                    数量:{' '}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value, 10))
                      }
                    />
                  </div>
                </div>

                {/* 小計 */}
                <div className="cart-item-subtotal">
                  小計: {item.price * item.quantity}
                </div>

                {/* 削除ボタン */}
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation(); // 親のクリックイベントを防止
                    handleRemoveItem(item.id);
                  }}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            <h3>合計Cost: {totalAmount}</h3>
            <button className="checkout-button">購入手続きへ進む</button>
          </div>
        </div>
      )}

      {/* ポップアップ */}
      {showPopup && selectedItem && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedItem.name}</h3>
            <p>{selectedItem.description}</p>
            <p>
              <strong>Cost:</strong> {selectedItem.price}
            </p>
            <button className="close-button" onClick={handleClosePopup}>
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
