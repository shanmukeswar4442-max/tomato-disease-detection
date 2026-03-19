function Skeleton() {
  return (
    <div className="max-w-xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow p-4 mb-4 animate-pulse"
        >
          <div className="h-40 bg-gray-200 rounded-lg mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;