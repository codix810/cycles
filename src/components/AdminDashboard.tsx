// components/AdminDashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Admin Dashboard (Ready)
 * - Stats
 * - Tabs (clients / craftsmen / admins)
 * - Edit modal (user + craftsman fields)
 * - Toggle role / approve / toggle status
 * - Preview work images (lightbox)
 *
 * Assumes backend endpoints listed above exist and return JSON.
 */

type Role = "client" | "craftsman" | "admin";

type UserType = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  createdAt?: string;
};

type CraftsmanType = {
  _id: string;
  userId: string | null;
  jobTitle?: string;
  description?: string;
  experienceYears?: number;
  address?: string;
  status?: "available" | "busy";
  isApproved?: boolean;
  profileImage?: string;
  idCardImage?: string;
  workImages?: string[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<{ users: UserType[]; craftsmen: CraftsmanType[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"clients" | "craftsmen" | "admins">("clients");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedCraftsman, setSelectedCraftsman] = useState<CraftsmanType | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const api = {
    users: "/api/admin/users",
    updateUser: (id: string) => `/api/admin/update-user/${id}`,
    toggleRole: (id: string) => `/api/admin/toggle-role/${id}`,
    approve: (id: string) => `/api/admin/approve/${id}`,
    toggleStatus: (id: string) => `/api/admin/toggle-status/${id}`,
    deleteUser: (id: string) => `/api/admin/delete/${id}`,
  };

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(api.users, { cache: "no-store", credentials: "include" });
      const j = await res.json();
      setData(j);
    } catch (err) {
      console.error(err);
      setToast("فشل جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleRole = async (userId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(api.toggleRole(userId), { method: "PUT", credentials: "include" });
      const j = await res.json();
      if (!res.ok) showToast(j.error || "فشل تغيير الدور");
      else showToast("تم تغيير الدور");
      await load();
    } catch (e) {
      showToast("خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (craftsmanId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(api.approve(craftsmanId), { method: "PUT", credentials: "include" });
      const j = await res.json();
      if (!res.ok) showToast(j.error || "فشل الموافقة");
      else showToast("تمت الموافقة");
      await load();
    } catch {
      showToast("خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (craftsmanId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(api.toggleStatus(craftsmanId), { method: "PUT", credentials: "include" });
      const j = await res.json();
      if (!res.ok) showToast(j.error || "فشل تحديث الحالة");
      else showToast("تم تحديث الحالة");
      await load();
    } catch {
      showToast("خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const res = await fetch(api.deleteUser(selectedUser._id), { method: "DELETE", credentials: "include" });
      const j = await res.json();
      if (!res.ok) showToast(j.error || "فشل الحذف");
      else showToast("تم الحذف");
      setDeleteOpen(false);
      setSelectedUser(null);
      await load();
    } catch {
      showToast("خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  const openEdit = (user: UserType, craftsman?: CraftsmanType | null) => {
    // important: choose correct id - user._id should be user doc id
    setSelectedUser(user);
    setSelectedCraftsman(craftsman || null);

    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: (user as any).phone || "",
      role: craftsman ? "craftsman" : user.role,
      jobTitle: craftsman?.jobTitle || "",
      description: craftsman?.description || "",
      experienceYears: craftsman?.experienceYears || "",
      address: craftsman?.address || "",
      status: craftsman?.status || "busy",
      isApproved: craftsman?.isApproved ?? false,
    });

    setEditOpen(true);
  };

  const handleEditChange = (e: any) => {
    const { name, value } = e.target;
    setEditForm((p: any) => ({ ...p, [name]: value }));
  };

  const saveEdit = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    const payload: any = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
    };

    if (editForm.role === "craftsman") {
      payload.jobTitle = editForm.jobTitle;
      payload.description = editForm.description;
      payload.experienceYears = Number(editForm.experienceYears || 0);
      payload.address = editForm.address;
      // ensure boolean
      payload.isApproved = editForm.isApproved === "true" || editForm.isApproved === true;
      payload.status = editForm.status;
    }

    try {
      const res = await fetch(`/api/admin/update-user/${selectedUser._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) showToast(j.error || "فشل الحفظ");
      else showToast("تم الحفظ");
      setEditOpen(false);
      setSelectedUser(null);
      setSelectedCraftsman(null);
      await load();
    } catch (e) {
      console.error(e);
      showToast("خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  // derived lists
  const users = data?.users || [];
  const craftsmen = data?.craftsmen || [];
  const clients = users.filter((u) => u.role === "client");
  const admins = users.filter((u) => u.role === "admin");
  const craftUsers = users.filter((u) => u.role === "craftsman");

  // stats (simple)
  const total = users.length;
  const totalCrafts = craftUsers.length;
  const totalAdmins = admins.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">لوحة تحكم الأدمن</h1>
            <p className="text-sm text-slate-500">مراقبة المستخدمين والصنايعية — تحكم كامل.</p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="text-xs text-slate-500">إجمالي المستخدمين</div>
            <div className="px-3 py-2 rounded-xl bg-white shadow flex items-center gap-3">
              <div className="text-lg font-bold">{total}</div>
              <div className="text-xs text-slate-400">مصنّف: {totalCrafts} صنايعي · {totalAdmins} أدمن</div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Stat label="عملاء" value={clients.length} color="from-indigo-400 to-sky-400" />
          <Stat label="صنايعية" value={craftUsers.length} color="from-emerald-400 to-teal-400" />
          <Stat label="أدمن" value={admins.length} color="from-rose-400 to-pink-400" />
        </section>

        <nav className="flex gap-2 mb-4">
          <Tab label="العملاء" active={tab === "clients"} onClick={() => setTab("clients")} />
          <Tab label="الصنايعية" active={tab === "craftsmen"} onClick={() => setTab("craftsmen")} />
          <Tab label="المديرين" active={tab === "admins"} onClick={() => setTab("admins")} />
        </nav>

        <main className="space-y-4">
          {loading && <div className="p-6 bg-white rounded shadow text-center">جاري تحميل البيانات...</div>}

          {!loading && (tab === "clients" ? clients : tab === "admins" ? admins : craftUsers).length === 0 && (
            <div className="p-6 bg-white rounded shadow text-center text-slate-500">لا يوجد عناصر هنا.</div>
          )}

          {!loading &&
            (tab === "clients" ? clients : tab === "admins" ? admins : craftUsers).map((u) => {
              const crafts = craftsmen.find((c) => c.userId === u._id) || null;
              // For craftsmen tab we want the crafts object
              return tab === "craftsmen" ? (
                <CraftsmanCard
                  key={u._id}
                  user={u}
                  craftsman={crafts}
                  onEdit={() => openEdit(u, crafts)}
                  onDelete={() => {
                    setSelectedUser(u);
                    setDeleteOpen(true);
                  }}
                  onToggleRole={() => handleToggleRole(u._id)}
                  onApprove={() => crafts && handleApprove(crafts._id)}
                  onToggleStatus={() => crafts && handleToggleStatus(crafts._id)}
                  onPreview={(img) => setPreviewImg(img)}
                />
              ) : (
                <UserCard
                  key={u._id}
                  user={u}
                  onEdit={() => openEdit(u, null)}
                  onDelete={() => {
                    setSelectedUser(u);
                    setDeleteOpen(true);
                  }}
                  onToggleRole={() => handleToggleRole(u._id)}
                />
              );
            })}
        </main>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editOpen && selectedUser && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg overflow-auto max-h-[90vh]"
              initial={{ y: 10, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, scale: 0.98 }}
            >
              <h3 className="font-bold mb-3">تعديل: {selectedUser.name}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex flex-col text-sm">
                  <span className="text-xs text-slate-500">الاسم</span>
                  <input name="name" value={editForm.name || ""} onChange={handleEditChange} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="text-xs text-slate-500">الايميل</span>
                  <input name="email" value={editForm.email || ""} onChange={handleEditChange} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="text-xs text-slate-500">التليفون</span>
                  <input name="phone" value={editForm.phone || ""} onChange={handleEditChange} className="border p-2 rounded" />
                </label>

                <label className="flex flex-col text-sm">
                  <span className="text-xs text-slate-500">الدور</span>
                  <select name="role" value={editForm.role || "client"} onChange={handleEditChange} className="border p-2 rounded">
                    <option value="client">عميل</option>
                    <option value="craftsman">صنايعي</option>
                    <option value="admin">أدمن</option>
                  </select>
                </label>
              </div>

              {(editForm.role === "craftsman" || selectedCraftsman) && (
                <>
                  <hr className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="flex flex-col text-sm">
                      <span className="text-xs text-slate-500">مجال الشغل</span>
                      <input name="jobTitle" value={editForm.jobTitle || ""} onChange={handleEditChange} className="border p-2 rounded" />
                    </label>

                    <label className="flex flex-col text-sm">
                      <span className="text-xs text-slate-500">سنين الخبرة</span>
                      <input name="experienceYears" value={editForm.experienceYears || ""} onChange={handleEditChange} className="border p-2 rounded" />
                    </label>

                    <label className="flex flex-col text-sm md:col-span-2">
                      <span className="text-xs text-slate-500">الوصف</span>
                      <textarea name="description" value={editForm.description || ""} onChange={handleEditChange} className="border p-2 rounded min-h-[80px]" />
                    </label>

                    <label className="flex flex-col text-sm">
                      <span className="text-xs text-slate-500">العنوان</span>
                      <input name="address" value={editForm.address || ""} onChange={handleEditChange} className="border p-2 rounded" />
                    </label>

                    <label className="flex flex-col text-sm">
                      <span className="text-xs text-slate-500">الحالة</span>
                      <select name="status" value={editForm.status || "busy"} onChange={handleEditChange} className="border p-2 rounded">
                        <option value="available">متاح</option>
                        <option value="busy">مشغول</option>
                      </select>
                    </label>

                    <label className="flex flex-col text-sm">
                      <span className="text-xs text-slate-500">موافقة الأدمن</span>
                      <select name="isApproved" value={String(editForm.isApproved)} onChange={handleEditChange} className="border p-2 rounded">
                        <option value="false">تحت المراجعة</option>
                        <option value="true">مقبول</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => { setEditOpen(false); setSelectedUser(null); setSelectedCraftsman(null); }} className="px-3 py-2 rounded border">إلغاء</button>
                <button onClick={saveEdit} disabled={actionLoading} className="px-4 py-2 rounded bg-blue-600 text-white">{actionLoading ? "جارٍ..." : "حفظ"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteOpen && selectedUser && (
          <motion.div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-xl p-6 shadow max-w-sm w-full" initial={{ y: 10 }} animate={{ y: 0 }} exit={{ y: 10 }}>
              <h4 className="font-bold">تأكيد حذف</h4>
              <p className="text-sm text-slate-600 mt-2">هل أنت متأكد تريد حذف {selectedUser.name} نهائيًا؟</p>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setDeleteOpen(false)} className="px-3 py-1 rounded border">إلغاء</button>
                <button onClick={handleDelete} disabled={actionLoading} className="px-3 py-1 rounded bg-red-500 text-white">{actionLoading ? "حذف..." : "حذف"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* image preview */}
      <AnimatePresence>
        {previewImg && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewImg(null)}>
            <motion.img src={previewImg} initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="max-w-full max-h-[90vh] rounded-lg shadow-lg object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* toast */}
      {toast && <div className="fixed left-1/2 -translate-x-1/2 bottom-6 bg-slate-900 text-white px-4 py-2 rounded-lg shadow">{toast}</div>}
    </div>
  );
}

/* ----- small UI pieces ----- */

function Stat({ label, value, color = "from-indigo-400 to-sky-400" }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold`}>{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-xl ${active ? "bg-slate-900 text-white" : "bg-white text-slate-700 shadow"}`}>{label}</button>
  );
}

function UserCard({ user, onEdit, onDelete, onToggleRole }: { user: UserType; onEdit: () => void; onDelete: () => void; onToggleRole: () => void }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
      <div>
        <div className="font-semibold">{user.name}</div>
        <div className="text-xs text-slate-500">{user.email} • <span className="capitalize">{user.role}</span></div>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="px-2 py-1 rounded bg-slate-100">تعديل</button>
        <button onClick={onToggleRole} className="px-2 py-1 rounded bg-yellow-100">دور</button>
        <button onClick={onDelete} className="px-2 py-1 rounded bg-red-100">حذف</button>
      </div>
    </div>
  );
}

function CraftsmanCard({
  user,
  craftsman,
  onEdit,
  onDelete,
  onToggleRole,
  onApprove,
  onToggleStatus,
  onPreview,
}: {
  user: UserType;
  craftsman: CraftsmanType | null;
  onEdit: () => void;
  onDelete: () => void;
  onToggleRole: () => void;
  onApprove: () => void;
  onToggleStatus: () => void;
  onPreview: (img: string) => void;
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 shrink-0 overflow-hidden">
          {craftsman?.profileImage ? <img src={craftsman.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400">صورة</div>}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-slate-500">{craftsman?.jobTitle || "غير محدد"} · {craftsman?.experienceYears || 0} سنة</div>
            </div>

            <div className="flex flex-col items-end gap-1 text-xs">
              <span className={`px-2 py-1 rounded-full ${craftsman?.status === "available" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{craftsman?.status === "available" ? "متاح" : "مشغول"}</span>
              <span className={`px-2 py-1 rounded-full ${craftsman?.isApproved ? "bg-sky-100 text-sky-700" : "bg-red-100 text-red-700"}`}>{craftsman?.isApproved ? "مقبول" : "تحت المراجعة"}</span>
            </div>
          </div>

          {craftsman?.description && <p className="text-sm text-slate-600 mt-2">{craftsman.description}</p>}

          {craftsman?.workImages && craftsman.workImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {craftsman.workImages.slice(0, 6).map((img, i) => (
                <img key={i} src={img} className="w-full h-20 object-cover rounded cursor-pointer" onClick={() => onPreview(img)} />
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button onClick={onEdit} className="px-3 py-1 rounded bg-slate-100 text-sm">تعديل</button>
            {!craftsman?.isApproved && <button onClick={onApprove} className="px-3 py-1 rounded bg-emerald-500 text-white text-sm">موافقة</button>}
            <button onClick={onToggleStatus} className="px-3 py-1 rounded bg-indigo-100 text-sm">تبديل حالة</button>
            <button onClick={onToggleRole} className="px-3 py-1 rounded bg-yellow-100 text-sm">دور</button>
            <button onClick={onDelete} className="px-3 py-1 rounded bg-red-100 text-sm">حذف</button>
          </div>
        </div>
      </div>
    </div>
  );
}
