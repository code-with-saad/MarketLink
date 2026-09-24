import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  getProducts,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  updateWeeklyTemplate,
  applyWeeklyTemplate,
  getProfile,
} from '@/api/farmerApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxes,
  faPlus,
  faSync,
  faEdit,
  faTrash,
  faCheckCircle,
  faExclamationTriangle,
  faCircleNotch,
  faLeaf,
  faDollarSign,
  faTag,
  faImage,
  faSlidersH,
} from '@fortawesome/free-solid-svg-icons';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy & Eggs', 'Baked Goods', 'Meat & Poultry', 'Pantry & Preserves', 'Herbs & Flowers', 'Specialty Items'];

const FarmerStock = () => {
  const user = useSelector(selectCurrentUser);
  const isPending = user?.status === 'pending';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoApplyTemplate, setAutoApplyTemplate] = useState(false);
  const [templateUpdating, setTemplateUpdating] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Dialog / Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Add, object = Edit
  const [formSaving, setFormSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'lb',
    quantity_available: '',
    weekly_template_quantity: '',
    description: '',
    image_url: '',
    is_sold_out: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, profRes] = await Promise.all([
        getProducts().catch(() => ({ data: { products: [] } })),
        getProfile().catch(() => ({ data: { profile: {} } })),
      ]);

      if (prodRes.data?.products) {
        setProducts(prodRes.data.products);
      }
      if (profRes.data?.profile?.auto_apply_weekly_template !== undefined) {
        setAutoApplyTemplate(Boolean(profRes.data.profile.auto_apply_weekly_template));
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to load stock data' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: 'lb',
      quantity_available: '10',
      weekly_template_quantity: '10',
      description: '',
      image_url: '',
      is_sold_out: false,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      category: prod.category || 'Vegetables',
      price: prod.price !== undefined ? String(prod.price) : '',
      unit: prod.unit || 'lb',
      quantity_available: prod.quantity_available !== undefined ? String(prod.quantity_available) : '0',
      weekly_template_quantity: prod.weekly_template_quantity !== undefined ? String(prod.weekly_template_quantity) : '0',
      description: prod.description || '',
      image_url: prod.image_url || '',
      is_sold_out: Boolean(prod.is_sold_out),
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormSaving(true);
    setModalError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        unit: formData.unit.trim(),
        quantity_available: Number(formData.quantity_available) || 0,
        weekly_template_quantity: Number(formData.weekly_template_quantity) || 0,
        description: formData.description.trim(),
        image_url: formData.image_url.trim(),
        is_sold_out: Boolean(formData.is_sold_out),
      };

      if (editingProduct) {
        const res = await updateProduct(editingProduct._id, payload);
        if (res.data?.success) {
          setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? res.data.product : p)));
          setFeedback({ type: 'success', message: 'Product updated successfully' });
          setIsModalOpen(false);
        }
      } else {
        const res = await createProduct(payload);
        if (res.data?.success) {
          setProducts((prev) => [res.data.product, ...prev]);
          setFeedback({ type: 'success', message: 'Product created successfully' });
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await deleteProduct(id);
      if (res.data?.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setFeedback({ type: 'success', message: `Deleted "${name}"` });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to delete product' });
    }
  };

  const handleInlineQuantityChange = async (id, newQty) => {
    const qty = Math.max(0, Number(newQty) || 0);
    const isSoldOut = qty === 0;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, quantity_available: qty, is_sold_out: isSoldOut } : p))
    );

    try {
      await updateProduct(id, { quantity_available: qty, is_sold_out: isSoldOut });
    } catch (err) {
      fetchData(); // Rollback on error
    }
  };

  const handleInlineTemplateChange = async (id, newTplQty) => {
    const tplQty = Math.max(0, Number(newTplQty) || 0);

    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, weekly_template_quantity: tplQty } : p))
    );

    try {
      await updateProduct(id, { weekly_template_quantity: tplQty });
    } catch (err) {
      fetchData();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    let isSoldOut = false;
    if (newStatus === 'sold_out' || newStatus === 'unavailable') {
      isSoldOut = true;
    }

    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, is_sold_out: isSoldOut } : p))
    );

    try {
      const res = await updateProductStatus(id, { status: newStatus });
      if (res.data?.product) {
        setProducts((prev) => prev.map((p) => (p._id === id ? res.data.product : p)));
      }
    } catch (err) {
      fetchData();
    }
  };

  const handleToggleAutoApply = async () => {
    const nextVal = !autoApplyTemplate;
    setAutoApplyTemplate(nextVal);
    setTemplateUpdating(true);

    try {
      await updateWeeklyTemplate({ auto_apply_weekly_template: nextVal });
      setFeedback({
        type: 'success',
        message: nextVal ? 'Auto-apply weekly template enabled' : 'Auto-apply weekly template disabled',
      });
    } catch (err) {
      setAutoApplyTemplate(!nextVal);
      setFeedback({ type: 'error', message: 'Failed to update weekly template setting' });
    } finally {
      setTemplateUpdating(false);
    }
  };

  const handleApplyWeeklyTemplateNow = async () => {
    if (!window.confirm('Reset current stock to weekly template quantities for all products?')) return;
    setApplyingTemplate(true);

    try {
      const res = await applyWeeklyTemplate();
      if (res.data?.success && res.data?.products) {
        setProducts(res.data.products);
        setFeedback({ type: 'success', message: 'Stock reset to weekly template quantities!' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to apply weekly template' });
    } finally {
      setApplyingTemplate(false);
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest-900 text-accent-lime rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faBoxes} />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Weekly Stock Management</h1>
              <p className="text-xs sm:text-sm text-earth-700">Set available inventory, adjust weekly templates, and mark items sold out.</p>
            </div>
          </div>

          <Button
            onClick={handleOpenAdd}
            disabled={isPending}
            className="shadow-sm self-start sm:self-auto"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add New Harvest Product</span>
          </Button>
        </div>

        {/* Global Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={feedback.type === 'success' ? faCheckCircle : faExclamationTriangle} />
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-xs opacity-70 hover:opacity-100 font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* Recurring Weekly Stock Template Panel */}
        <Card className="bg-warm-surface border-earth-200/80 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faSync} className="text-primary text-base" />
                  <span>Recurring Weekly Stock Template</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Define baseline harvest quantities for each product. Automatically or manually reset stock every week.
                </CardDescription>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <label className="flex items-center gap-2 text-xs font-semibold text-earth-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoApplyTemplate}
                    onChange={handleToggleAutoApply}
                    disabled={isPending || templateUpdating}
                    className="w-4 h-4 rounded text-forest-800 focus:ring-primary cursor-pointer"
                  />
                  <span>Auto-apply every week</span>
                </label>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyWeeklyTemplateNow}
                  disabled={isPending || applyingTemplate || products.length === 0}
                  className="gap-1.5"
                >
                  {applyingTemplate ? (
                    <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faSync} />
                  )}
                  <span>Apply Now</span>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stock List Table */}
        <Card className="bg-warm-surface border-earth-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-warm-cream/60 border-b border-earth-100 text-xs font-semibold uppercase tracking-wider text-earth-700">
                <tr>
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Price / Unit</th>
                  <th className="p-4">In-Stock Qty</th>
                  <th className="p-4">Weekly Template</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100/80">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-earth-500">
                      <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-2xl text-primary mb-2" />
                      <p className="text-sm font-medium">Loading inventory...</p>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-earth-500">
                      <div className="w-12 h-12 rounded-2xl bg-warm-cream-dark text-primary flex items-center justify-center text-xl mx-auto mb-3">
                        <FontAwesomeIcon icon={faLeaf} />
                      </div>
                      <h3 className="font-serif text-lg font-bold text-foreground">No harvest items listed yet</h3>
                      <p className="text-xs text-earth-500 mt-1 max-w-sm mx-auto">
                        Add your seasonal produce, fresh eggs, or specialty stall goods to make them available for pre-orders.
                      </p>
                      {!isPending && (
                        <Button onClick={handleOpenAdd} size="sm" className="mt-4">
                          <FontAwesomeIcon icon={faPlus} />
                          <span>Add First Item</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr key={item._id} className="hover:bg-warm-cream/30 transition-colors">
                      {/* Product details */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-earth-100 overflow-hidden shrink-0 flex items-center justify-center border border-earth-200/60">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <FontAwesomeIcon icon={faLeaf} className="text-earth-400 text-lg" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground truncate">{item.name}</p>
                            <span className="text-[11px] font-semibold text-earth-500 uppercase tracking-wider">
                              {item.category || 'Produce'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price / Unit */}
                      <td className="p-4 font-medium text-foreground whitespace-nowrap">
                        ${Number(item.price).toFixed(2)} <span className="text-xs text-earth-500">/ {item.unit}</span>
                      </td>

                      {/* In-Stock Quantity (Inline Editable) */}
                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          disabled={isPending}
                          value={item.quantity_available}
                          onChange={(e) => handleInlineQuantityChange(item._id, e.target.value)}
                          className="w-20 h-9 px-2.5 bg-warm-surface border border-earth-300/80 rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50"
                        />
                      </td>

                      {/* Weekly Template Quantity (Inline Editable) */}
                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          disabled={isPending}
                          value={item.weekly_template_quantity}
                          onChange={(e) => handleInlineTemplateChange(item._id, e.target.value)}
                          className="w-20 h-9 px-2.5 bg-warm-surface border border-earth-300/80 rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50"
                        />
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <select
                          disabled={isPending}
                          value={item.is_sold_out ? 'sold_out' : 'available'}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className={`h-9 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                            item.is_sold_out
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="available">Available</option>
                          <option value="sold_out">Sold Out</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={isPending}
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-earth-600 hover:text-primary hover:bg-warm-cream rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Edit Product"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            disabled={isPending}
                            onClick={() => handleDeleteProduct(item._id, item.name)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Product"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add/Edit Product Modal Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg bg-warm-surface border border-earth-200">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold text-foreground">
                {editingProduct ? 'Edit Harvest Product' : 'Add New Harvest Product'}
              </DialogTitle>
              <DialogDescription className="text-xs text-earth-500">
                {editingProduct ? 'Update product pricing, stock availability, and images.' : 'Create a new product listing for your farm stall.'}
              </DialogDescription>
            </DialogHeader>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Organic Heirloom Tomatoes"
                  className="w-full h-10 px-3 bg-warm-surface border border-earth-300 rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 bg-warm-surface border border-earth-300 rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1">
                    Unit (e.g. lb, bunch, bag)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="lb"
                    className="w-full h-10 px-3 bg-warm-surface border border-earth-300 rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="4.99"
                    className="w-full h-10 px-3 bg-warm-surface border border-earth-300 rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1">
                    In-Stock Qty
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity_available}
                    onChange={(e) => setFormData({ ...formData, quantity_available: e.target.value })}
                    placeholder="10"
                    className="w-full h-10 px-3 bg-warm-surface border border-earth-300 rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1">
                    Weekly Tpl Qty
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.weekly_template_quantity}
                    onChange={(e) => setFormData({ ...formData, weekly_template_quantity: e.target.value })}
                    placeholder="10"
                    className="w-full h-10 px-3 bg-warm-surface border border-earth-300 rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full h-10 px-3 bg-warm-surface border border-earth-300 rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Freshly picked organic tomatoes from our Greenfield farm..."
                  className="w-full p-3 bg-warm-surface border border-earth-300 rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formSaving} size="sm">
                  {formSaving ? (
                    <>
                      <FontAwesomeIcon icon={faCircleNotch} className="animate-spin mr-1.5" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </FarmerLayout>
  );
};

export default FarmerStock;
