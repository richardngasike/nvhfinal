'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX, FiMapPin, FiDollarSign, FiUser, FiPhone } from 'react-icons/fi';
import { NAIROBI_LOCATIONS, HOUSE_TYPE_LABELS, AMENITIES_LIST } from '../lib/api';

const HOUSE_TYPES = Object.entries(HOUSE_TYPE_LABELS);

export default function ListingForm({ initialData = {}, onSubmit, loading, submitLabel = 'Submit', existingImages = [] }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    price: initialData.price || '',
    location: initialData.location || '',
    houseType: initialData.houseType || '',
    description: initialData.description || '',
    amenities: initialData.amenities || [],
    landlordName: initialData.landlordName || '',
    landlordPhone: initialData.landlordPhone || '',
  });
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const toggleAmenity = (a) => {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter((x) => x !== a)
        : [...p.amenities, a],
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal = (existingImages.length - removedImageIds.length) + newImages.length;
    const allowed = Math.min(5 - currentTotal, files.length);
    const chosen = files.slice(0, allowed);

    setNewImages((p) => [...p, ...chosen]);
    chosen.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews((p) => [...p, { file: file.name, src: ev.target.result }]);
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (idx) => {
    setNewImages((p) => p.filter((_, i) => i !== idx));
    setImagePreviews((p) => p.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (id) => setRemovedImageIds((p) => [...p, id]);

  const validate = () => {
    const e = {};
    if (!form.title.trim() || form.title.length < 5) e.title = 'Title must be at least 5 characters.';
    if (!form.price || isNaN(form.price) || Number(form.price) < 1) e.price = 'Enter a valid price.';
    if (!form.location) e.location = 'Please select a location.';
    if (!form.houseType) e.houseType = 'Please select a house type.';
    if (!form.description.trim() || form.description.length < 20) e.description = 'Description must be at least 20 characters.';
    if (!form.landlordName.trim()) e.landlordName = 'Landlord name is required.';
    if (!form.landlordPhone.trim()) e.landlordPhone = 'Landlord phone is required.';
    const totalImages = (existingImages.length - removedImageIds.length) + newImages.length;
    if (totalImages === 0) e.images = 'Please upload at least 1 image.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'amenities') {
        fd.append(k, JSON.stringify(v));
      } else {
        fd.append(k, v);
      }
    });
    newImages.forEach((file) => fd.append('images', file));
    if (removedImageIds.length > 0) fd.append('removeImages', JSON.stringify(removedImageIds));

    onSubmit(fd);
  };

  const keepExisting = existingImages.filter((img) => !removedImageIds.includes(img.id));
  const totalImages = keepExisting.length + newImages.length;

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div className="form-group">
        <label className="form-label">Listing Title <span className="required">*</span></label>
        <input className="form-input" placeholder="e.g. Modern One Bedroom in Westlands" value={form.title} onChange={(e) => update('title', e.target.value)} maxLength={200} />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      {/* Price & Location */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Monthly Rent (KES) <span className="required">*</span></label>
          <div style={{ position: 'relative' }}>
            <FiDollarSign style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: 36 }} type="number" placeholder="25000" value={form.price} onChange={(e) => update('price', e.target.value)} min="1" />
          </div>
          {errors.price && <span className="form-error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Location <span className="required">*</span></label>
          <div style={{ position: 'relative' }}>
            <FiMapPin style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
            <select className="form-select" style={{ paddingLeft: 36 }} value={form.location} onChange={(e) => update('location', e.target.value)}>
              <option value="">Select Area</option>
              {NAIROBI_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          {errors.location && <span className="form-error">{errors.location}</span>}
        </div>
      </div>

      {/* House Type */}
      <div className="form-group">
        <label className="form-label">House Type <span className="required">*</span></label>
        <select className="form-select" value={form.houseType} onChange={(e) => update('houseType', e.target.value)}>
          <option value="">Select House Type</option>
          {HOUSE_TYPES.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
        </select>
        {errors.houseType && <span className="form-error">{errors.houseType}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description <span className="required">*</span></label>
        <textarea className="form-textarea" placeholder="Describe the property: size, features, nearby amenities, access routes..." value={form.description} onChange={(e) => update('description', e.target.value)} maxLength={2000} rows={5} />
        <span className="form-hint">{form.description.length}/2000 characters (min 20)</span>
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      {/* Amenities */}
      <div className="form-group">
        <label className="form-label">Amenities Available</label>
        <div className="checkbox-grid">
          {AMENITIES_LIST.map((a) => (
            <label key={a} className={`checkbox-item ${form.amenities.includes(a) ? 'checked' : ''}`}>
              <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
              {a}
            </label>
          ))}
        </div>
      </div>

      {/* Landlord Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Landlord Name <span className="required">*</span></label>
          <div style={{ position: 'relative' }}>
            <FiUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Your full name" value={form.landlordName} onChange={(e) => update('landlordName', e.target.value)} />
          </div>
          {errors.landlordName && <span className="form-error">{errors.landlordName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Contact Phone <span className="required">*</span></label>
          <div style={{ position: 'relative' }}>
            <FiPhone style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: 36 }} type="tel" placeholder="+254712345678" value={form.landlordPhone} onChange={(e) => update('landlordPhone', e.target.value)} />
          </div>
          {errors.landlordPhone && <span className="form-error">{errors.landlordPhone}</span>}
        </div>
      </div>

      {/* Images */}
      <div className="form-group">
        <label className="form-label">Property Images <span className="required">*</span> <span className="form-hint" style={{ fontWeight: 400 }}>(up to 5, max 5MB each)</span></label>

        {/* Existing images */}
        {keepExisting.length > 0 && (
          <div className="upload-preview" style={{ marginBottom: 10 }}>
            {keepExisting.map((img) => (
              <div key={img.id} className="upload-thumb" style={{ position: 'relative' }}>
                <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${img.path}`} alt="existing" />
                <button type="button" className="upload-thumb-remove" onClick={() => removeExistingImage(img.id)}>
                  <FiX size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {totalImages < 5 && (
          <>
            <div className="upload-area" onClick={() => fileRef.current?.click()}>
              <FiUpload size={28} style={{ color: 'var(--primary)', margin: '0 auto' }} />
              <p>Click to upload images <br />(JPEG, PNG, WebP — max 5MB each)</p>
              <p style={{ fontSize: '0.75rem', marginTop: 4 }}>{totalImages}/5 images added</p>
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display: 'none' }} onChange={handleFileChange} />
          </>
        )}

        {imagePreviews.length > 0 && (
          <div className="upload-preview" style={{ marginTop: 10 }}>
            {imagePreviews.map((img, i) => (
              <div key={i} className="upload-thumb">
                <img src={img.src} alt={`preview ${i + 1}`} />
                <button type="button" className="upload-thumb-remove" onClick={() => removeNewImage(i)}>
                  <FiX size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.images && <span className="form-error">{errors.images}</span>}
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
