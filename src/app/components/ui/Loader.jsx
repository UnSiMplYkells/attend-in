export default function Loader() {

  const wrapperStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  };
  const pieceStyle = {
    width: "7px",
    height: "20px",
    background: "currentColor",
    animation: "fallIn 1.2s infinite ease-in-out",
  };

  return (
    <>
      <style>
        {`
          @keyframes fallIn {
            0% { transform: translateY(-100%); opacity: 0; }
            20% { transform: translateY(0); opacity: 1; }
            80% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(100%); opacity: 0; }
          }
        `}
      </style>
      <div style={wrapperStyle}>
        <div style={{ ...pieceStyle, animationDelay: "0s" }} />
        <div style={{ ...pieceStyle, animationDelay: "0.15s" }} />
        <div style={{ ...pieceStyle, animationDelay: "0.3s" }} />
      </div>
    </>
  );
}