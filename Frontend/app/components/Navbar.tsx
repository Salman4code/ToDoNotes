"use client";

import React from "react";

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const Navbar = ({ search, onSearchChange }: NavbarProps) => {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "white",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo / Title */}
      <div style={{ fontSize: "22px", fontWeight: 600, marginRight: "20px" }}>
        Keep Clone
      </div>

      {/* Search Bar */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          background: "#f1f3f4",
          borderRadius: "8px",
          padding: "8px 12px",
          border: "1px solid #ddd",
        }}
      >
        <span style={{ marginRight: "10px", opacity: 0.6 }}>🔍</span>

        <input
          type="text"
          placeholder="Search your notes…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "16px",
            background: "transparent",
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
