'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import BookingForm from '../../../../components/booking/BookingForm';
import { getTablesByNightclub, getNightclubs } from '../../../../services/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function BookTablePage() {
  const router = useRouter();
  const params = useParams();
  const venueId = params?.id as string;

  const [tables, setTables] = useState<any[]>([]);
  const [venue, setVenue] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [venueId]);

  const loadData = async () => {
    try {
      // Load venue details
      const venues = await getNightclubs();
      const venueData = venues.find((v: any) => v.id === venueId);
      setVenue(venueData);

      // Load tables
      const tablesData = await getTablesByNightclub(venueId);
      setTables(tablesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
          }
          .spinner {
            border: 3px solid #333;
            border-top: 3px solid #00ff88;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="header">
        <button onClick={() => router.back()} className="back-button">
          ← Back
        </button>
        <h1>Book a Table</h1>
        {venue && <p className="venue-name">{venue.name}</p>}
      </div>

      {/* Table Selection */}
      <div className="content">
        <h2>Select a Table</h2>
        <div className="table-selection">
          {tables.length === 0 ? (
            <p className="no-tables">No tables available at this venue</p>
          ) : (
            tables.map((table) => (
              <div
                key={table.id}
                className={`table-card ${selectedTable?.id === table.id ? 'selected' : ''} ${!table.available ? 'unavailable' : ''}`}
                onClick={() => table.available && setSelectedTable(table)}
              >
                <div className="table-icon">🪑</div>
                <h3>{table.capacity} Guests</h3>
                <p className="price">€{Number(table.price).toFixed(2)}</p>
                {!table.available && <span className="unavailable-badge">Not Available</span>}
              </div>
            ))
          )}
        </div>

        {/* Booking Form */}
        {selectedTable && (
          <div className="booking-form-section">
            <h2>Booking Details</h2>
            <Elements stripe={stripePromise}>
              <BookingForm table={selectedTable} venueId={venueId} venueName={venue?.name} />
            </Elements>
          </div>
        )}
      </div>

      <style jsx>{`
        .booking-page {
          min-height: 100vh;
          background: #000;
          color: white;
          padding-bottom: 40px;
        }

        .header {
          background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
          padding: 24px;
          border-bottom: 1px solid #333;
        }

        .back-button {
          background: transparent;
          border: 1px solid #666;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 16px;
          transition: all 0.3s;
        }

        .back-button:hover {
          border-color: #00ff88;
          background: rgba(0, 255, 136, 0.05);
        }

        h1 {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .venue-name {
          font-size: 16px;
          color: #888;
        }

        .content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        h2 {
          font-size: 22px;
          margin-bottom: 24px;
        }

        .table-selection {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }

        .table-card {
          background: #1a1a1a;
          border: 2px solid #333;
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
          position: relative;
        }

        .table-card:hover:not(.unavailable) {
          border-color: #ff6b9d;
          transform: translateY(-2px);
        }

        .table-card.selected {
          border-color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
        }

        .table-card.unavailable {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .table-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .table-card h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .price {
          font-size: 28px;
          font-weight: 700;
          color: #00ff88;
          margin: 0;
        }

        .unavailable-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #ff4444;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .no-tables {
          grid-column: 1 / -1;
          text-align: center;
          color: #666;
          padding: 40px;
        }

        .booking-form-section {
          margin-top: 40px;
          padding-top: 40px;
          border-top: 1px solid #333;
        }

        @media (max-width: 768px) {
          .table-selection {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
