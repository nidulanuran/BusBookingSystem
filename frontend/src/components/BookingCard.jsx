import React, { useState } from 'react';
import '../App.css';

/**
 * BookingCard — Interactive Visual Bus Seat Picker
 * Props:
 *   onSeatsChange: (count: number) => void
 *   maxSeats: number   — default 6
 *   totalSeats: number — total seats on this bus
 */
function BookingCard({ onSeatsChange, maxSeats = 6, totalSeats = 40 }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const displaySeats = Math.min(Math.max(totalSeats, 20), 50);

  // 2 + aisle + 2 arrangement
  const rowCount = Math.floor((displaySeats - 2) / 4);
  const leftSeats = [];
  const rightSeats = [];
  const rearSeats = [];

  for (let row = 0; row < rowCount; row++) {
    leftSeats.push(row * 4 + 1, row * 4 + 2);
    rightSeats.push(row * 4 + 3, row * 4 + 4);
  }

  const coveredSeats = rowCount * 4;
  for (let i = coveredSeats + 1; i <= displaySeats; i++) {
    rearSeats.push(i);
  }

  const handleSeatClick = (seatNo) => {
    setErrorMsg('');
    setSelectedSeats(prev => {
      let updated;
      if (prev.includes(seatNo)) {
        updated = prev.filter(s => s !== seatNo);
      } else {
        if (prev.length >= maxSeats) {
          setErrorMsg(`Maximum ${maxSeats} seats allowed per reservation.`);
          return prev;
        }
        updated = [...prev, seatNo].sort((a, b) => a - b);
      }
      if (onSeatsChange) onSeatsChange(updated.length);
      return updated;
    });
  };

  const getSeatClass = (seatNo) => {
    const isSelected = selectedSeats.includes(seatNo);
    const isFull = selectedSeats.length >= maxSeats && !isSelected;
    if (isSelected) return 'seat-btn seat-btn-selected';
    if (isFull) return 'seat-btn seat-btn-disabled';
    return 'seat-btn';
  };

  const renderSeat = (seatNo) => (
    <button
      key={seatNo}
      type="button"
      className={getSeatClass(seatNo)}
      onClick={() => handleSeatClick(seatNo)}
      disabled={selectedSeats.length >= maxSeats && !selectedSeats.includes(seatNo)}
      aria-label={`Seat ${seatNo}${selectedSeats.includes(seatNo) ? ', selected' : ''}`}
      aria-pressed={selectedSeats.includes(seatNo)}
    >
      {seatNo < 10 ? `0${seatNo}` : seatNo}
    </button>
  );

  return (
    <div className="seat-picker-container">
      {/* Legend */}
      <div className="seat-legend">
        <div className="seat-legend-item">
          <div className="seat-legend-dot free" />
          <span>Available</span>
        </div>
        <div className="seat-legend-item">
          <div className="seat-legend-dot selected" />
          <span>Selected</span>
        </div>
        <div className="seat-legend-item">
          <div className="seat-legend-dot taken" />
          <span>Limit reached</span>
        </div>
      </div>

      {/* Bus Cabin Body */}
      <div className="bus-body" role="group" aria-label="Bus seating map">
        {/* Cockpit / Driver Area */}
        <div className="bus-front-cockpit">
          <div className="cockpit-steering" title="Driver's Seat">
            ⎈
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>
            FRONT
          </div>
          <div className="cockpit-door">
            DOOR ➔
          </div>
        </div>

        {/* Main Seat Aisle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          {/* Left Column (2 seats) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Array.from({ length: rowCount }, (_, row) => (
              <div key={row} style={{ display: 'flex', gap: '6px' }}>
                {renderSeat(row * 4 + 1)}
                {renderSeat(row * 4 + 2)}
              </div>
            ))}
          </div>

          {/* Walking Aisle */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '2px',
              height: `${rowCount * 50}px`,
              background: 'repeating-linear-gradient(to bottom, #CBD5E1 0px, #CBD5E1 6px, transparent 6px, transparent 14px)'
            }} />
          </div>

          {/* Right Column (2 seats) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Array.from({ length: rowCount }, (_, row) => (
              <div key={row} style={{ display: 'flex', gap: '6px' }}>
                {renderSeat(row * 4 + 3)}
                {renderSeat(row * 4 + 4)}
              </div>
            ))}
          </div>
        </div>

        {/* Rear Row */}
        {rearSeats.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '2px dashed #CBD5E1',
              justifyContent: 'center',
            }}
          >
            {rearSeats.map(renderSeat)}
          </div>
        )}
      </div>

      {/* Live Seat Count & Tags */}
      <div className="seat-count-display">
        <div className="seat-count-number">{selectedSeats.length}</div>
        <div className="seat-count-label">
          {selectedSeats.length === 1 ? 'Seat Selected' : 'Seats Selected'} (Max {maxSeats})
        </div>

        {selectedSeats.length > 0 && (
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {selectedSeats.map(s => (
              <span
                key={s}
                style={{
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(79, 70, 229, 0.2)'
                }}
              >
                Seat #{s < 10 ? `0${s}` : s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Error Message Banner */}
      {errorMsg && (
        <p
          role="alert"
          style={{
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            textAlign: 'center',
            marginTop: '0.75rem',
            fontWeight: 600,
          }}
        >
          ⚠️ {errorMsg}
        </p>
      )}
    </div>
  );
}

export default BookingCard;