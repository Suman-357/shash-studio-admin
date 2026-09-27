import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { adminApi as api } from "../services/api";

// Local image assets for 100% reliable rendering without network flickering
import cottonMatImg from "../assets/mysuru_organic_cotton_mat.jpg";
import proGripMatImg from "../assets/progrip_rubber_yoga_mat.jpg";
import corkPropsImg from "../assets/cork_yoga_blocks_strap_set.jpg";

export const resolveProductImage = (imagePath, slug) => {
  if (slug === "cotton-mat" || imagePath?.includes("cotton")) return cottonMatImg;
  if (slug === "progrip-mat" || imagePath?.includes("progrip") || imagePath?.includes("rubber")) return proGripMatImg;
  if (slug === "cork-props-kit" || imagePath?.includes("cork")) return corkPropsImg;
  return imagePath || cottonMatImg;
};

export const ProductsPage = () => {
  const queryClient = useQueryClient();
  const outletCtx = useOutletContext();
  const showToast = outletCtx?.showToast || console.log;

  const [activeTab, setActiveTab] = useState("products"); // "products" | "orders"
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [managingOrder, setManagingOrder] = useState(null);
  const [formActiveTab, setFormActiveTab] = useState("descriptions"); // "descriptions" | "general" | "specs"

  // Product Form State
  const initialForm = {
    slug: "",
    title: "",
    titleKn: "",
    subtitle: "",
    subtitleKn: "",
    category: "mats",
    price: 1499,
    originalPrice: 1999,
    inStock: true,
    stockQuantity: 40,
    badge: "Studio Original",
    badgeKn: "ಶಾಲಾ ವಿಶೇಷ",
    badgeColor: "bg-[#1C3325]",
    tag: "Studio Equipment",
    image: "/src/assets/mysuru_organic_cotton_mat.jpg",
    description: "",
    descriptionKn: "",
    highlightsText: "",
    specs: [
      { label: "Dimensions", value: "72″ × 26″ (183cm × 66cm)" },
      { label: "Thickness", value: "5mm Grounding Cushion" },
      { label: "Weight", value: "1.3 kg" },
      { label: "Material", value: "Organic Cotton + Natural Tree Rubber" }
    ]
  };
  const [formData, setFormData] = useState(initialForm);

  // Order update state
  const [orderStatusForm, setOrderStatusForm] = useState({
    orderStatus: "confirmed",
    trackingNumber: "",
    courierPartner: "India Post Speed Post / Bluedart"
  });

  // Query: Products
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["admin-products"],
    queryFn: api.getProducts
  });

  // Query: Orders
  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["admin-product-orders"],
    queryFn: () => api.getProductOrders()
  });

  // Mutation: Create Product
  const createProductMutation = useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-products"]);
      setIsAddingProduct(false);
      setFormData(initialForm);
      showToast?.("Product added successfully to Sanctuary Store!");
    }
  });

  // Mutation: Update Product
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => api.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-products"]);
      setEditingProduct(null);
      setFormData(initialForm);
      showToast?.("Product details & description updated successfully!");
    }
  });

  // Mutation: Delete Product
  const deleteProductMutation = useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-products"]);
      showToast?.("Product deleted from store.");
    }
  });

  // Mutation: Update Order Status
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => api.updateProductOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-product-orders"]);
      setManagingOrder(null);
      showToast?.("Order status & tracking updated!");
    }
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.titleKn || "").includes(searchQuery) ||
      (p.slug || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Open Edit Form
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormActiveTab("descriptions"); // Start on descriptions tab directly as requested!
    setFormData({
      slug: product.slug || "",
      title: product.title || "",
      titleKn: product.titleKn || "",
      subtitle: product.subtitle || "",
      subtitleKn: product.subtitleKn || "",
      category: product.category || "mats",
      price: product.price ?? 1499,
      originalPrice: product.originalPrice ?? 1999,
      inStock: product.inStock !== false,
      stockQuantity: product.stockQuantity ?? 30,
      badge: product.badge || "",
      badgeKn: product.badgeKn || "",
      badgeColor: product.badgeColor || "bg-[#1C3325]",
      tag: product.tag || "Studio Equipment",
      image: product.image || "/src/assets/mysuru_organic_cotton_mat.jpg",
      description: product.description || "",
      descriptionKn: product.descriptionKn || "",
      highlightsText: Array.isArray(product.highlights) ? product.highlights.join("\n") : "",
      specs: Array.isArray(product.specs) && product.specs.length > 0
        ? product.specs.map(s => ({ label: s.label, value: s.value }))
        : [
            { label: "Dimensions", value: "72″ × 26″ (183cm × 66cm)" },
            { label: "Thickness", value: "5mm Grounding Cushion" },
            { label: "Weight", value: "1.3 kg" },
            { label: "Material", value: "Natural Tree Rubber" }
          ]
    });
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormActiveTab("general");
    setFormData(initialForm);
    setIsAddingProduct(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    // Prepare payload
    const highlights = formData.highlightsText
      ? formData.highlightsText.split("\n").map(s => s.trim()).filter(Boolean)
      : [];

    const specs = (formData.specs || []).filter(
      s => (s.label && s.label.trim()) && (s.value && s.value.trim())
    );

    const payload = {
      slug: formData.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      title: formData.title.trim(),
      titleKn: formData.titleKn.trim(),
      subtitle: formData.subtitle.trim(),
      subtitleKn: formData.subtitleKn.trim(),
      category: formData.category,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      inStock: Boolean(formData.inStock),
      stockQuantity: Number(formData.stockQuantity),
      badge: formData.badge.trim(),
      badgeKn: formData.badgeKn.trim(),
      badgeColor: formData.badgeColor,
      tag: formData.tag.trim(),
      image: formData.image.trim(),
      description: formData.description.trim(),
      descriptionKn: formData.descriptionKn.trim(),
      highlights,
      specs
    };

    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct._id || editingProduct.id,
        data: payload
      });
    } else {
      createProductMutation.mutate(payload);
    }
  };

  const handleAddSpecRow = () => {
    setFormData(prev => ({
      ...prev,
      specs: [...(prev.specs || []), { label: "", value: "" }]
    }));
  };

  const handleRemoveSpecRow = (idx) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx)
    }));
  };

  const handleSpecChange = (idx, field, value) => {
    setFormData(prev => {
      const nextSpecs = [...prev.specs];
      nextSpecs[idx] = { ...nextSpecs[idx], [field]: value };
      return { ...prev, specs: nextSpecs };
    });
  };

  const handleOpenManageOrder = (order) => {
    setManagingOrder(order);
    setOrderStatusForm({
      orderStatus: order.orderStatus || "confirmed",
      trackingNumber: order.trackingNumber || "",
      courierPartner: order.courierPartner || "India Post Speed Post / Bluedart"
    });
  };

  const handleSaveOrderStatus = (e) => {
    e.preventDefault();
    if (!managingOrder) return;
    updateOrderMutation.mutate({
      id: managingOrder._id || managingOrder.id,
      data: orderStatusForm
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-extrabold text-[#1C3325] tracking-tight">
            Sanctuary Store & Equipment
          </h2>
          <p className="text-[13px] text-[#5C665F]">
            Manage studio yoga mats, props, pricing, inventory stock, and fulfill online customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setFormData(initialForm);
              setIsAddingProduct(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C3325] text-white text-[13px] font-bold shadow-sm hover:bg-[#2D4A37] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Main Tabs: Catalog vs Orders */}
      <div className="flex items-center gap-2 border-b border-[#E2DDD2] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
            activeTab === "products"
              ? "bg-[#1C3325] text-white shadow-xs"
              : "text-[#5C665F] hover:text-[#1C3325] hover:bg-[#EFECE3]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">inventory_2</span>
          <span>Store Products</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-mono">
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-[#1C3325] text-white shadow-xs"
              : "text-[#5C665F] hover:text-[#1C3325] hover:bg-[#EFECE3]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          <span>Customer Orders</span>
          <span className="px-2 py-0.5 rounded-full bg-[#D48C46] text-white text-[11px] font-bold">
            {orders.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS CATALOG */}
      {activeTab === "products" && (
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-[#E2DDD2] shadow-xs">
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search products by title, Kannada, slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px] focus:outline-none focus:border-[#1C3325]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[12px] font-semibold text-[#5C665F]">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E2DDD2] bg-white text-[12.5px] font-medium"
              >
                <option value="all">All Categories</option>
                <option value="mats">Yoga Mats</option>
                <option value="props">Alignment Props</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((p) => {
              const savings = (p.originalPrice || 0) - (p.price || 0);
              const discount = p.originalPrice > 0 ? Math.round((savings / p.originalPrice) * 100) : 0;

              return (
                <div
                  key={p._id || p.slug}
                  className="bg-white rounded-2xl border border-[#E2DDD2] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-4 space-y-3">
                    {/* Image Preview & Badges */}
                    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-neutral-100">
                      <img
                        src={resolveProductImage(p.image, p.slug)}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = cottonMatImg;
                        }}
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#1C3325] text-white text-[10px] font-bold">
                        {p.badge || "Sanctuary Item"}
                      </span>
                      <span
                        className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                          p.inStock ? "bg-[#E3F5EE] text-[#0E6848]" : "bg-[#FEE8E7] text-[#B42318]"
                        }`}
                      >
                        {p.inStock ? "● In Stock" : "● Sold Out"}
                      </span>
                    </div>

                    {/* Titles & Category */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C26D38]">
                          {p.category === "mats" ? "Yoga Mat" : p.category === "props" ? "Alignment Prop" : p.category || "Equipment"}
                        </span>
                        <span className="text-[10.5px] font-mono text-[#5C665F]">
                          slug: /{p.slug}
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-base text-[#1C3325] leading-snug line-clamp-1 mt-0.5">
                        {p.title}
                      </h4>
                      <p className="text-[12px] text-[#5C665F] line-clamp-1 mt-0.5 font-medium">
                        {p.titleKn}
                      </p>
                    </div>

                    {/* Description Snippet (Visible at a glance for Admin) */}
                    <div className="p-2.5 rounded-xl bg-[#F6F4ED] border border-[#E2DDD2]/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C3325] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">description</span>
                          Description
                        </span>
                        {p.highlights && p.highlights.length > 0 && (
                          <span className="text-[10px] font-semibold text-[#0E6848] bg-[#E3F5EE] px-1.5 py-0.2 rounded">
                            {p.highlights.length} Highlights
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-[#5C665F] line-clamp-2 leading-relaxed">
                        {p.description || "No description set yet. Click Edit to add details."}
                      </p>
                      {p.descriptionKn && (
                        <p className="text-[11px] text-[#5C665F]/80 line-clamp-1 italic">
                          ಕನ್ನಡ: {p.descriptionKn}
                        </p>
                      )}
                    </div>

                    {/* Pricing Block */}
                    <div className="flex items-baseline justify-between pt-1 border-t border-neutral-100">
                      <div className="flex items-baseline gap-2">
                        <span className="font-sans font-extrabold text-xl text-[#1C3325] tabular-nums">
                          ₹{p.price}
                        </span>
                        {p.originalPrice > p.price && (
                          <span className="text-[12px] text-[#5C665F] line-through tabular-nums">
                            ₹{p.originalPrice}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="text-[10.5px] font-bold text-[#945B09]">
                            ({discount}% OFF)
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#5C665F]">
                        Stock: {p.stockQuantity ?? 30}
                      </span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 bg-[#F6F4ED] border-t border-[#E2DDD2] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#1C3325] text-white text-[12px] font-bold hover:bg-[#2D4A37] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit_note</span>
                      <span>Edit Details &amp; Description</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${p.title}?`)) {
                          deleteProductMutation.mutate(p._id || p.id);
                        }
                      }}
                      className="py-2 px-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[12px] font-bold transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: STORE CUSTOMER ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2DDD2] shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2DDD2] flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-base text-[#1C3325]">
                  Customer Equipment Orders ({orders.length})
                </h3>
                <p className="text-[12px] text-[#5C665F]">
                  Orders placed online from the sanctuary store. Update courier dispatch and tracking info.
                </p>
              </div>
            </div>

            {loadingOrders ? (
              <div className="p-8 text-center text-[#5C665F]">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-[#5C665F]/40">shopping_bag</span>
                <p className="text-[14px] font-bold text-[#1C3325]">No product orders yet</p>
                <p className="text-[12px] text-[#5C665F]">When customers purchase mats or props, their orders will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[#F6F4ED] text-[#5C665F] uppercase text-[10.5px] font-bold tracking-wider border-b border-[#E2DDD2]">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer & WhatsApp</th>
                      <th className="py-3 px-4">Item & Qty</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Delivery City</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD2]">
                    {orders.map((ord) => {
                      const statusColor =
                        ord.orderStatus === "delivered"
                          ? "bg-[#E3F5EE] text-[#0E6848]"
                          : ord.orderStatus === "dispatched"
                          ? "bg-[#E0F2FE] text-[#0369A1]"
                          : ord.orderStatus === "cancelled"
                          ? "bg-[#FEE8E7] text-[#B42318]"
                          : "bg-[#FEF3D6] text-[#945B09]";

                      return (
                        <tr key={ord._id || ord.orderId} className="hover:bg-[#FDFBF7]">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-[#1C3325] block">
                              {ord.orderId}
                            </span>
                            <span className="text-[11px] text-[#5C665F]">
                              {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-[#1C3325] block">
                              {ord.customerName}
                            </span>
                            <a
                              href={`https://wa.me/91${ord.phone}?text=Namaskara%20${encodeURIComponent(ord.customerName)},%20regarding%20your%20SHASH%20Studios%20order%20${ord.orderId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] text-[#0E6848] font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              <span>📱 {ord.phone}</span>
                            </a>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-[#1C3325] block line-clamp-1 max-w-[200px]">
                              {ord.productTitle}
                            </span>
                            <span className="text-[11px] text-[#5C665F]">
                              Qty: {ord.quantity || 1}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-sans font-bold text-[#1C3325] tabular-nums">
                            ₹{ord.totalAmount}
                          </td>
                          <td className="py-3.5 px-4 text-[#5C665F]">
                            {ord.shippingAddress?.city || "Mysuru"} ({ord.shippingAddress?.pincode})
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${statusColor}`}>
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenManageOrder(ord)}
                              className="px-3 py-1.5 rounded-lg bg-[#EDE8DE] hover:bg-[#DCDAD4] text-[12px] font-bold text-[#1C3325] transition-colors cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: COMPREHENSIVE ADD / EDIT PRODUCT */}
      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#E2DDD2] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2DDD2] px-6 py-4 bg-[#F6F4ED]">
              <div>
                <h3 className="font-sans text-lg font-bold text-[#1C3325]">
                  {editingProduct ? `Edit Product: ${editingProduct.title}` : "Add New Studio Product"}
                </h3>
                <p className="text-[12px] text-[#5C665F]">
                  Configure product details, English &amp; Kannada descriptions, pricing, and specs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-[#1C3325] hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Subtabs */}
            <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-[#E2DDD2] bg-[#FAF8F5]">
              <button
                type="button"
                onClick={() => setFormActiveTab("descriptions")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer ${
                  formActiveTab === "descriptions"
                    ? "bg-[#1C3325] text-white shadow-xs"
                    : "text-[#5C665F] hover:text-[#1C3325] hover:bg-[#EFECE3]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">description</span>
                <span>Descriptions &amp; Story</span>
              </button>

              <button
                type="button"
                onClick={() => setFormActiveTab("general")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer ${
                  formActiveTab === "general"
                    ? "bg-[#1C3325] text-white shadow-xs"
                    : "text-[#5C665F] hover:text-[#1C3325] hover:bg-[#EFECE3]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">sell</span>
                <span>Titles, Pricing &amp; Stock</span>
              </button>

              <button
                type="button"
                onClick={() => setFormActiveTab("specs")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer ${
                  formActiveTab === "specs"
                    ? "bg-[#1C3325] text-white shadow-xs"
                    : "text-[#5C665F] hover:text-[#1C3325] hover:bg-[#EFECE3]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Image &amp; Specifications</span>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* SUBTAB 1: DESCRIPTIONS & STORY */}
              {formActiveTab === "descriptions" && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#E3F5EE] border border-[#0E6848]/20 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[20px] text-[#0E6848] shrink-0 mt-0.5">info</span>
                    <p className="text-[12px] text-[#0E6848] leading-relaxed">
                      <strong>Where this appears:</strong> This detailed description is displayed to customers in the product popup modal, explaining craftsmanship, materials, Ashtanga benefits, and handloom origins.
                    </p>
                  </div>

                  {/* English Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C3325]">
                        Detailed Product Description (English) *
                      </label>
                      <span className="text-[11px] font-mono text-[#5C665F]">
                        {formData.description.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2DDD2] text-[13px] leading-relaxed focus:outline-none focus:border-[#1C3325]"
                      placeholder="e.g. Crafted with pure organic Indian cotton and resilient natural jute yarn, featuring an unbleached tree-rubber ribbed backing to ensure slip-free grounding. Designed specifically for Ashtanga Vinyasa sweat absorption..."
                    />
                  </div>

                  {/* Kannada Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C3325]">
                        ವಿವರಣೆ - Product Description (ಕನ್ನಡ Kannada) *
                      </label>
                      <span className="text-[11px] font-mono text-[#5C665F]">
                        {formData.descriptionKn.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      required
                      value={formData.descriptionKn}
                      onChange={(e) => setFormData({ ...formData, descriptionKn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2DDD2] text-[13px] leading-relaxed focus:outline-none focus:border-[#1C3325]"
                      placeholder="e.g. ಅಷ್ಟಾಂಗ ವಿನ್ಯಾಸ ಹಾಗೂ ಧ್ಯಾಸಕ್ಕೆ ಹೇಳಿಮಾಡಿಸಿದ ನೈಸರ್ಗಿಕ ಹತ್ತಿ ಮತ್ತು ಸೆಣಬಿನ ಚಾಪೆ. ಬೆವರು ಹೀರಿಕೊಂಡು ಜಾರದಂತೆ ಹಿಡಿತ ನೀಡುವ ನೈಸರ್ಗಿಕ ರಬ್ಬರ್ ಬೆಂಬಲ ಹೊಂದಿದೆ..."
                    />
                  </div>

                  {/* Subtitle & Tagline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                        Subtitle / Catchphrase (English)
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px]"
                        placeholder="e.g. 100% Biodegradable • Handwoven by Traditional Mysuru Weavers"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                        ಉಪಶೀರ್ಷಿಕೆ (ಕನ್ನಡ Kannada Subtitle)
                      </label>
                      <input
                        type="text"
                        value={formData.subtitleKn}
                        onChange={(e) => setFormData({ ...formData, subtitleKn: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px]"
                        placeholder="e.g. ೧೦೦% ನೈಸರ್ಗಿಕ ಹತ್ತಿ ಮತ್ತು ಸೆಣಬು • ಪಾರಂಪರಿಕ ಮೈಸೂರು ನೇಯ್ಗೆ"
                      />
                    </div>
                  </div>

                  {/* Key Highlights (Bullet Points) */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C3325]">
                        Key Highlights (Bullet Points — One per line)
                      </label>
                      <span className="text-[11px] text-[#0E6848] font-semibold">
                        {formData.highlightsText ? formData.highlightsText.split("\n").filter(s => s.trim()).length : 0} points
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={formData.highlightsText}
                      onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2DDD2] text-[12.5px] font-mono leading-relaxed focus:outline-none focus:border-[#1C3325]"
                      placeholder="100% Organic Cotton & Jute Weave with Natural Tree Rubber Grip&#10;Superior Sweat Absorption for Dynamic Mysore Ashtanga Practice&#10;Hypoallergenic, Toxin-Free & Biodegradable&#10;Includes Cotton Carrying Sling"
                    />
                    <p className="text-[11px] text-[#5C665F] mt-1">
                      Tip: Type each bullet point on its own line. They will render with checkmarks in the product modal.
                    </p>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: GENERAL, PRICING & STOCK */}
              {formActiveTab === "general" && (
                <div className="space-y-4">
                  {/* Titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                        Product Title (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px] font-semibold"
                        placeholder="e.g. Mysuru Heritage Handloom Cotton Yoga Mat"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                        ಶೀರ್ಷಿಕೆ - Product Title (ಕನ್ನಡ Kannada) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.titleKn}
                        onChange={(e) => setFormData({ ...formData, titleKn: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px] font-semibold"
                        placeholder="e.g. ಮೈಸೂರು ಸಾವಯವ ಹತ್ತಿ & ಸೆಣಬಿನ ಯೋಗ ಚಾಪೆ"
                      />
                    </div>
                  </div>

                  {/* Slug, Category, Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                        Slug (URL identifier) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px] font-mono"
                        placeholder="e.g. cotton-mat"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px] bg-white"
                      >
                        <option value="mats">Yoga Mats</option>
                        <option value="props">Alignment Props</option>
                        <option value="wellness">Wellness &amp; Kits</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                        Store Badge (English)
                      </label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px]"
                        placeholder="e.g. Mysuru Handloom Heritage"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                        ಬ್ಯಾಡ್ಜ್ (ಕನ್ನಡ Kannada Badge)
                      </label>
                      <input
                        type="text"
                        value={formData.badgeKn}
                        onChange={(e) => setFormData({ ...formData, badgeKn: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px]"
                        placeholder="e.g. ಕೈಮಗ್ಗದ ಪರಂಪರೆ"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                        Card Tag
                      </label>
                      <input
                        type="text"
                        value={formData.tag}
                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px]"
                        placeholder="e.g. Authentic Sadhana"
                      />
                    </div>
                  </div>

                  {/* Pricing Row */}
                  <div className="p-4 rounded-2xl bg-[#F6F4ED] border border-[#E2DDD2] space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C3325] block">
                      Pricing &amp; Inventory Controls
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                          Offer Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[14px] font-bold text-[#1C3325] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                          Original Price / MRP (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[14px] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                          Available Units (Stock)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stockQuantity}
                          onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[14px] bg-white font-mono"
                        />
                      </div>
                    </div>

                    {formData.originalPrice > formData.price && (
                      <div className="text-[12px] font-bold text-[#0E6848] flex items-center gap-1.5 pt-1">
                        <span>✓ Customer saves ₹{formData.originalPrice - formData.price}</span>
                        <span className="bg-[#E3F5EE] px-2 py-0.5 rounded-full text-[11px]">
                          ({Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}% Discount)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* In Stock Checkbox */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E2DDD2]">
                    <input
                      type="checkbox"
                      id="inStockCheck"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#1C3325] cursor-pointer"
                    />
                    <label htmlFor="inStockCheck" className="text-[13px] font-bold text-[#1C3325] cursor-pointer">
                      Mark as In Stock &amp; Visible for Instant Customer Purchase
                    </label>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: IMAGE & SPECIFICATIONS */}
              {formActiveTab === "specs" && (
                <div className="space-y-4">
                  {/* Image URL & Preview */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                      Product Image Asset Path or Web URL *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[12.5px] font-mono"
                        placeholder="/src/assets/..."
                      />
                      <div className="w-14 h-14 rounded-xl border border-[#E2DDD2] overflow-hidden bg-neutral-100 shrink-0">
                        <img
                          src={resolveProductImage(formData.image, formData.slug)}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = cottonMatImg;
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specifications List */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C3325] block">
                          Product Specifications (Dimensions, Cushion, Weight, etc.)
                        </span>
                        <span className="text-[11px] text-[#5C665F]">
                          Shown in the specs table inside the product modal.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSpecRow}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFECE3] hover:bg-[#E2DDD2] text-[11.5px] font-bold text-[#1C3325] cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px]">add</span>
                        <span>Add Spec Row</span>
                      </button>
                    </div>

                    <div className="space-y-2 pt-1">
                      {(formData.specs || []).map((sp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Label (e.g. Dimensions)"
                            value={sp.label}
                            onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                            className="w-1/3 px-3 py-1.5 rounded-lg border border-[#E2DDD2] text-[12.5px] font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. 72″ × 26″ / 183cm × 66cm)"
                            value={sp.value}
                            onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-[#E2DDD2] text-[12.5px]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecRow(idx)}
                            className="w-8 h-8 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors"
                            title="Remove row"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-[#E2DDD2] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {formActiveTab !== "descriptions" && (
                    <button
                      type="button"
                      onClick={() => setFormActiveTab("descriptions")}
                      className="text-[12px] font-bold text-[#1C3325] hover:underline"
                    >
                      ← Back to Descriptions
                    </button>
                  )}
                  {formActiveTab === "descriptions" && (
                    <button
                      type="button"
                      onClick={() => setFormActiveTab("general")}
                      className="text-[12px] font-bold text-[#1C3325] hover:underline"
                    >
                      Next: Titles &amp; Pricing →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-[#E2DDD2] text-[13px] font-bold text-[#5C665F] hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                    className="px-6 py-2 rounded-xl bg-[#1C3325] text-white text-[13px] font-bold shadow-sm hover:bg-[#2D4A37] transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>
                      {createProductMutation.isPending || updateProductMutation.isPending
                        ? "Saving..."
                        : editingProduct
                        ? "Save Changes"
                        : "Create Product"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANAGE ORDER STATUS */}
      {managingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E2DDD2] shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E2DDD2] px-6 py-4 bg-[#F6F4ED]">
              <div>
                <h3 className="font-sans text-base font-bold text-[#1C3325]">
                  Order: {managingOrder.orderId}
                </h3>
                <span className="text-[11px] text-[#5C665F]">
                  Placed by {managingOrder.customerName} (₹{managingOrder.totalAmount})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setManagingOrder(null)}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-[#1C3325] hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOrderStatus} className="p-6 space-y-4">
              {/* Shipping Address Details */}
              <div className="p-3.5 rounded-xl bg-[#F6F4ED] text-[12.5px] space-y-1">
                <span className="font-bold text-[#1C3325] block">Delivery Address:</span>
                <p className="text-[#5C665F]">
                  {managingOrder.shippingAddress?.street}, {managingOrder.shippingAddress?.city},{" "}
                  {managingOrder.shippingAddress?.state} - {managingOrder.shippingAddress?.pincode}
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <span>Phone: <strong>{managingOrder.phone}</strong></span>
                  <a
                    href={`https://wa.me/91${managingOrder.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0E6848] font-bold hover:underline"
                  >
                    Open WhatsApp ↗
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                  Order Status
                </label>
                <select
                  value={orderStatusForm.orderStatus}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, orderStatus: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px] bg-white font-bold text-[#1C3325]"
                >
                  <option value="confirmed">Confirmed (Received)</option>
                  <option value="processing">Processing / Packing</option>
                  <option value="dispatched">Dispatched (Shipped)</option>
                  <option value="delivered">Delivered Successfully</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                  Courier Partner
                </label>
                <input
                  type="text"
                  value={orderStatusForm.courierPartner}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, courierPartner: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C665F] mb-1">
                  Tracking Number / AWB
                </label>
                <input
                  type="text"
                  placeholder="e.g. BD102938475"
                  value={orderStatusForm.trackingNumber}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, trackingNumber: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2DDD2] text-[13px] font-mono"
                />
              </div>

              <div className="pt-3 border-t border-[#E2DDD2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setManagingOrder(null)}
                  className="px-4 py-2 rounded-xl border border-[#E2DDD2] text-[13px] font-bold text-[#5C665F] hover:bg-neutral-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updateOrderMutation.isPending}
                  className="px-6 py-2 rounded-xl bg-[#1C3325] text-white text-[13px] font-bold shadow-sm hover:bg-[#2D4A37] transition-all cursor-pointer"
                >
                  {updateOrderMutation.isPending ? "Updating..." : "Update Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
