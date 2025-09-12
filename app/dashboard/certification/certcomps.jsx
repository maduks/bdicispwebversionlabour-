import React from "react";

// For a real React app, you'd import fonts in your main CSS or public/index.html
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

const Certifications = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f8f8",
        overflow: "auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: "90vw",
          maxWidth: "297mm",
          padding: "3.5vw",
          boxSizing: "border-box",
          border: "0.5vw solid #28a745",
          borderRadius: "1.5vw",
          backgroundColor: "#fff",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 1vw 2vw rgba(0, 0, 0, 0.15)",
          backgroundImage: "linear-gradient(to bottom right, #ffffff, #f0fff0)",
        }}
      >
        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-45deg)",
            fontSize: "12vw",
            color: "rgba(40, 167, 69, 0.07)",
            fontWeight: "900",
            zIndex: 0,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          CERTIFIED
        </div>

        {/* Logo - Moved to top middle */}
        <img
          src="https://ik.imagekit.io/bdic/benue-government-properties/Images/benue-state-logo.png?updatedAt=1745964333054"
          alt="Benue State Government Logo"
          style={{
            display: "block" /* Make it a block element to apply margin auto */,
            margin:
              "0 auto 2vw auto" /* Center horizontally, add bottom margin */,
            width: "8vw",
            height: "auto",
            borderRadius: "0",
            boxShadow: "none",
            position: "relative" /* Changed from absolute for centering */,
            top: "unset" /* Remove previous absolute positioning */,
            left: "unset" /* Remove previous absolute positioning */,
          }}
        />

        {/* Header */}
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "3.8vw",
            color: "#1e8449",
            marginBottom: "1.5vw",
            textTransform: "uppercase",
            letterSpacing: "0.3vw",
            fontWeight: "700",
            textShadow: "0.1vw 0.1vw 0.2vw rgba(0, 0, 0, 0.1)",
            marginTop: "0" /* Removed margin-top as logo now handles spacing */,
          }}
        >
          Certificate of Authentication {}
        </div>
        <div
          style={{
            fontSize: "1.4vw",
            marginBottom: "0.8vw",
            color: "#555",
          }}
        >
          This certifies that
        </div>
        <div
          style={{
            fontSize: "2.8vw",
            fontWeight: "bold",
            color: "#333",
            margin: "2.5vw 0",
            textTransform: "capitalize",
            lineHeight: "1.2",
          }}
        >
          {props.certificationAddressedTo || "Benue Tech Solutions Ltd."}
        </div>
        <div
          style={{
            fontSize: "1.4vw",
            marginBottom: "0.8vw",
            color: "#555",
          }}
        >
          is hereby recognized as an authenticated{" "}
          {props.certificationType.toLowerCase() == "business" ? (
            <b>Business Premises </b>
          ) : props.certificationType.toLowerCase() == "service" ? (
            <b>Service Provider </b>
          ) : props.certificationType.toLowerCase() == "property" ? (
            <b>Property Listing Agent </b>
          ) : props.certificationType.toLowerCase() == "product" ? (
            <b>Product Sales/Distributor </b>
          ) : (
            ""
          )}
          under the
        </div>
        <div
          style={{
            fontSize: "1.8vw",
            fontWeight: "bold",
            color: "#666",
            marginBottom: "2.5vw",
          }}
        >
          {props.serviceCategory ||
            "Integrated Property, Business, Product and Commodity System"}
        </div>

        {/* Date Info */}
        <div
          style={{
            fontSize: "1.1vw",
            marginTop: "3vw",
            color: "#777",
            lineHeight: "1.6",
          }}
        >
          Certified on:{" "}
          <span id="certificationDate">
            {new Date(props.issueDate).toDateString() || "May 28, 2025"}
          </span>
          <br />
          Valid until:{" "}
          <span id="validUntilDate">
            {new Date(props.expirationDate).toDateString() || "May 28, 2026"}
          </span>
        </div>

        {/* Signature Area */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-end",
            marginTop: "5vw",
            width: "85%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "0 2.5vw",
            }}
          >
            <img
              src={
                "https://ik.imagekit.io/bdic/signature_.png?updatedAt=1748480486518"
              }
            />
            <div
              style={{
                borderTop: "0.2vw solid #888",
                paddingTop: "0.5vw",
                marginBottom: "0.5vw",
              }}
            ></div>
            <div
              style={{
                fontSize: "1vw",
                color: "#444",
              }}
            >
              {props.authorizedSignatoryName || "Dr. Terkula Agbaji"}
            </div>
            <div
              style={{
                fontSize: "1vw",
                color: "#444",
              }}
            >
              {props.authorizedSignatoryTitle || "Director, ICT Department"}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              padding: "0 2.5vw",
            }}
          >
            <img
              src={
                "https://ik.imagekit.io/bdic/signature_.png?updatedAt=1748480486518"
              }
            />
            <div
              style={{
                borderTop: "0.2vw solid #888",
                paddingTop: "0.5vw",
                marginBottom: "0.5vw",
              }}
            ></div>
            <div
              style={{
                fontSize: "1vw",
                color: "#444",
              }}
            >
              Date of Issuance
            </div>
            <div
              style={{
                fontSize: "1vw",
                color: "#444",
              }}
            >
              {new Date(props.issueDate).toDateString() || "28/05/2025"}
            </div>
          </div>
        </div>

        {/* Seal Placeholder - Enhanced with SVG for shiny, edged look */}
        <div
          style={{
            position: "absolute",
            bottom: "3.5vw",
            left: "3.5vw",
            width: "7vw",
            height: "7vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            /* No direct border or background here, the SVG will handle the visual */
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            style={{ width: "100%", height: "100%" }}
          >
            {/* Define a linear gradient for the shiny effect */}
            <defs>
              <linearGradient
                id="shinyGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffd700" /> {/* Gold start */}
                <stop offset="50%" stopColor="#ffea00" />{" "}
                {/* Brighter gold middle */}
                <stop offset="100%" stopColor="#ccac00" />{" "}
                {/* Darker gold end */}
              </linearGradient>
              <filter id="emboss" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur
                  in="SourceAlpha"
                  stdDeviation="1"
                  result="blur"
                />
                <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
                <feSpecularLighting
                  in="offsetBlur"
                  surfaceScale="5"
                  specularConstant="0.7"
                  specularExponent="20"
                  lightingColor="#fff"
                >
                  <fePointLight x="-5000" y="-10000" z="20000" />
                </feSpecularLighting>
                <feComposite
                  in="SourceGraphic"
                  in2="specularLighting"
                  operator="arithmetic"
                  k1="0"
                  k2="1"
                  k3="1"
                  k4="0"
                  result="lit"
                />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="lit" />
                </feMerge>
              </filter>
            </defs>
            {/* Outer ring with a subtle edge/emboss effect */}
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="url(#shinyGradient)"
              filter="url(#emboss)"
            />
            <circle cx="50" cy="50" r="45" fill="#f0f0f0" />{" "}
            {/* Inner circle for contrast */}
            {/* Inner design (e.g., a star or a more complex shape) */}
            <g transform="translate(50, 50)">
              <polygon
                points="0,-20 5.8,-8.1 19,-6.2 9.5,2.3 11.8,15.6 0,10 -11.8,15.6 -9.5,2.3 -19,-6.2 -5.8,-8.1"
                fill="#1e8449"
              />{" "}
              {/* Green star */}
            </g>
            {/* Text around the circle */}
            <text
              x="50"
              y="25"
              textAnchor="middle"
              fontSize="8"
              fill="#333"
              fontWeight="bold"
            >
              <textPath href="#circlePath" startOffset="25%">
                OFFICIAL SEAL
              </textPath>
            </text>
            <text x="50" y="85" textAnchor="middle" fontSize="7" fill="#555">
              <textPath href="#circlePath" startOffset="75%">
                BENUE STATE GOVT.
              </textPath>
            </text>
            <path
              id="circlePath"
              d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
              fill="none"
              stroke="none"
            />
          </svg>
        </div>

        {/* Certification ID */}
        <div
          style={{
            position: "absolute",
            bottom: "1.5vw",
            right: "3.5vw",
            fontSize: "0.85vw",
            color: "#999",
          }}
        >
          Certification ID:{" "}
          <span id="certificationId">
            {props.certificateReferenceId || "BENUE-ICT-2025-001"}
          </span>
        </div>
      </div>
    </div>
  );
});

export default Certifications;
