import './ProductCard.css';

const ProductCard = ({ product, onToggle }) => (
  <div className="card">
    <h4>{product.name}</h4>
    <p>₹{product.price}</p>
    <button onClick={() => onToggle(product)}>
      {product.isPublished ? 'Unpublish' : 'Publish'}
    </button>
  </div>
);

export default ProductCard;
