import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPayment, getBooking } from '../api';

export default function PaymentPage(){
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDraft = location.state?.bookingDraft || null;
  const [bookingId] = useState(
    location.state?.booking_id || (!bookingDraft ? (() => { try { return sessionStorage.getItem('booking_id'); } catch(e){ return null } })() : null)
  );
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [amount, setAmount] = useState(location.state?.booking?.total_amount || '');
  const [card_number, setCardNumber] = useState('');
  const [expiry_date, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!booking && bookingId) {
      getBooking(bookingId)
        .then((data) => {
          setBooking(data);
          setAmount(data.total_amount || '');
        })
        .catch((e) => { console.error('Failed fetching booking', e); });
    }
  }, [booking, bookingId]);

  async function handlePay(e){
    e.preventDefault();
    if (!bookingId && !bookingDraft) { alert('Booking details missing'); return; }
    if (!card_number || !expiry_date || !cvv) { alert('Please fill in all card details'); return; }
    setLoading(true);
    try{
      const body = {
        ...(bookingId ? { booking_id: bookingId } : bookingDraft),
        total_amount: amount || (booking && booking.total_amount) || '',
        card_number: card_number.replace(/\s/g, ''),
        expiry_date,
        cvv,
      };
      const res = await createPayment(body);
      if (res && res.success) {
        const nextBooking = res.booking || {
          ...booking,
          ...bookingDraft,
          booking_id: res.booking_id,
          total_amount: res.amount,
          payment_status: 'paid',
          masked_card: res.masked_card,
          transaction_id: res.transaction_id,
        };
        try{ sessionStorage.setItem('booking_id', res.booking_id); }catch(e){}
        navigate('/booking/confirmed', {
          state: { booking: { ...nextBooking, payment_status: 'paid' } }
        });
      } else {
        alert(res?.error || 'Payment failed. Please try again.');
      }
    }catch(e){
      console.error(e);
      alert(e.message || 'Network error during payment. Make sure backend is running.');
    }finally{ setLoading(false); }
  }

  const handleCardChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    if (val.length <= 19) setCardNumber(val);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
    if (val.length <= 5) setExpiryDate(val);
  };

  return (
    <div style={{ minHeight:'100vh', padding: '40px 24px', fontFamily:"'Poppins', sans-serif", background:'linear-gradient(180deg,#ffeef3,#fff9fb)'}}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>
        <div style={{ background:'linear-gradient(90deg,#ffb6c1,#f7c7dc)', padding:18, borderRadius:10, color:'#fff', marginBottom:24, boxShadow:'0 4px 15px rgba(255,182,193,0.3)' }}>
          <div style={{ fontSize:16, fontWeight:600, cursor:'pointer' }} onClick={() => navigate(-1)}>Back</div>
          <h1 style={{ margin:'8px 0 0', color:'#fff', fontFamily:"'Abril Fatface', serif", letterSpacing:1 }}>Secure Payment</h1>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, background:'#fff', padding:32, borderRadius:16, boxShadow:'0 8px 30px rgba(0,0,0,0.06)'}}>
            <h2 style={{ color:'#4A4A4A', margin:'0 0 24px 0', fontSize:22 }}>Payment Method</h2>

            <form onSubmit={handlePay}>
              {!bookingId && !bookingDraft && <div style={{ padding:12, borderRadius:8, background:'#ffebeb', color:'#d32f2f', marginBottom:20, fontSize:14 }}>Booking details missing. Please start from the service page.</div>}

              <div style={{ marginBottom:20 }}>
                <label style={{ display:'block', marginBottom:8, color:'#6B6B6B', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>Card Number</label>
                <input required value={card_number} onChange={handleCardChange} placeholder='0000 0000 0000 0000' style={{ width:'100%', padding:'12px', borderRadius:8, border:'1px solid #ffd6e6', background:'#fff5f7', color:'#4a4a4a', fontSize:16, letterSpacing:2, boxSizing:'border-box', outlineColor:'#ffb6c1' }} />
              </div>

              <div style={{ display:'flex', gap:16, marginBottom:28 }}>
                <div style={{ flex:1 }}>
                  <label style={{ display:'block', marginBottom:8, color:'#6B6B6B', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>Expiry Date</label>
                  <input required value={expiry_date} onChange={handleExpiryChange} placeholder='MM/YY' style={{ width:'100%', padding:'12px', borderRadius:8, border:'1px solid #ffd6e6', background:'#fff5f7', color:'#4a4a4a', fontSize:16, textAlign:'center', boxSizing:'border-box', outlineColor:'#ffb6c1' }} />
                </div>
                <div style={{ flex:1 }}>
                  <label style={{ display:'block', marginBottom:8, color:'#6B6B6B', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>CVV</label>
                  <input required type="password" maxLength={3} value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g, ''))} placeholder='***' style={{ width:'100%', padding:'12px', borderRadius:8, border:'1px solid #ffd6e6', background:'#fff5f7', color:'#4a4a4a', fontSize:16, textAlign:'center', letterSpacing:4, boxSizing:'border-box', outlineColor:'#ffb6c1' }} />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20 }}>
                <button type='submit' disabled={loading || (!bookingId && !bookingDraft)} style={{ width:'100%', background:'linear-gradient(135deg,#ff9dbf,#f7c7dc)', color:'#fff', padding:'16px', borderRadius:30, border:'none', fontSize:16, fontWeight:700, cursor: loading || (!bookingId && !bookingDraft) ? 'not-allowed' : 'pointer', boxShadow:'0 4px 15px rgba(255,157,191,0.4)', textTransform:'uppercase', letterSpacing:1 }}>
                  {loading ? 'Processing Securely...' : `Pay ${amount}`}
                </button>
              </div>
            </form>
          </div>

          <aside style={{ width:320 }}>
            <div style={{ background:'#fff', padding:24, borderRadius:16, boxShadow:'0 8px 30px rgba(0,0,0,0.06)' }}>
              <h3 style={{ marginTop:0, color:'#4a4a4a', fontSize:18, borderBottom:'1px solid #ffeef3', paddingBottom:12, marginBottom:16 }}>Order Summary</h3>
              {booking && booking.service && (
                <div style={{ display:'flex', gap:12, marginBottom:16 }}>
                  <img src={booking.service.image || '/'} alt='' style={{ width:60, height:60, objectFit:'cover', borderRadius:8 }} onError={e => e.target.style.display='none'} />
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:'#4a4a4a' }}>{booking.service.title}</div>
                    <div style={{ fontSize:12, color:'#888', marginTop:4 }}>{booking.event_date} at {booking.event_time}</div>
                  </div>
                </div>
              )}
              <div style={{ background:'#fff6f9', padding:16, borderRadius:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14, color:'#666' }}>
                  <span>Subtotal</span><span>{amount}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:14, color:'#666' }}>
                  <span>Taxes</span><span>$0.00</span>
                </div>
                <div style={{ borderTop:'1px dashed #ffb6c1', paddingTop:12, display:'flex', justifyContent:'space-between', fontSize:18, fontWeight:700, color:'#ff6f98' }}>
                  <span>Total Due</span><span>{amount}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
