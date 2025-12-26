"use client"

import React from "react"

interface Props {
  image: string
  title: string
  spec: string
  price: string
}

export default function OrderProductSummary({ image, title, spec, price }: Props) {
  return (
    <div style={summaryContainerStyle}>
      <div style={imageWrapperStyle}>
        {image ? (
          <img src={image} alt={title} style={imgStyle} />
        ) : (
          <div style={{ width: "100%", height: "100%", backgroundColor: "#eee" }} />
        )}
      </div>
      <div style={infoContainerStyle}>
        <div style={titleStyle}>{title}</div>
        <div style={specStyle}>{spec}</div>
        <div style={priceStyle}>{price}</div>
      </div>
    </div>
  )
}

// --- Styles ---
const summaryContainerStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  boxSizing: "border-box",
}
const imageWrapperStyle: React.CSSProperties = {
  width: "80px",
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  overflow: "hidden",
  flexShrink: 0,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
}
const imgStyle: React.CSSProperties = {
  width: "90%",
  height: "90%",
  objectFit: "contain",
}
const infoContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "4px",
}
const titleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#1d1d1f",
}
const specStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#86868b",
  fontWeight: 500,
}
const priceStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#3B82F6",
  marginTop: "2px",
}