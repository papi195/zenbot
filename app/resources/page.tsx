'use client';

import { useState } from 'react';
import { resourceCategories, ResourceCategory, Resource } from '@/lib/resources';
import Link from 'next/link';

const typeConfig: Record<string, { label: string; color: string; textColor: string }> = {
  article: { label: 'Article', color: '#e8f0fe', textColor: '#1a56db' },
  video: { label: 'Video', color: '#fce8e6', textColor: '#c0392b' },
  helpline: { label: 'Helpline', color: '#fce8f3', textColor: '#9b2c6a' },
  exercise: { label: 'Exercise', color: '#e8f5ee', textColor: '#2d6a4f' },
};

function ResourceCard({ resource }: { resource: Resource }) {
  const type = typeConfig[resource.type];
  return (
    <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div
        style={{ background: '#fff', border: '1px solid #ddeee6', borderRadius: '12px', padding: '16px', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#74b49b')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#ddeee6')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: type.color, color: type.textColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {type.label}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#95b8a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#2c3e35', margin: 0, lineHeight: '1.4' }}>
          {resource.title}
        </p>
        <p style={{ fontSize: '12px', color: '#5a8a78', margin: 0, lineHeight: '1.5', flex: 1 }}>
          {resource.description}
        </p>
      </div>
    </a>
  );
}

function CategorySection({ category }: { category: ResourceCategory }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: category.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
          {category.emoji}
        </div>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: category.textColor, margin: 0 }}>
          {category.label}
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
        {category.resources.map((resource, i) => (
          <ResourceCard key={i} resource={resource} />
        ))}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'All Resources' },
    { id: 'crisis', label: '🆘 Crisis Help' },
    { id: 'anxiety', label: '😰 Anxiety' },
    { id: 'depression', label: '💙 Depression' },
    { id: 'campus', label: '🎓 Campus Life' },
    { id: 'selfcare', label: '🌿 Self-Care' },
  ];

  const filtered = activeFilter === 'all'
    ? resourceCategories
    : resourceCategories.filter(c => c.id === activeFilter);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ddeee6', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/chat" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: '#2d6a4f', fontSize: '13px', fontWeight: 500 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Chat
        </Link>
        <div style={{ width: '1px', height: '20px', background: '#ddeee6' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e8f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
            🌿
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#2d6a4f' }}>ZenBot Resource Library</span>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Hero */}
        <div style={{ background: '#fff', border: '1px solid #ddeee6', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📚</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#2d6a4f', margin: '0 0 8px' }}>Mental Health Resources</h1>
          <p style={{ fontSize: '13px', color: '#5a8a78', margin: '0 auto', lineHeight: '1.6', maxWidth: '500px' }}>
            A curated library of mental health resources for Nigerian university students.
            From crisis helplines to self-care tips — all in one place.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                padding: '7px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                border: `1.5px solid ${activeFilter === f.id ? '#2d6a4f' : '#ddeee6'}`,
                background: activeFilter === f.id ? '#2d6a4f' : '#fff',
                color: activeFilter === f.id ? '#fff' : '#5a8a78',
                fontWeight: activeFilter === f.id ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Categories */}
        {filtered.map(category => (
          <CategorySection key={category.id} category={category} />
        ))}

        {/* Footer crisis note */}
        <div style={{ background: '#fff0f0', border: '1px solid #f5c6cb', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#c0392b', margin: 0, lineHeight: '1.6' }}>
            🆘 <strong>In immediate crisis?</strong> Call Mentally Aware Nigeria: <strong>0800-1000-6464</strong> (free, 24/7) or visit your university's student health centre immediately.
          </p>
        </div>
      </div>
    </div>
  );
}