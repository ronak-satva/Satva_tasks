import { useEffect, useRef } from 'react'


function AutoFocusMemoPad() {
  //  Ref for textarea (to access DOM)
  const textAreaRef = useRef(null);

  //  Ref to store save count (persistent value)
  const saveCountRef = useRef(0);

  //  Focus textarea on component mount
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  //  Manual Save function
  const handleSave = () => {
    saveCountRef.current += 1;
    console.log("Saved Times:", saveCountRef.current);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Auto-Focus Memo Pad</h2>

      <textarea
        ref={textAreaRef}
        placeholder="Write your notes here..."
        rows="5"
        cols="40"
      />

      <br /><br />

      <button onClick={handleSave}>
        Manual Save
      </button>
    </div>
  );
}

export default AutoFocusMemoPad;
