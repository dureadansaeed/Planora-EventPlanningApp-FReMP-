import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAvailableTimeslots, getServiceById } from '../api';

export default function BookingForm(){
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [eventTheme, setEventTheme] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load(){
    try{
      const [ts, svc] = await Promise.all([fetchAvailableTimeslots(), getServiceById(serviceId)]);
      setSlots(Array.isArray(ts) ? ts : []);
      setService(svc);
    }catch(e){
      console.error('Failed loading booking data', e);
    }
  }

  function chooseDate(i){ setSelectedDateIndex(i); setSelectedTime(null); }
  function formatDisplay(d){ return d && (d.display_date || d.date) || d; }

  async function handleContinue(e){
    e.preventDefault();
    if (selectedDateIndex === null || !selectedTime){ alert('Please select a date and time to continue'); return; }
    if (!contactNumber){ alert('Please provide a contact number for coordination'); return; }
    setLoading(true);
    try{
      const bookingDraft = {
        service_id: serviceId,
        event_date: slots[selectedDateIndex].date,
        event_time: selectedTime,
        event_theme: eventTheme || '',
        event_location: eventLocation || '',
        contact_number: contactNumber,
      };

      try { sessionStorage.removeItem('booking_id'); } catch (e) {}

      navigate(`/book/${serviceId}/payment`, {
        state: {
          bookingDraft,
          booking: {
            ...bookingDraft,
            service,
            total_amount: service?.price ? `$${String(service.price).replace('$', '')}` : '',
            payment_status: 'unpaid',
            status: 'pending',
          },
        },
      });
    }catch(err){
      console.error(err);
      alert('Network connection error');
    }finally{ setLoading(false); }
  }

  return (
    <div style={{ minHeight:'100vh', padding: '40px 24px', fontFamily:"'Poppins', sans-serif", background:'linear-gradient(180deg,#ffeef3,#fff9fb)'}}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <div style={{ background:'linear-gradient(90deg,#ffb6c1,#f7c7dc)', padding:18, borderRadius:10, color:'#fff', marginBottom:24, boxShadow:'0 4px 15px rgba(255,182,193,0.3)' }}>
          <div style={{ fontSize:16, fontWeight:600, cursor:'pointer' }} onClick={() => navigate(-1)}>Back</div>
          <h1 style={{ margin:'8px 0 0', color:'#fff', fontFamily:"'Abril Fatface', serif", letterSpacing:1 }}>Reserve Your Event</h1>
        </div>

        <div style={{ display:'flex', gap:24, alignItems:'flex-start' }}>
          <form onSubmit={handleContinue} style={{ flex:1, background:'#fff', padding:32, borderRadius:16, boxShadow:'0 8px 30px rgba(0,0,0,0.06)', color:'#4a4a4a' }}>
            <h2 style={{ color:'#4A4A4A', margin:'0 0 24px 0', fontSize:22 }}>Select Date & Time</h2>

            <div style={{ marginBottom:30 }}>
              <div style={{ display:'block', marginBottom:12, color:'#6B6B6B', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>Available Dates</div>
              {slots.length === 0 ? (
                <div style={{ padding:16, background:'#fafafa', borderRadius:8, color:'#aaa', fontSize:14, fontStyle:'italic' }}>
                  No open dates are available right now. Please check back after the admin adds more slots.
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:12 }}>
                  {slots.map((d,i) => (
                    <button key={d.date||i} type='button' onClick={() => chooseDate(i)} style={{ padding:'16px 12px', borderRadius:10, border: selectedDateIndex===i ? '2px solid #ff9dbf' : '1px solid #ffeef3', background: selectedDateIndex===i ? '#fff0f5' : '#fff', color:'#4a4a4a', cursor:'pointer' }}>
                      <div style={{ fontWeight:selectedDateIndex===i ? 700 : 500, fontSize:14 }}>{formatDisplay(d)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom:32 }}>
              <div style={{ display:'block', marginBottom:12, color:'#6B6B6B', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>Select Time</div>
              {selectedDateIndex === null ? (
                <div style={{ padding:16, background:'#fafafa', borderRadius:8, color:'#aaa', fontSize:14, fontStyle:'italic' }}>Please select a date first to view timeslots.</div>
              ) : (slots[selectedDateIndex] && slots[selectedDateIndex].times ? slots[selectedDateIndex].times : []).length === 0 ? (
                <div style={{ padding:16, background:'#fafafa', borderRadius:8, color:'#aaa', fontSize:14, fontStyle:'italic' }}>This date is fully booked. Please choose another date.</div>
              ) : (
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {(slots[selectedDateIndex] && slots[selectedDateIndex].times ? slots[selectedDateIndex].times : []).map(t => (
                    <button key={t} type='button' onClick={() => setSelectedTime(t)} style={{ padding:'10px 18px', borderRadius:30, border: selectedTime===t ? '2px solid #ff9dbf' : '1px solid #ffd6e6', background: selectedTime===t ? '#ff9dbf' : '#fff', color: selectedTime===t ? '#fff' : '#666', fontWeight:600, cursor:'pointer' }}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <h2 style={{ color:'#4A4A4A', margin:'0 0 20px 0', fontSize:22, borderTop:'1px solid #f0f0f0', paddingTop:24 }}>Event Particulars</h2>

            <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:28 }}>
              <div>
                <label style={{ display:'block', marginBottom:8, color:'#6B6B6B', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>Event Theme (Optional)</label>
                <input placeholder='e.g., Vintage, Floral, Modern Minimalist' value={eventTheme} onChange={e => setEventTheme(e.target.value)} style={{ width:'100%', padding:'12px', borderRadius:8, border:'1px solid #ffd6e6', background:'#fff5f7', color:'#4a4a4a', fontSize:15, boxSizing:'border-box', outlineColor:'#ffb6c1' }} />
              </div>

              <div>
                <label style={{ display:'block', marginBottom:8, color:'#6B6B6B', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>Event Location (Optional)</label>
                <input placeholder='e.g., Grand Palace Hotel' value={eventLocation} onChange={e => setEventLocation(e.target.value)} style={{ width:'100%', padding:'12px', borderRadius:8, border:'1px solid #ffd6e6', background:'#fff5f7', color:'#4a4a4a', fontSize:15, boxSizing:'border-box', outlineColor:'#ffb6c1' }} />
              </div>

              <div>
                <label style={{ display:'block', marginBottom:8, color:'#6B6B6B', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>Contact Number</label>
                <input required placeholder='+1 (555) 000-0000' value={contactNumber} onChange={e => setContactNumber(e.target.value)} style={{ width:'100%', padding:'12px', borderRadius:8, border:'1px solid #ffd6e6', background:'#fff5f7', color:'#4a4a4a', fontSize:15, boxSizing:'border-box', outlineColor:'#ffb6c1' }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
              <button type='submit' disabled={loading} style={{ width:'100%', padding:16, borderRadius:30, background:'linear-gradient(135deg,#ff9dbf,#f7c7dc)', color:'#fff', border:'none', fontSize:16, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow:'0 4px 15px rgba(255,157,191,0.4)', textTransform:'uppercase', letterSpacing:1 }}>
                {loading ? 'Preparing Payment...' : 'Continue to Payment'}
              </button>
            </div>
          </form>

          <aside style={{ width:340 }}>
            <div style={{ background:'#fff', padding:24, borderRadius:16, boxShadow:'0 8px 30px rgba(0,0,0,0.06)' }}>
              <h3 style={{ marginTop:0, color:'#4a4a4a', fontSize:18, borderBottom:'1px solid #ffeef3', paddingBottom:12, marginBottom:16 }}>Service Overview</h3>
              {service && (
                <div>
                  <img src={service.image || '/'} alt='' style={{ width:'100%', height:160, objectFit:'cover', borderRadius:12, marginBottom:16 }} />
                  <h4 style={{ margin:'0 0 6px 0', color:'#4a4a4a', fontSize:18 }}>{service.title}</h4>
                  <div style={{ color:'#888', fontSize:13, lineHeight:1.5, marginBottom:16 }}>{service.description}</div>
                  <div style={{ background:'#fff6f9', padding:16, borderRadius:12 }}>
                    <div style={{ color:'#ff6f98', fontWeight:800, fontSize:22, marginBottom:4 }}>{service.price ? `$${String(service.price).replace('$','')}` : ''}</div>
                    <div style={{ color:'#666', fontSize:14, marginBottom:12 }}>{service.duration || 'Flexible duration'}</div>
                    <div style={{ borderTop:'1px dashed #ffb6c1', paddingTop:12 }}>
                      <div style={{ color:'#555', fontSize:14, marginBottom:8 }}><b>Date:</b> {selectedDateIndex!==null ? formatDisplay(slots[selectedDateIndex]) : 'Pending'}</div>
                      <div style={{ color:'#555', fontSize:14 }}><b>Time:</b> {selectedTime || 'Pending'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
