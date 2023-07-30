
function Loader({
  label = '',
}: {
  label?: string,
}) {
  return (
    <div className="relative w-full h-96 max-h-screen flex flex-col justify-center items-center text-primary">
      <span className="loading loading-dots loading-lg" />
      {label && (
        <span>
          {label}
        </span>
      )}
    </div>
  )
}

export default Loader;
