"use client";

export default function Toast({ message, visible }) {
  return (
    <div className={`toast ${visible ? "toast--visible" : "toast--hidden"}`}>
      {message}
    </div>
  );
}
