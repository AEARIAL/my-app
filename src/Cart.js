import React, { useState, useEffect } from 'react';
import './Cart.css'; // カートのスタイルを追加

const Cart = ({ cartItems, setCartItems }) => {
  const [showPopup, setShowPopup] = useState(false); // ポップアップの表示状態
  const [selectedItem, setSelectedItem] = useState(null); // 選択されたアイテム

  // 合計金額の計算
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // カートの内容をローカルストレージに保存
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); // カートの内容を保存
    }
  }, [cartItems]);

  // ページリロード後にカートの内容を復元
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      setCartItems(storedCartItems); // ローカルストレージからカートの内容を読み込む
    }
  }, [setCartItems]);

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
          <table className="cart-item-table">
            <thead>
              <tr>
                <th>商品画像</th>
                <th>商品名</th>
                <th>価格</th>
                <th>数量</th>
                <th>小計</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value, 10))
                      }
                    />
                  </td>
                  <td>{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="remove-button"
                      onClick={(e) => {
                        e.stopPropagation(); // 親のクリックイベントを防止
                        handleRemoveItem(item.id);
                      }}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
