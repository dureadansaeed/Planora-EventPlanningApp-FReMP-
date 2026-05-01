import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../api';

const styles = {
  page: { minHeight: '100vh', background: '#FFF5F7', fontFamily: "'Arimo', sans-serif" },
  hero: { width: '100%', height: '400px', objectFit: 'cover' },
  container: { maxWidth: '800px', margin: '-60px auto 40px', background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 8px 30px rgba(255,182,193,0.3)', position: 'relative', zIndex: 10 },
  category: { textTransform: 'uppercase', color: '#FF6F91', fontWeight: 700, fontSize: '14px', letterSpacing: '1px', marginBottom: '8px' },
  title: { fontSize: '36px', color: '#333', margin: '0 0 20px 0', fontFamily: "'Abril Fatface', serif" },
  description: { fontSize: '18px', color: '#555', lineHeight: '1.6', marginBottom: '30px' },
  metaRow: { display: 'flex', gap: '40px', borderTop: '1px solid #FFE4E8', borderBottom: '1px solid #FFE4E8', padding: '20px 0', marginBottom: '30px' },
  metaItem: { display: 'flex', flexDirection: 'column', gap: '5px' },
  metaLabel: { fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' },
  metaValue: { fontSize: '18px', color: '#333', fontWeight: 700 },
  details: { fontSize: '16px', color: '#666', lineHeight: '1.6', marginBottom: '40px', padding: '20px', background: '#FFF0F5', borderRadius: '10px', borderLeft: '4px solid #FFB6C1' },
  bookBtn: { width: '100%', padding: '16px', fontSize: '18px', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #FF6F91 0%, #FF9671 100%)', border: 'none', borderRadius: '30px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(255,111,145,0.4)', textAlign: 'center' },
  backBtn: { background: 'none', border: 'none', color: '#FF6F91', cursor: 'pointer', fontSize: '16px', fontWeight: 700, padding: 0, marginBottom: '20px', textDecoration: 'none' }
};

export default function EventDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getServiceById(serviceId)
      .then(data => {
        if (data && !data.error) {
          setService(data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [serviceId]);

  if (loading) {
    return <div style={{ ...styles.page, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', color: '#FF6F91' }}>Loading gorgeous details...</div>;
  }

  if (error || !service) {
    return (
      <div style={{ ...styles.page, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#FF6F91', fontFamily: "'Abril Fatface', serif" }}>Event not found</h2>
        <button style={styles.backBtn} onClick={() => navigate('/user/services')}>← Back to Services</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <img src={service.image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200"} alt={service.title} style={styles.hero} />
      
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate('/user/services')}>← Back to Services</button>
        
        <div style={styles.category}>{service.category || 'Event'}</div>
        <h1 style={styles.title}>{service.title}</h1>
        <p style={styles.description}>{service.description}</p>
        
        <div style={styles.metaRow}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Duration</span>
            <span style={styles.metaValue}>{service.duration || 'Flexible'}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Starting Price</span>
            <span style={styles.metaValue}>${service.price ? service.price.toLocaleString() : 'TBD'}</span>
          </div>
        </div>

        {service.details && (
          <div style={styles.details}>
            <strong>What's Included:</strong><br/>
            {service.details}
          </div>
        )}

        <button 
          style={styles.bookBtn} 
          onClick={() => navigate(`/book/${serviceId}`)}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Book This Experience
        </button>
      </div>
    </div>
  );
}
