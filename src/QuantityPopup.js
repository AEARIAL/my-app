// QuantityPopup.js
import React, { useState } from 'react';
import './QuantityPopup.css';  // ポップアップ用のスタイル

const QuantityPopup = ({ product, onClose, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart({ ...product, quantity });  // descriptionも渡されるようになっています
      onClose();  // ポップアップを閉じる
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{product.name}の数量を選択</h2>
        <p>Cost: {product.price}</p>
        <p>{product.description}</p> {/* 商品の説明を追加 */}
        <label>
          数量:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="quantity-input"
          />
        </label>
        <button onClick={handleAddToCart} className="add-to-cart-button">
          カートに追加
        </button>
        <button onClick={onClose} className="close-button">
          閉じる
        </button>
      </div>
    </div>
  );
};

export default QuantityPopup;
