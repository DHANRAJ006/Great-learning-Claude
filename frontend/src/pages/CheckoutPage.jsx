// ============================================================
//  CheckoutPage – Personal Details & Payment
// ============================================================
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { STATIC_COURSES } from '../data/staticData.js';
import { useApp } from '../context/AppContext.jsx';

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  // Fetch course from API
  const { data: courseData, loading } = useFetch(`/api/courses/${id}`);
  
  // Try to get course from API, fallback to static data if not found
  const course = courseData?.data || STATIC_COURSES.find(c => c._id === id);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'upi'
  });

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}><h2>Loading...</h2></div>;
  if (!course) return <div style={{ padding: '100px', textAlign: 'center' }}><h2>Course not found</h2></div>;

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    showToast('🚀 Payment Successful! Enrolling you now...', 'success');
    setTimeout(() => navigate(`/course/${id}`), 2000);
  };

  return (
    <section className="page active" style={{ padding: 'var(--space-8)', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 'var(--space-2)' }}>Checkout</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Complete your enrollment for <strong>{course.title}</strong></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-8)', alignItems: 'start' }}>
        {/* Left Side: Form */}
        <div style={{ 
          backgroundColor: 'var(--bg-surface)', 
          padding: 'var(--space-8)', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div style={{ 
              flex: 1, height: '4px', background: 'var(--accent-1)', borderRadius: '2px' 
            }}></div>
            <div style={{ 
              flex: 1, height: '4px', background: step === 2 ? 'var(--accent-1)' : 'var(--bg-hover)', borderRadius: '2px' 
            }}></div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-6)' }}>1. Personal Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
                  <input 
                    type="text" required
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px', 
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', outline: 'none'
                    }}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
                  <input 
                    type="email" required
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px', 
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', outline: 'none'
                    }}
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Phone Number</label>
                  <input 
                    type="tel" required
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px', 
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', outline: 'none'
                    }}
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Continue to Payment</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePayment}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-6)' }}>2. Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[
                  { id: 'upi', name: 'UPI (GPay, PhonePe)', icon: '📱' },
                  { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
                  { id: 'net', name: 'Net Banking', icon: '🏦' }
                ].map(method => (
                  <label key={method.id} style={{ 
                    display: 'flex', alignItems: 'center', gap: 'var(--space-4)', 
                    padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-subtle)', cursor: 'pointer',
                    background: formData.paymentMethod === method.id ? 'var(--accent-subtle)' : 'transparent',
                    borderColor: formData.paymentMethod === method.id ? 'var(--accent-1)' : 'var(--border-subtle)'
                  }}>
                    <input 
                      type="radio" name="payment" 
                      checked={formData.paymentMethod === method.id}
                      onChange={() => setFormData({...formData, paymentMethod: method.id})}
                      style={{ accentColor: 'var(--accent-1)' }}
                    />
                    <span style={{ fontSize: '1.2rem' }}>{method.icon}</span>
                    <span style={{ fontWeight: 600 }}>{method.name}</span>
                  </label>
                ))}
                
                <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                   🔒 Secured by 256-bit SSL encryption
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Pay ₹{course.price.toLocaleString('en-IN')}</button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div style={{ 
          backgroundColor: 'var(--bg-surface)', 
          padding: 'var(--space-6)', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: '100px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 'var(--space-4)' }}>Order Summary</h3>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{ width: '60px', height: '40px', background: 'var(--bg-hover)', borderRadius: '4px' }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>{course.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {course.instructor}</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Course Price</span>
              <span>₹{course.originalPrice?.toLocaleString('en-IN') || course.price.toLocaleString('en-IN')}</span>
            </div>
            {course.originalPrice && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#10b981' }}>
                <span>Discount</span>
                <span>-₹{(course.originalPrice - course.price).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, marginTop: '8px' }}>
              <span>Total</span>
              <span>₹{course.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
