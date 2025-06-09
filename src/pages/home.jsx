import React from "react";
const { ipcRenderer } = window.require("electron");

// async function fetchUsers() {
//   const users = await ipcRenderer.invoke("get-users");
//   //console.log(users);
// }

ipcRenderer.invoke("get-users").then((users) => {
  console.log(users);
});

export default function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <button>teste</button>
    </div>
  );
}
