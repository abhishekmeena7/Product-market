import { useEffect, useState } from 'react';
import { getProducts, togglePublish, deleteProduct } from '../../services/api';
import './Home.css';

const Home = ({ setPage }) => {
  const [tab, setTab] = useState('Published');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (e) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isPub = tab === 'Published';
  const filtered = products.filter(p => !!p.isPublished === isPub);

  const formatPrice = (p) => {
    const sp = p.sellingPrice ?? p.price ?? 0;
    const mrp = p.mrp ?? null;
    let discount = null;
    if (mrp && sp && mrp > sp) {
      discount = Math.round(((mrp - sp) / mrp) * 100);
    }
    return { sp, mrp, discount };
  };

  const handleToggle = async (p) => {
    await togglePublish(p._id, !p.isPublished);
    setProducts(prev => prev.map(x => x._id === p._id ? { ...x, isPublished: !x.isPublished } : x));
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(x => x._id !== id));
    } catch (e) {
      setError('Failed to delete product');
    }
  };

  const handleEdit = (p) => {
    try {
      localStorage.setItem('editProduct', JSON.stringify(p));
    } catch {}
    if (setPage) setPage('products');
  };

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">Products</h1>
          <div className="home-tabs">
            <button className={`tab ${tab === 'Published' ? 'active' : ''}`} onClick={() => setTab('Published')}>Published</button>
            <button className={`tab ${tab === 'Unpublished' ? 'active' : ''}`} onClick={() => setTab('Unpublished')}>Unpublished</button>
          </div>
        </div>

        {loading && (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="product-card skeleton" key={i}>
                <div className="card-image" />
                <div className="card-body">
                  <div className="line" />
                  <div className="line short" />
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <div className="home-empty error">{error}</div>}

        {!loading && (
          <div className="products-grid">
            {filtered.map(p => {
              const img = Array.isArray(p.images) && p.images.length ? p.images[0] : '';
              const { sp, mrp, discount } = formatPrice(p);
              return (
                <div key={p._id} className="product-card">
                  <div className="product-media">
                    {img ? <img src={img} alt={p.name} /> : <div className="no-image">No Image</div>}
                  </div>
                  <div className="product-info">
                    <h4 className="product-name">{p.name}</h4>
                    <div className="chip-row">
                      <span className={`chip ${p.isPublished ? 'chip-published' : 'chip-unpublished'}`}>{p.isPublished ? 'Published' : 'Unpublished'}</span>
                      {discount ? <span className="chip chip-discount">-{discount}%</span> : null}
                    </div>
                    <div className="product-meta">{p.type} • {p.brandName}</div>
                    <div className="product-prices">
                      {mrp != null && <span className="mrp">MRP: ₹{mrp}</span>}
                      {sp != null && <span className="sp">Selling: ₹{sp}</span>}
                    </div>
                    <div className="product-stats">Qty: {p.quantity} • Stock: {p.stock}</div>
                    <div className="product-eligibility">Exchange/Return: {p.exchangeOrReturnEligible ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="product-actions">
                    <button className="primary" onClick={() => handleToggle(p)}>
                      {p.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button className="secondary" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="secondary" onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="home-empty">
            No products found in {tab}. Create a product in Products.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
