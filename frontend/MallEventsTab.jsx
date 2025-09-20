import React, { useState, useEffect } from "react";

export default function MallEventsTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const res = await fetch("/test/events");
        const data = await res.json();
        
        if (data.ok) {
          setEvents(data.events || []);
        } else {
          setError("Failed to load events");
        }
      } catch (err) {
        setError("Error connecting to server");
        console.error("Events fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ 
          display: "inline-block",
          width: "40px",
          height: "40px",
          border: "4px solid #f3f4f6",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p style={{ marginTop: "20px", color: "#6b7280" }}>Loading mall events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "40px", 
        color: "#dc2626",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "8px"
      }}>
        <h3>⚠️ Error Loading Events</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ 
        fontSize: "1.8em", 
        color: "#1f2937", 
        marginBottom: "20px",
        borderBottom: "3px solid #3b82f6",
        paddingBottom: "10px"
      }}>
        🎉 Upcoming Mall Events
      </h2>
      
      {events.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}>
          <p style={{ color: "#6b7280", fontSize: "1.1em" }}>
            No events currently scheduled
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {events.map((event, index) => (
            <div 
              key={index} 
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <h3 style={{ 
                  color: "#1f2937", 
                  fontSize: "1.3em", 
                  margin: "0 0 5px 0",
                  fontWeight: "600"
                }}>
                  {event.title}
                </h3>
                <p style={{ 
                  color: "#3b82f6", 
                  fontWeight: "500",
                  margin: "0 0 10px 0"
                }}>
                  📍 {event.mall}
                </p>
              </div>
              
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <div style={{
                  backgroundColor: "#dbeafe",
                  color: "#1e40af",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "0.9em",
                  fontWeight: "500"
                }}>
                  📅 {event.date}
                </div>
                
                {event.description && (
                  <div style={{ 
                    color: "#6b7280",
                    fontSize: "0.95em",
                    flex: "1",
                    marginLeft: "10px"
                  }}>
                    {event.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}