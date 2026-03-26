'use client';

import { useState, useCallback } from 'react';
import { FiSearch, FiFilter, FiX, FiSliders } from 'react-icons/fi';
import { NAIROBI_LOCATIONS, HOUSE_TYPE_LABELS } from '../lib/api';

const HOUSE_TYPES = Object.entries(HOUSE_TYPE_LABELS);

export default function Filters({ params, onChange, total }) {
  const [expanded, setExpanded] = useState(false);
  const [local, setLocal] = useState({
    search: params.search || '',
    location: params.location || '',
    houseType: params.houseType || '',
    minPrice: params.minPrice || '',
    maxPrice: params.maxPrice || '',
    sortBy: params.sortBy || 'createdAt',
    sortOrder: params.sortOrder || 'desc',
  });

  const update = (key, value) => setLocal((p) => ({ ...p, [key]: value }));

  const handleSearch = (e) => {
    e.preventDefault();
    onChange({ ...local, page: 1 });
  };

  const handleReset = () => {
    const empty = { search: '', location: '', houseType: '', minPrice: '', maxPrice: '', sortBy: 'createdAt', sortOrder: 'desc' };
    setLocal(empty);
    onChange({ ...empty, page: 1 });
  };

  const activeFilters = [];
  if (local.search) activeFilters.push({ key: 'search', label: `"${local.search}"` });
  if (local.location) activeFilters.push({ key: 'location', label: local.location });
  if (local.houseType) activeFilters.push({ key: 'houseType', label: HOUSE_TYPE_LABELS[local.houseType] });
  if (local.minPrice) activeFilters.push({ key: 'minPrice', label: `Min KES ${Number(local.minPrice).toLocaleString()}` });
  if (local.maxPrice) activeFilters.push({ key: 'maxPrice', label: `Max KES ${Number(local.maxPrice).toLocaleString()}` });

  const removeFilter = (key) => {
    const updated = { ...local, [key]: '' };
    setLocal(updated);
    onChange({ ...updated, page: 1 });
  };

  return (
    <div className="filters-bar">
      <form onSubmit={handleSearch}>
        <div className="filters-row">
          {/* Search */}
          <div className="filter-group" style={{ flex: 2, minWidth: 200 }}>
            <label className="filter-label">Search</label>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: 36 }}
                placeholder="Search listings, areas..."
                value={local.search}
                onChange={(e) => update('search', e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="filter-group">
            <label className="filter-label">Location</label>
            <select className="form-select" value={local.location} onChange={(e) => update('location', e.target.value)}>
              <option value="">All Areas</option>
              {NAIROBI_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* House Type */}
          <div className="filter-group">
            <label className="filter-label">House Type</label>
            <select className="form-select" value={local.houseType} onChange={(e) => update('houseType', e.target.value)}>
              <option value="">All Types</option>
              {HOUSE_TYPES.map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Toggle more */}
          <div className="filter-group">
            <label className="filter-label">&nbsp;</label>
            <button type="button" className="btn btn-ghost" onClick={() => setExpanded(!expanded)}>
              <FiSliders /> {expanded ? 'Less' : 'More'}
            </button>
          </div>

          <div className="filter-actions">
            <button type="submit" className="btn btn-primary">
              <FiSearch /> Search
            </button>
            {activeFilters.length > 0 && (
              <button type="button" className="btn btn-ghost" onClick={handleReset}>
                <FiX /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Expanded filters */}
        {expanded && (
          <div className="filters-row" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div className="filter-group">
              <label className="filter-label">Min Price (KES)</label>
              <input className="form-input" type="number" placeholder="e.g. 10000" value={local.minPrice} onChange={(e) => update('minPrice', e.target.value)} min="0" />
            </div>
            <div className="filter-group">
              <label className="filter-label">Max Price (KES)</label>
              <input className="form-input" type="number" placeholder="e.g. 80000" value={local.maxPrice} onChange={(e) => update('maxPrice', e.target.value)} min="0" />
            </div>
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select className="form-select" value={local.sortBy} onChange={(e) => update('sortBy', e.target.value)}>
                <option value="createdAt">Newest First</option>
                <option value="price">Price</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Order</label>
              <select className="form-select" value={local.sortOrder} onChange={(e) => update('sortOrder', e.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        )}
      </form>

      {/* Active filter tags */}
      {activeFilters.length > 0 && (
        <div className="filters-active">
          {total != null && (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              {total} result{total !== 1 ? 's' : ''}
            </span>
          )}
          {activeFilters.map((f) => (
            <span key={f.key} className="filter-tag">
              {f.label}
              <button onClick={() => removeFilter(f.key)} aria-label={`Remove ${f.key} filter`}><FiX /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
