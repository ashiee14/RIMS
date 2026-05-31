const StatCard = ({ title, value }) => {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <p style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 12,
          }}
          >{value}</p>
    </div>
  );
};

export default StatCard;