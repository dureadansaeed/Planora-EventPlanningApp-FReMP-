import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyBookings } from '../api';
import NavigationBar from '../components/UserComponents/NavigationBar';

const styles = {
  page: { padding: '40px 24px', fontFamily: "'Poppins', sans-serif", background: 'linear-gradient(180deg,#fff2f6,#fff9fb)', minHeight: '100vh' },
  container: { maxWidth: 900, margin: '0 auto' },
  header: { background:'#fff', padding:'24px', borderRadius:16, boxShadow:'0 8px 30px rgba(0,0,0,0.06)', marginBottom:24 },
  card: { background:'#fff', padding:24, borderRadius:16, boxShadow:'0 8px 30px rgba(0,0,0,0.05)', marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'flex-start', border:'1px solid #ffd6e6' },
  badge: (status) => {
    const s = (status||'').toLowerCase();
    let bg = '#eee', color = '#555';
    if(s==='pending') { bg = '#fffce0'; color = '#b58500'; }
    if(s==='approved') { bg = '#e8f8f0'; color = '#0bb57a'; }
    if(s==='rejected' || s==='cancelled') { bg = '#ffebee'; color = '#ff5a5f'; }
    return { padding:'6px 12px', borderRadius:20, background:bg, color:color, fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:1 };
  },
  btn: { padding:'8px 16px', borderRadius:24, border:'none', cursor:'pointer', fontWeight:700, fontSize:13, transition:'0.2s' },
  primary: { background:'linear-gradient(135deg,#ff9dbf,#f7c7dc)', color:'#fff', boxShadow:'0 4px 12px rgba(255,157,191,0.3)' },
  outline: { background:'#fff5f7', color:'#ff6f98', border:'2px solid #ffd6e6' },
};

export default function UserBookings(){
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    loadBookings();
  }, []);

  async function loadBookings(){
    setLoading(true);
    try{
      const data = await fetchMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    }catch(e){
      console.error('Failed fetching bookings', e);
      setBookings([]);
    }finally{ setLoading(false); }
  }

  return (
    <div style={styles.page}>
      <NavigationBar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ margin:0, color:'#4a4a4a', fontSize:26, fontFamily:"'Abril Fatface', serif" }}>My Bookings</h1>
          <div style={{ color:'#888', marginTop:6 }}>Track all your paid bookings and their status</div>
          <button onClick={() => navigate('/user-dashboard')} style={{ ...styles.btn, ...styles.outline, marginTop:12 }}>Back to Dashboard</button>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'#ff9dbf', fontWeight:700 }}>Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:16, padding:40, textAlign:'center', boxShadow:'0 8px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>Bookings</div>
            <h3 style={{ color:'#4a4a4a', margin:'0 0 8px 0' }}>No bookings yet</h3>
            <p style={{ color:'#888', margin:'0 0 20px 0' }}>You have not made any bookings. Browse our services to get started.</p>
            <button onClick={() => navigate('/user/services')} style={{ ...styles.btn, ...styles.primary, padding:'12px 24px' }}>Browse Services</button>
          </div>
        ) : (
          bookings.map(b => (
            <div key={b._id || b.booking_id} style={styles.card}>
              <div style={{ flex: 1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                  {b.service?.image && (
                    <img src={b.service.image} alt='' style={{ width:50, height:50, borderRadius:8, objectFit:'cover' }} onError={e => e.target.style.display='none'} />
                  )}
                  <div>
                    <div style={{ fontWeight:800, color:'#4a4a4a', fontSize:18 }}>
                      {b.service?.title || (b.service_deleted ? 'Service no longer available' : 'Event Service')}
                    </div>
                    <div style={{ color:'#888', fontSize:12, fontFamily:'monospace' }}>REF: #{b.booking_id}</div>
                  </div>
                  <span style={styles.badge(b.status)}>{b.status || 'pending'}</span>
                </div>

                {b.service_deleted && (
                  <div style={{ color:'#b58500', fontSize:13, marginBottom:8 }}>
                    This service has been removed from the catalog and can no longer be booked.
                  </div>
                )}

                <div style={{ color:'#666', fontSize:13, display:'flex', gap:16, flexWrap:'wrap', marginTop:8 }}>
                  <span><b>Date:</b> {b.event_date}</span>
                  <span><b>Time:</b> {b.event_time}</span>
                  {b.event_location && <span><b>Location:</b> {b.event_location}</span>}
                  {b.event_theme && <span><b>Theme:</b> {b.event_theme}</span>}
                </div>
              </div>

              <div style={{ textAlign:'right', minWidth:200 }}>
                <div style={{ fontWeight:800, color:'#ff6f98', fontSize:22 }}>{b.total_amount}</div>
                <div style={{ color: b.payment_status==='paid' ? '#0bb57a' : '#aaa', fontSize:12, fontWeight:700, textTransform:'uppercase', margin:'4px 0 16px 0' }}>
                  {b.payment_status === 'paid' ? 'Payment Secured' : b.payment_status === 'refunded' ? 'Refunded' : 'Payment Pending'}
                </div>

                <div style={{ display:'flex', gap:8, justifyContent:'flex-end', flexWrap:'wrap' }}>
                  {b.payment_status === 'paid' && (
                    <button onClick={() => navigate('/booking/confirmed', { state: { booking: b } })} style={{...styles.btn, ...styles.outline}}>
                      Receipt
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
