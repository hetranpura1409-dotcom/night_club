'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createBooking } from '../../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface BookingFormProps {
  table: any;
  venueId: string;
  venueName?: string;
}

export default function BookingForm({ table, venueId, venueName }: BookingFormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [bookingDate, setBookingDate] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookingTime, setBookingTime] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(table.capacity);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');

  const platformFee = (Number(table.price) * 10) / 100;
  const totalAmount = Number(table.price) + platformFee;

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedDate || !bookingTime) {
      setError('Please select date and time');
      return;
    }

    // Convert selected date to YYYY-MM-DD format
    const formattedDate = selectedDate.toISOString().split('T')[0];

    try {
      setLoading(true);
      const response = await createBooking({
        tableId: table.id,
        bookingDate: formattedDate,
        bookingTime,
        numberOfGuests,
        specialRequests,
      });

      setClientSecret(response.clientSecret);
      setBookingId(response.booking.id);
    } catch (err: any) {
      console.error('Booking creation failed:', err);
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe not loaded');
      return;
    }

    setError('');
    setLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Payment submission failed');
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/bookings/${bookingId}/confirm`,
      },
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      setLoading(false);
    }
  };

  // Get today's date for min date constraint
  const today = new Date();

  return (
    <div className="booking-form">
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {!clientSecret ? (
        // Step 1: Booking Details
        <form onSubmit={handleCreateBooking}>
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label>📅 Select Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={today}
                  dateFormat="MMM dd, yyyy"
                  placeholderText="Click to select a date"
                  className="custom-datepicker"
                  calendarClassName="custom-calendar"
                  inline={false}
                  required
                />
              </div>

              <div className="form-group">
                <label>🕐 Select Time</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                  className="time-select"
                >
                  <option value="">Click to select time</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="18:30">6:30 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="20:30">8:30 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="21:30">9:30 PM</option>
                  <option value="22:00">10:00 PM</option>
                  <option value="22:30">10:30 PM</option>
                  <option value="23:00">11:00 PM</option>
                  <option value="23:30">11:30 PM</option>
                  <option value="00:00">12:00 AM (Midnight)</option>
                  <option value="00:30">12:30 AM</option>
                  <option value="01:00">1:00 AM</option>
                  <option value="01:30">1:30 AM</option>
                  <option value="02:00">2:00 AM</option>
                  <option value="02:30">2:30 AM</option>
                  <option value="03:00">3:00 AM</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>👥 Number of Guests (Max: {table.capacity})</label>
              <input
                type="number"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                min={1}
                max={table.capacity}
                required
              />
            </div>

            <div className="form-group">
              <label>💬 Special Requests (Optional)</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Birthday celebration, dietary requirements, etc."
                rows={3}
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="price-summary">
            <h3>Booking Summary</h3>
            {venueName && <p className="venue-info">{venueName}</p>}
            <div className="price-row">
              <span>Table for {table.capacity} guests</span>
              <span>€{Number(table.price).toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Platform Fee (10%)</span>
              <span>€{platformFee.toFixed(2)}</span>
            </div>
            <div className="price-row total">
              <span>Total Amount</span>
              <span>€{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating Booking...' : 'Continue to Payment'}
          </button>
        </form>
      ) : (
        // Step 2: Payment
        <form onSubmit={handlePayment}>
          <div className="payment-section">
            <h3>Payment Information</h3>
            <PaymentElement />
          </div>

          <div className="price-summary">
            <div className="price-row total">
              <span>Amount to Pay</span>
              <span>€{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" disabled={!stripe || loading} className="btn-primary">
            {loading ? 'Processing...' : `Pay €${totalAmount.toFixed(2)}`}
          </button>
        </form>
      )}

      <style jsx>{`
        .booking-form {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 32px;
          max-width: 600px;
          margin: 0 auto;
        }

        .error-message {
          background: rgba(255, 68, 68, 0.1);
          border: 1px solid #ff4444;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 24px;
          color: #ff8888;
          font-size: 14px;
        }

        .form-section {
          margin-bottom: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 14px;
          color: #ccc;
        }

        .input-with-icon {
          position: relative;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-family: inherit;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #00ff88;
        }

        textarea {
          resize: vertical;
        }

        select.time-select {
          width: 100%;
          padding: 12px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-family: inherit;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300ff88' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }

        select.time-select:focus {
          outline: none;
          border-color: #00ff88;
        }

        select.time-select option {
          background: #1a1a1a;
          color: white;
          padding: 12px;
        }

        .price-summary {
          background: #0a0a0a;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
        }

        .price-summary h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .venue-info {
          color: #888;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          color: #aaa;
          font-size: 14px;
        }

        .price-row.total {
          border-top: 1px solid #333;
          margin-top: 12px;
          padding-top: 16px;
          font-size: 18px;
          font-weight: 700;
          color: white;
        }

        .price-row.total span:last-child {
          color: #00ff88;
        }

        .payment-section {
          margin-bottom: 24px;
        }

        .payment-section h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
        }

        .btn-primary {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #00ff88, #00cc6a);
          color: #000;
          border: none;
          border-radius: 24px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 255, 136, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Custom DatePicker Styles */
        :global(.custom-datepicker) {
          width: 100%;
          padding: 12px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-family: inherit;
          cursor: pointer;
        }

        :global(.custom-datepicker:focus) {
          outline: none;
          border-color: #00ff88;
        }

        :global(.react-datepicker-popper) {
          z-index: 9999 !important;
        }

        :global(.react-datepicker) {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
          font-family: inherit;
        }

        :global(.react-datepicker__header) {
          background: #0a0a0a;
          border-bottom: 1px solid #333;
          border-radius: 12px 12px 0 0;
          padding: 16px 0 12px;
        }

        :global(.react-datepicker__current-month) {
          color: #00ff88;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 8px;
        }

        :global(.react-datepicker__day-name) {
          color: #888;
          font-size: 12px;
          font-weight: 600;
          width: 2.5rem;
          line-height: 2.5rem;
        }

        :global(.react-datepicker__day) {
          color: #ccc;
          width: 2.5rem;
          line-height: 2.5rem;
          margin: 0.2rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        :global(.react-datepicker__day:hover) {
          background: #333;
          color: white;
        }

        :global(.react-datepicker__day--selected) {
          background: #00ff88 !important;
          color: #000 !important;
          font-weight: 700;
        }

        :global(.react-datepicker__day--keyboard-selected) {
          background: #00cc6a;
          color: #000;
        }

        :global(.react-datepicker__day--disabled) {
          color: #444 !important;
          cursor: not-allowed;
        }

        :global(.react-datepicker__day--disabled:hover) {
          background: transparent !important;
        }

        :global(.react-datepicker__day--today) {
          border: 1px solid #00ff88;
          font-weight: 600;
        }

        :global(.react-datepicker__navigation) {
          top: 18px;
        }

        :global(.react-datepicker__navigation-icon::before) {
          border-color: #888;
        }

        :global(.react-datepicker__navigation:hover .react-datepicker__navigation-icon::before) {
          border-color: #00ff88;
        }

        :global(.react-datepicker__month) {
          background: #1a1a1a;
          padding: 8px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .booking-form {
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  );
}
