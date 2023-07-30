import { useState } from "react";

function CopyGroupCodeButton({
  id
}: {
  id: string | undefined
}) {
  const [ isCopied, setIsCopied ] = useState<boolean>(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(id).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    });
  }

  return (
    <div className="w-full flex justify-end">
      <button
        className="btn btn-outline btn-sm"
        onClick={copyToClipboard}
        disabled={isCopied}
      >
        {isCopied ? 'Copied!' : 'Copy Group Code'}
      </button>
    </div>
  )
}

export default CopyGroupCodeButton;
