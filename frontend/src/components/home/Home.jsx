import React, { useEffect, useMemo, useState } from 'react';
import './Home.css';

const initialForm = {
  name: '',
  type: '',
  quantity: '',
  stock: '',
  mrp: '',
  sellingPrice: '',
  brandName: '',
  images: [''],
  exchangeOrReturnEligible: false,
};

const Home = () => {
  // Backend base from env; empty string keeps Vite proxy working in dev
  const BACKEND_BASE = import.meta.env?.VITE_BACKEND_URL || '';
  const [page, setPage] = useState('Home'); // 'Home' | 'Products'
  const [activeTab, setActiveTab] = useState('Published'); // 'Published' | 'Unpublished'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // product or null
  const [form, setForm] = useState(initialForm);

  // Fetch products when on Home page (list lives on Home)
  useEffect(() => {
    if (page !== 'Home') return;
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${BACKEND_BASE}/api/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : (data.products || []));
      } catch (e) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  const visibleProducts = useMemo(() => {
    const published = activeTab === 'Published';
    return products.filter(p => !!p.isPublished === published);
  }, [products, activeTab]);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || '',
      type: p.type || '',
      quantity: String(p.quantity ?? ''),
      stock: String(p.stock ?? ''),
      mrp: String(p.mrp ?? ''),
      sellingPrice: String(p.sellingPrice ?? ''),
      brandName: p.brandName || '',
      images: Array.isArray(p.images) && p.images.length ? p.images : [''],
      exchangeOrReturnEligible: !!p.exchangeOrReturnEligible,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(initialForm);
  };

  const changeField = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const changeImage = (idx, val) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.map((url, i) => (i === idx ? val : url)),
    }));
  };

  const addImageField = () => {
    setForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const remove = async (id) => {
    try {
      await fetch(`${BACKEND_BASE}/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {}
  };

  const togglePublish = async (p) => {
    const route = p.isPublished ? 'unpublish' : 'publish';
    try {
      await fetch(`${BACKEND_BASE}/api/products/${p._id}/${route}`, { method: 'POST' });
      setProducts(prev => prev.map(x => x._id === p._id ? { ...x, isPublished: !x.isPublished } : x));
    } catch {}
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      type: form.type.trim(),
      quantity: Number(form.quantity) || 0,
      stock: Number(form.stock) || 0,
      mrp: Number(form.mrp) || 0,
      sellingPrice: Number(form.sellingPrice) || 0,
      brandName: form.brandName.trim(),
      images: (form.images || []).map(s => s.trim()).filter(Boolean),
      exchangeOrReturnEligible: !!form.exchangeOrReturnEligible,
    };

    try {
      if (editing) {
        const res = await fetch(`${BACKEND_BASE}/api/products/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setProducts(prev => prev.map(p => p._id === editing._id ? (updated.product || updated) : p));
      } else {
        const res = await fetch(`${BACKEND_BASE}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, isPublished: true }),
        });
        const created = await res.json();
        const newItem = created.product || created;
        setProducts(prev => [...prev, newItem]);
      }
      closeForm();
    } catch (err) {
      setError('Failed to save product.');
    }
  };

  return (
    <div className="home-page">
      <aside className="home-sidebar">
        <div className="brand">
          <img src="/Vector%20(2).png" alt="Productr logo" className="brand-logo" />
          <span className="brand-name">Productr</span>
        </div>
        <nav className="home-nav">
          <button className={`home-link ${page === 'Home' ? 'active' : ''}`} onClick={() => setPage('Home')}>Home</button>
          <button className={`home-link ${page === 'Products' ? 'active' : ''}`} onClick={() => setPage('Products')}>Products</button>
        </nav>
      </aside>

      <main className="home-main">
        {page === 'Home' && (
          <>
            <div className="tabs">
              <button className={`tab ${activeTab === 'Published' ? 'active' : ''}`} onClick={() => setActiveTab('Published')}>Published</button>
              <button className={`tab ${activeTab === 'Unpublished' ? 'active' : ''}`} onClick={() => setActiveTab('Unpublished')}>Unpublished</button>
            </div>
            {error && <div className="error-banner">{error}</div>}
            {loading ? (
              <div className="loading">Loading products…</div>
            ) : visibleProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">▥+</div>
                <h3>No {activeTab} Products</h3>
                <p>Your {activeTab} products will appear here<br/>Create your first product to {activeTab === 'Published' ? 'publish' : 'save as draft'}</p>
              </div>
            ) : (
              <div className="product-grid">
                {visibleProducts.map(p => (
                  <div key={p._id} className="product-card">
                    <div className="product-header">
                      <h4 className="product-name">{p.name}</h4>
                      <span className={`badge ${p.isPublished ? 'pub' : 'unpub'}`}>{p.isPublished ? 'Published' : 'Unpublished'}</span>
                    </div>
                    <div className="product-details">
                      <div><strong>Type:</strong> {p.type}</div>
                      <div><strong>Quantity:</strong> {p.quantity}</div>
                      <div><strong>Stock:</strong> {p.stock}</div>
                      <div><strong>MRP:</strong> ₹{p.mrp}</div>
                      <div><strong>Selling:</strong> ₹{p.sellingPrice}</div>
                      <div><strong>Brand:</strong> {p.brandName}</div>
                      <div><strong>Return/Exchange:</strong> {p.exchangeOrReturnEligible ? 'Eligible' : 'Not eligible'}</div>
                      {Array.isArray(p.images) && p.images.length > 0 && (
                        <div className="image-row">
                          {p.images.map((url, i) => (
                            <img key={i} src={url} alt="product" onError={(ev)=>{ev.currentTarget.style.visibility='hidden';}} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="card-actions">
                      <button onClick={() => openEdit(p)}>Edit</button>
                      <button className="danger" onClick={() => remove(p._id)}>Delete</button>
                      <button className="secondary" onClick={() => togglePublish(p)}>
                        {p.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {page === 'Products' && (
          <div className="products-create">
            <div className="empty-state">
              <div className="empty-icon">▥+</div>
              <h3>Create Product</h3>
              <p>Add new products here. They will appear on the Home page under Published. You can unpublish from Home to move them to Unpublished.</p>
              <button className="primary" onClick={openCreate}>+ Add Product</button>
            </div>
          </div>
        )}
      </main>

      {showForm && (
        <div className="overlay" onClick={closeForm}>
          <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
            <div className="overlay-header">
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button className="icon" onClick={closeForm}>✕</button>
            </div>
            <form className="product-form" onSubmit={save}>
              <div className="form-row">
                <label>Name</label>
                <input value={form.name} onChange={(e)=>changeField('name', e.target.value)} required />
              </div>
              <div className="form-row">
                <label>Type</label>
                <input value={form.type} onChange={(e)=>changeField('type', e.target.value)} />
              </div>
              <div className="form-row two">
                <div>
                  <label>Quantity</label>
                  <input type="number" value={form.quantity} onChange={(e)=>changeField('quantity', e.target.value)} />
                </div>
                <div>
                  <label>Stock</label>
                  <input type="number" value={form.stock} onChange={(e)=>changeField('stock', e.target.value)} />
                </div>
              </div>
              <div className="form-row two">
                <div>
                  <label>MRP</label>
                  <input type="number" value={form.mrp} onChange={(e)=>changeField('mrp', e.target.value)} />
                </div>
                <div>
                  <label>Selling Price</label>
                  <input type="number" value={form.sellingPrice} onChange={(e)=>changeField('sellingPrice', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <label>Brand Name</label>
                <input value={form.brandName} onChange={(e)=>changeField('brandName', e.target.value)} />
              </div>
              <div className="form-row">
                <label>Images (URLs)</label>
                {form.images.map((url, i) => (
                  <input key={i} placeholder={`Image URL ${i+1}`} value={url} onChange={(e)=>changeImage(i, e.target.value)} />
                ))}
                <button type="button" className="secondary" onClick={addImageField}>+ Add Image</button>
              </div>
              <div className="form-row checkbox">
                <label>
                  <input type="checkbox" checked={form.exchangeOrReturnEligible} onChange={(e)=>changeField('exchangeOrReturnEligible', e.target.checked)} />
                  Return/Exchange Eligible
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="primary">Save</button>
                <button type="button" className="secondary" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
