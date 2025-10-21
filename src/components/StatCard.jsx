const StatCard = ({ title, value }) => {
  return (
    <div className="bg-dark-100 p-6 rounded-2xl shadow-inner shadow-light-100/10 hover:shadow-light-100/20 transition transform hover:scale-[1.02]">
      <h3 className="text-light-200 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gradient">{value}</p>
    </div>
  );
};

export default StatCard;
