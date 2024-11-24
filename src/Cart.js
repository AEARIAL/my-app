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

  const handleRemoveItem = (itemId) => {
    // 指定されたIDの商品を削除
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems); // カートアイテムを更新
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
              <li
                key={item.id}
                className="cart-item"
                onClick={() => handleItemClick(item)}
              >
                {/* 商品画像と商品名 */}
                <div className="cart-item-image-container">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-name">{item.name}</div>
                </div>

                {/* 単価と数量 */}
                <div className="cart-item-pricing">
                  <p>Cost: {item.price}</p>
                  <p>数量: {item.quantity}</p>
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
