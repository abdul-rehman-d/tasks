
const Input = ({
  name,
  label,
  type,
  id,
  placeholder,
  error,
}: {
  name: string;
  label: string;
  type: string;
  id: string;
  placeholder: string;
  error: string;
}) => {
  return (
    <div>
        <label className="label">
            <span className="text-base label-text">{label}</span>
        </label>
        <input
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          className="w-full input input-bordered input-primary"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default Input;
