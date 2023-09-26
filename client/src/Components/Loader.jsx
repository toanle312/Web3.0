const Loader = ({type}) => {
  return(
  <div className="flex justify-center items-center py-3">
    <div className={`animate-spin rounded-full ${type === "small" ? "h-10 w-10" : "h-32 w-32"} border-b-2 border-red-700`} />
  </div>
)};

export default Loader;