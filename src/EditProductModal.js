import React, { useState } from 'react';
import './EditProductModal.css';

const EditProductModal = ({ product, onSave, onClose }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

  const handleChange = (field, value) => {
    setUpdatedProduct({ ...updatedProduct, [field]: value });
  };

  const handleSave = () => {
    onSave(updatedProduct);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>商品を編集</h2>
        <div className="form-group">
          <label>商品名</label>
          <input
            type="text"
            value={updatedProduct.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>説明</label>
          <textarea
            value={updatedProduct.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows="5"
          />
        </div>
        <div className="form-group">
          <label>価格</label>
          <input
            type="number"
            value={updatedProduct.price}
            onChange={(e) => handleChange('price', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>画像URL</label>
          <input
            type="text"
            value={updatedProduct.image}
            onChange={(e) => handleChange('image', e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button onClick={handleSave}>保存</button>
          <button onClick={onClose}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
