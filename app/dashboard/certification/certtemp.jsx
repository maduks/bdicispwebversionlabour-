"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const EnhancedCertificate = React.forwardRef((props, ref) => {
  const certificateRef = useRef(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      // First capture the certificate as a high-quality image
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#f5f5f5",
        width: certificateRef.current.scrollWidth,
        height: certificateRef.current.scrollHeight,
      });

      // Create PDF with the captured image
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions to fit the image properly
      const imgWidth = 297; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to PDF
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Save the PDF
      pdf.save(
        `Certificate_${props.certificateReferenceId || "BEN-ICT-2025-001"}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        overflow: "auto",
        fontFamily: "'Inter', sans-serif",
        padding: "20px",
        gap: "20px",
      }}
    >
      {/* Download Button */}
      {/* <button
        onClick={downloadCertificate}
        style={{
          backgroundColor: "#1e8449",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(30, 132, 73, 0.3)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#28a745";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(30, 132, 73, 0.4)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#1e8449";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(30, 132, 73, 0.3)";
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 10L12 15L17 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 15V3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Download PDF
      </button> */}

      {/* Certificate */}
      <div
        ref={certificateRef}
        style={{
          width: "90vw",
          maxWidth: "297mm",
          padding: "40px",
          boxSizing: "border-box",
          border: "8px solid transparent",
          background: `
    linear-gradient(white, white) padding-box,
    linear-gradient(45deg, #1e8449, #28a745, #ffd700, #1e8449) border-box
  `,
          borderRadius: "15px",
          backgroundColor: "#fff",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          backgroundImage: `
    linear-gradient(45deg, transparent 24%, rgba(30, 132, 73, 0.02) 25%, rgba(30, 132, 73, 0.02) 26%, transparent 27%, transparent 74%, rgba(30, 132, 73, 0.02) 75%, rgba(30, 132, 73, 0.02) 76%, transparent 77%, transparent),
    linear-gradient(-45deg, transparent 24%, rgba(30, 132, 73, 0.02) 25%, rgba(30, 132, 73, 0.02) 26%, transparent 27%, transparent 74%, rgba(30, 132, 73, 0.02) 75%, rgba(30, 132, 73, 0.02) 76%, transparent 77%, transparent),
    radial-gradient(circle at 50% 50%, rgba(30, 132, 73, 0.01) 0%, transparent 50%),
    repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(30, 132, 73, 0.005) 1deg, transparent 2deg),
    linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(248, 255, 248, 0.9))
  `,
          backgroundSize: "30px 30px, 30px 30px, 100% 100%",
        }}
      >
        {/* Nigeria Map Watermark - Very Faint */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(200px, 30vw, 400px)",
            height: "clamp(200px, 30vw, 400px)",
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.08,
          }}
        >
          <svg
            viewBox="0 0 400 400"
            style={{ width: "100%", height: "100%" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simplified Nigeria map outline */}
            <path
              d="M80 120 C90 110, 120 100, 150 105 C180 110, 200 115, 220 120 C250 125, 280 130, 310 140 C320 145, 325 155, 320 170 C315 185, 310 200, 305 220 C300 240, 295 260, 290 280 C285 300, 280 320, 270 335 C260 350, 245 360, 225 365 C205 370, 185 365, 165 360 C145 355, 125 350, 110 340 C95 330, 85 315, 80 300 C75 285, 75 270, 75 255 C75 240, 75 225, 75 210 C75 195, 75 180, 75 165 C75 150, 75 135, 80 120 Z"
              fill="rgba(30, 132, 73, 0.8)"
              stroke="rgba(30, 132, 73, 0.9)"
              strokeWidth="2"
            />
            {/* Additional details for more realistic shape */}
            <path
              d="M150 140 C160 135, 170 140, 175 150 C180 160, 175 170, 170 175 C165 180, 155 175, 150 170 C145 165, 145 155, 150 140 Z"
              fill="rgba(30, 132, 73, 0.6)"
            />
            <path
              d="M200 160 C210 155, 220 160, 225 170 C230 180, 225 190, 220 195 C215 200, 205 195, 200 190 C195 185, 195 175, 200 160 Z"
              fill="rgba(30, 132, 73, 0.6)"
            />
          </svg>
        </div>

        {/* Multiple Watermarks */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-45deg)",
            fontSize: "clamp(80px, 12vw, 120px)",
            color: "rgba(30, 132, 73, 0.05)",
            fontWeight: "900",
            zIndex: 0,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            letterSpacing: "10px",
          }}
        >
          AUTHENTIC
        </div>

        {/* Secondary watermark */}
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "25%",
            transform: "rotate(15deg)",
            fontSize: "clamp(20px, 3vw, 30px)",
            color: "rgba(30, 132, 73, 0.03)",
            fontWeight: "700",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          BENUE STATE
        </div>

        <div
          style={{
            position: "absolute",
            top: "75%",
            right: "25%",
            transform: "rotate(-15deg)",
            fontSize: "clamp(20px, 3vw, 30px)",
            color: "rgba(30, 132, 73, 0.03)",
            fontWeight: "700",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          GOVERNMENT
        </div>

        {/* Enhanced Decorative border pattern with guilloche effect */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            right: "15px",
            bottom: "15px",
            border: "3px solid #1e8449",
            borderRadius: "10px",
            zIndex: 0,
            pointerEvents: "none",
            background: `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(30, 132, 73, 0.1) 2px,
          rgba(30, 132, 73, 0.1) 4px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(30, 132, 73, 0.1) 2px,
          rgba(30, 132, 73, 0.1) 4px
        )
      `,
          }}
        />

        {/* Inner ornate border */}
        <div
          style={{
            position: "absolute",
            top: "25px",
            left: "25px",
            right: "25px",
            bottom: "25px",
            border: "1px solid rgba(30, 132, 73, 0.3)",
            borderRadius: "8px",
            zIndex: 0,
            pointerEvents: "none",
            background: `
        radial-gradient(circle at 20% 20%, rgba(30, 132, 73, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(30, 132, 73, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 20% 80%, rgba(30, 132, 73, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(30, 132, 73, 0.05) 0%, transparent 50%)
      `,
          }}
        />

        {/* Security ribbon */}
        <div
          style={{
            position: "absolute",
            top: "0",
            right: "-50px",
            width: "200px",
            height: "40px",
            background: "linear-gradient(45deg, #ffd700, #ffea00, #ffd700)",
            transform: "rotate(45deg)",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: "bold",
            color: "#1e8449",
            letterSpacing: "2px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          AUTHENTIC
        </div>

        {/* Ornamental corners */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            width: "40px",
            height: "40px",
            background: `
        radial-gradient(circle at center, #1e8449 2px, transparent 2px),
        conic-gradient(from 0deg, #1e8449, #28a745, #1e8449)
      `,
            borderRadius: "50%",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            width: "40px",
            height: "40px",
            background: `
        radial-gradient(circle at center, #1e8449 2px, transparent 2px),
        conic-gradient(from 0deg, #1e8449, #28a745, #1e8449)
      `,
            borderRadius: "50%",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "30px",
            width: "40px",
            height: "40px",
            background: `
        radial-gradient(circle at center, #1e8449 2px, transparent 2px),
        conic-gradient(from 0deg, #1e8449, #28a745, #1e8449)
      `,
            borderRadius: "50%",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
            width: "40px",
            height: "40px",
            background: `
        radial-gradient(circle at center, #1e8449 2px, transparent 2px),
        conic-gradient(from 0deg, #1e8449, #28a745, #1e8449)
      `,
            borderRadius: "50%",
            zIndex: 1,
          }}
        />

        {/* Security microprinting */}
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "6px",
            color: "rgba(30, 132, 73, 0.4)",
            letterSpacing: "0.5px",
            zIndex: 1,
            whiteSpace: "nowrap",
          }}
        >
          BENUE STATE GOVERNMENT • OFFICIAL CERTIFICATE • SECURITY DOCUMENT •
          AUTHENTIC
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "25px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "6px",
            color: "rgba(30, 132, 73, 0.4)",
            letterSpacing: "0.5px",
            zIndex: 1,
            whiteSpace: "nowrap",
          }}
        >
          FEDERAL REPUBLIC OF NIGERIA • BENUE STATE • AUTHENTICATION CERTIFICATE
        </div>

        {/* Centered Benue State Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <img
            src="https://ik.imagekit.io/bdic/ministry-labour.png?updatedAt=1757610747399"
            alt="Ministry Of Labour Logo"
            style={{
              width: "clamp(90px, 10vw, 150px)",
              height: "auto",
              position: "relative",
              zIndex: 1,
            }}
            crossOrigin="anonymous"
          />
        </div>

        {/* <p>{props.ministryId.name}</p> */}
        <div
          style={{
            fontSize: "clamp(14px, 1.8vw, 18px)",
            marginBottom: "1px",
            color: "#555",
            fontWeight: "600",
            position: "relative",
            zIndex: 1,
          }}
        >
          <p>{props.ministryId.name}</p>
        </div>

        {/* Header with enhanced styling */}
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            color: "#1e8449",
            marginBottom: "20px",
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontWeight: "700",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
            position: "relative",
            zIndex: 1,
            background: "linear-gradient(135deg, #1e8449, #28a745)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Certificate of Service Registration
        </div>

        {/* Government Authority */}
        {/* <div
          style={{
            fontSize: "clamp(12px, 1.5vw, 16px)",
            color: "#333",
            marginBottom: "10px",
            fontWeight: "600",
            position: "relative",
            zIndex: 1,
          }}
        >
          ISSUED BY THE AUTHORITY OF BENUE STATE GOVERNMENT
        </div> */}

        <div
          style={{
            fontSize: "clamp(14px, 1.8vw, 18px)",
            marginBottom: "15px",
            color: "#555",
            fontWeight: "600",
            position: "relative",
            zIndex: 1,
          }}
        >
          This certifies that
        </div>

        {/* Certificate recipient with enhanced styling */}
        <div
          style={{
            fontSize: "clamp(20px, 3.2vw, 32px)",
            fontWeight: "bold",
            color: "#1e8449",
            margin: "30px 0",
            textTransform: "capitalize",
            lineHeight: "1.2",
            position: "relative",
            zIndex: 1,
            padding: "20px 40px",
            border: "3px solid #1e8449",
            borderRadius: "15px",
            background: `
      linear-gradient(135deg, rgba(30, 132, 73, 0.05), rgba(40, 167, 69, 0.05)),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(30, 132, 73, 0.02) 10px,
        rgba(30, 132, 73, 0.02) 20px
      )
    `,
            boxShadow:
              "inset 0 2px 10px rgba(30, 132, 73, 0.1), 0 4px 20px rgba(30, 132, 73, 0.1)",
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {props.certificationAddressedTo || "Benue Tech Solutions Ltd."}
        </div>

        <div
          style={{
            fontSize: "clamp(14px, 1.8vw, 18px)",
            marginBottom: "15px",
            color: "#555",
            fontWeight: "600",
            position: "relative",
            zIndex: 1,
          }}
        >
          Is hereby recognized as an authenticated{" "}
          {props.certificationType?.toLowerCase() === "business" ? (
            <strong style={{ color: "#1e8449" }}>Business Premises</strong>
          ) : props.certificationType?.toLowerCase() === "service" ? (
            <strong style={{ color: "#1e8449" }}>
              {" "}
              {props.specialization} Provider
            </strong>
          ) : props.certificationType?.toLowerCase() === "property" ? (
            <strong style={{ color: "#1e8449" }}>Property Listing Agent</strong>
          ) : props.certificationType?.toLowerCase() === "product" ? (
            <strong style={{ color: "#1e8449" }}>
              Product Sales/Distributor
            </strong>
          ) : (
            ""
          )}{" "}
          under the
        </div>

        <div
          style={{
            fontSize: "clamp(16px, 2.2vw, 22px)",
            fontWeight: "bold",
            color: "#1e8449",
            marginBottom: "40px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {props.serviceCategory ||
            "Ministry Of Labour Trade Test Certificate System"}
        </div>

        {/* Security features */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "30px 0",
            padding: "15px",
            background:
              "linear-gradient(135deg, rgba(30, 132, 73, 0.05), rgba(40, 167, 69, 0.05))",
            borderRadius: "10px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "clamp(10px, 1.2vw, 14px)",
              color: "#333",
              fontWeight: "700",
            }}
          >
            <strong>Issue Date:</strong>
            <br />
            {new Date(props.issueDate || Date.now()).toLocaleDateString(
              "en-GB"
            )}
          </div>
          <div
            style={{
              fontSize: "clamp(10px, 1.2vw, 14px)",
              color: "#333",
              fontWeight: "700",
            }}
          >
            <strong>Valid Until:</strong>
            <br />
            {new Date(
              props.expirationDate ||
                new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            ).toLocaleDateString("en-GB")}
          </div>
          <div
            style={{
              fontSize: "clamp(10px, 1.2vw, 14px)",
              color: "#333",
              fontWeight: "700",
            }}
          >
            <strong>Cert. ID:</strong>
            <br />
            {props.certificateReferenceId || "BEN-ICT-2025-001"}
          </div>
        </div>

        {/* Enhanced signature area */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-end",
            marginTop: "50px",
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ flex: 1, padding: "0 20px", textAlign: "center" }}>
            <div
              style={{
                width: "150px",
                height: "60px",
                margin: "0 auto 10px",
                background:
                  "url('https://ik.imagekit.io/bdic/signature_.png?updatedAt=1748480486518') no-repeat center",
                backgroundSize: "contain",
              }}
            />
            <div
              style={{
                borderTop: "2px solid #1e8449",
                paddingTop: "8px",
                marginBottom: "5px",
              }}
            />
            <div
              style={{
                fontSize: "clamp(10px, 1.2vw, 14px)",
                color: "#444",
                fontWeight: "600",
              }}
            >
              {props.authorizedSignatoryName || "Dr. Terkula Agbaji"}
            </div>
            <div style={{ fontSize: "clamp(9px, 1.1vw, 12px)", color: "#666" }}>
              {props.authorizedSignatoryTitle || "Director, ICT Department"}
            </div>
          </div>

          <div style={{ flex: 1, padding: "0 20px", textAlign: "center" }}>
            <div
              style={{
                width: "150px",
                height: "60px",
                margin: "0 auto 10px",
                background:
                  "url('https://ik.imagekit.io/bdic/signature_.png?updatedAt=1748480486518') no-repeat center",
                backgroundSize: "contain",
              }}
            />
            <div
              style={{
                borderTop: "2px solid #1e8449",
                paddingTop: "8px",
                marginBottom: "5px",
              }}
            />
            <div
              style={{
                fontSize: "clamp(10px, 1.2vw, 14px)",
                color: "#444",
                fontWeight: "600",
              }}
            >
              Authentication Officer
            </div>
            <div style={{ fontSize: "clamp(9px, 1.1vw, 12px)", color: "#666" }}>
              Benue State Government
            </div>
          </div>
        </div>

        {/* Actual QR Code - moved to bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "40px",
            width: "clamp(80px, 10vw, 120px)",
            height: "clamp(80px, 10vw, 120px)",
            background: "white",
            padding: "10px",
            borderRadius: "8px",
            border: "2px solid #1e8449",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
              `Certificate ID: ${
                props.certificateReferenceId || "BEN-ICT-2025-001"
              }\nIssued to: ${
                props.certificationAddressedTo || "Benue Tech Solutions Ltd."
              }\nIssue Date: ${new Date(
                props.issueDate || Date.now()
              ).toLocaleDateString(
                "en-GB"
              )}\nVerify at: https://benue.gov.ng/verify`
            )}`}
            alt="QR Code for Certificate Verification"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "80px",
            }}
            crossOrigin="anonymous"
          />
          <div
            style={{
              fontSize: "clamp(8px, 1vw, 10px)",
              color: "#1e8449",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "5px",
            }}
          >
            SCAN TO VERIFY
          </div>
        </div>

        {/* Security microtext */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "8px",
            color: "rgba(30, 132, 73, 0.6)",
            letterSpacing: "1px",
            zIndex: 1,
          }}
        >
          SECURITY FEATURES: WATERMARK • MICROTEXT • OFFICIAL SEAL • UNIQUE ID
        </div>
      </div>
    </div>
  );
});

//EnhancedCertificate.displayName = "EnhancedCertificate";

export default EnhancedCertificate;
