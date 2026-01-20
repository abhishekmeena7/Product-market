import { useEffect, useState } from 'react';
import { createProduct, getProducts, togglePublish, updateProduct, deleteProduct } from '../../services/api';
import './Products.css';

const initial = {
  name: '',
  type: '',
  quantity: '',
  stock: '',
  mrp: '',
  sellingPrice: '',
  brandName: '',
  images: [],
  exchangeOrReturnEligible: false,
};

const Products = ({ setPage }) => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    loadProducts();
  }, []);

  // If navigated here to edit from Home, auto-open modal with prefilled data
  useEffect(() => {
    const raw = localStorage.getItem('editProduct');
    if (raw) {
      try {
        const p = JSON.parse(raw);
        onEdit(p);
      } catch {}
      localStorage.removeItem('editProduct');
    }
  }, []);

  const loadProducts = async () => {
    try {
      const list = await getProducts();
      setProducts(list);
    } catch {}
  };

  const submit = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        name: form.name,
        price: Number(form.sellingPrice || form.mrp || 0),
        type: form.type,
        quantity: form.quantity,
        stock: form.stock,
        mrp: form.mrp ? Number(form.mrp) : undefined,
        sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : undefined,
        brandName: form.brandName,
        images: form.images || [],
        exchangeOrReturnEligible: !!form.exchangeOrReturnEligible,
      };
      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage('Product updated');
      } else {
        await createProduct(payload);
        setMessage('Product created');
      }
      setForm(initial);
      setEditingId(null);
      setOpen(false);
      await loadProducts();
    } catch {
      setMessage('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const onPublishToggle = async (p) => {
    try {
      await togglePublish(p._id, !p.isPublished);
      await loadProducts();
    } catch {}
  };

  const onDelete = async (id) => {
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch {}
  };

  const onEdit = (p) => {
    setForm({
      name: p.name || '',
      type: p.type || '',
      quantity: p.quantity || '',
      stock: p.stock || '',
      mrp: p.mrp?.toString() || '',
      sellingPrice: p.sellingPrice?.toString() || '',
      brandName: p.brandName || '',
      images: p.images || [],
      exchangeOrReturnEligible: !!p.exchangeOrReturnEligible,
    });
    setEditingId(p._id);
    setOpen(true);
  };

  const onImagesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readers = files.map(file => new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.readAsDataURL(file);
    }));
    const urls = await Promise.all(readers);
    setForm(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }));
  };

  return (
    <div className="home-page">
      <div className="home-content">
        {/* Top header with Add Product button */}
        <div className="products-header">
          <h1 className="products-title">Products</h1>
          <button className="primary" onClick={() => setOpen(true)}>Add Product</button>
        </div>

        {/* Empty-state CTA only when there are no products */}
        {products.length === 0 && !open && (
          <div className="center-cta">
            <div className="cta-card">
              <h2>Add Products</h2>
              <p>Create a new product listing to publish on Home.</p>
              <button className="primary" onClick={() => setOpen(true)}>Add Product</button>
            </div>
          </div>
        )}

        {open && (
          <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Product</h3>
                <button className="icon" onClick={() => setOpen(false)} aria-label="Close">×</button>
              </div>
              <form className="product-form" onSubmit={submit}>
          <div className="form-row">
            <label>Name</label>
            <input value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div className="form-row">
            <label>Product Type</label>
            <select value={form.type} onChange={e => update('type', e.target.value)}>
              <option value="">Select type</option>
              <option value="foods">foods</option>
              <option value="electronics">electronics</option>
              <option value="clothes">clothes</option>
              <option value="beauty products">beauty products</option>
              <option value="other">other</option>
            </select>
          </div>
          <div className="form-row">
            <label>Quantity</label>
            <input value={form.quantity} onChange={e => update('quantity', e.target.value)} />
          </div>
          <div className="form-row">
            <label>Stock</label>
            <input value={form.stock} onChange={e => update('stock', e.target.value)} />
          </div>
          <div className="form-row grid">
            <div>
              <label>MRP</label>
              <input value={form.mrp} onChange={e => update('mrp', e.target.value)} />
            </div>
            <div>
              <label>Selling Price</label>
              <input value={form.sellingPrice} onChange={e => update('sellingPrice', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <label>Brand Name</label>
            <input value={form.brandName} onChange={e => update('brandName', e.target.value)} />
          </div>
          <div className="form-row">
            <label>Upload Product Images (multiple)</label>
            <input type="file" accept="image/*" multiple onChange={onImagesSelected} />
            {form.images?.length ? (
              <div className="image-previews">
                {form.images.map((src, idx) => (
                  <img key={idx} src={src} alt={`preview-${idx}`} className="preview-thumb" />
                ))}
              </div>
            ) : null}
          </div>
          <div className="form-row">
            <label>Exchange or Return Eligibility</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <label><input type="radio" name="exret" checked={!!form.exchangeOrReturnEligible} onChange={() => update('exchangeOrReturnEligible', true)} /> Yes</label>
              <label><input type="radio" name="exret" checked={!form.exchangeOrReturnEligible} onChange={() => update('exchangeOrReturnEligible', false)} /> No</label>
            </div>
          </div>
                <div className="form-actions">
                  <button type="submit" className="primary" disabled={loading}>{loading ? 'Saving...' : (editingId ? 'Update' : 'Save')}</button>
                  <button type="button" className="secondary" onClick={() => { setForm(initial); setEditingId(null); setOpen(false); }}>Cancel</button>
                </div>
                {message && <div className="home-empty">{message}</div>}
              </form>
            </div>
          </div>
        )}

        {/* Unpublished section */}
        {products.filter(p => !p.isPublished).length > 0 && (
          <div>
            <h3 className="section-title">Unpublished</h3>
            <div className="products-grid">
              {products.filter(p => !p.isPublished).map(p => (
                <div key={p._id} className="product-card">
                  <div className="product-media">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name || 'Product image'} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h4 className="product-name">{p.name}</h4>
                    <div className="chip-row">
                      <span className="chip chip-unpublished">Unpublished</span>
                    </div>
                    <div className="product-meta">{p.type} • {p.brandName}</div>
                    <div className="product-prices">
                      {p.mrp != null && <span className="mrp">₹{p.mrp}</span>}
                      {p.sellingPrice != null && <span className="sp">₹{p.sellingPrice}</span>}
                      {p.mrp != null && p.sellingPrice != null && p.mrp > p.sellingPrice ? (
                        <span className="discount-badge">{Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100)}% OFF</span>
                      ) : null}
                    </div>
                    <div className="product-stats">Qty: {p.quantity} • Stock: {p.stock}</div>
                    <div className="product-eligibility">Exchange/Return: {p.exchangeOrReturnEligible ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="product-actions">
                    <button className="primary" onClick={() => onPublishToggle(p)}>Publish</button>
                    <button className="secondary" onClick={() => onEdit(p)}>Edit</button>
                    <button className="secondary" onClick={() => onDelete(p._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Published section */}
        {products.filter(p => p.isPublished).length > 0 && (
          <div>
            <h3 className="section-title">Published</h3>
            <div className="products-grid">
              {products.filter(p => p.isPublished).map(p => (
                <div key={p._id} className="product-card">
                  <div className="product-media">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name || 'Product image'} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h4 className="product-name">{p.name}</h4>
                    <div className="chip-row">
                      <span className="chip chip-published">Published</span>
                    </div>
                    <div className="product-meta">{p.type} • {p.brandName}</div>
                    <div className="product-prices">
                      {p.mrp != null && <span className="mrp">₹{p.mrp}</span>}
                      {p.sellingPrice != null && <span className="sp">₹{p.sellingPrice}</span>}
                      {p.mrp != null && p.sellingPrice != null && p.mrp > p.sellingPrice ? (
                        <span className="discount-badge">{Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100)}% OFF</span>
                      ) : null}
                    </div>
                    <div className="product-stats">Qty: {p.quantity} • Stock: {p.stock}</div>
                    <div className="product-eligibility">Exchange/Return: {p.exchangeOrReturnEligible ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="product-actions">
                    <button className="primary" onClick={() => onPublishToggle(p)}>Unpublish</button>
                    <button className="secondary" onClick={() => onEdit(p)}>Edit</button>
                    <button className="secondary" onClick={() => onDelete(p._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
