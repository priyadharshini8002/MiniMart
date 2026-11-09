// components/Loader.jsx
// A spinning circle shown while data is loading.

function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-box">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default Loader;
