import { useState } from "react";

const PublicPage = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("welcome");
  const [notification, setNotification] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };
  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins]">
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <img
          src="/src/assets/logo.png"
          alt="logo"
          className="w-auto h-16 object-contain"
        />
        <button
          onClick={() => {
            setOpen(true);
            setMode("welcome");
             setName("");
             setEmail("");
             setPassword("");
          }}
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          Login / Signup
        </button>
      </div>
      {/* MAIN */}
      <div className="text-center mt-16 px-6">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome to JanSetu
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          A smart grievance management system to connect citizens with
          government services efficiently.
        </p>
      </div>
      {/* SERVICES */}
      <div className="mt-12 flex justify-center gap-6 flex-wrap">
        {["File Complaint", "Track Complaint", "View Reports"].map((item) => (
          <div key={item} className="bg-white p-6 w-60 rounded shadow text-center">
            <h3 className="font-semibold mb-4">{item}</h3>
            <button
              onClick={() => {
                setOpen(true);
                setMode("welcome");
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Use Service
            </button>
          </div>
        ))}
      </div>
      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded shadow-lg relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-xl"
            >
              ×
            </button>
            {/* WELCOME */}
            {mode === "welcome" && (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">
                  Welcome to JanSetu
                </h2>
                <p className="text-sm text-gray-600 mb-2">New User?</p>
                <button
                  onClick={() => setMode("signup")}
                  className="w-full bg-blue-600 text-white py-2 rounded mb-3"
                >
                  Signup
                </button>
                <p className="text-sm text-gray-600 mb-2">Already a User?</p>
                <button
                  onClick={() => setMode("login")}
                  className="w-full border border-blue-600 text-blue-600 py-2 rounded"
                >
                  Login
                </button>
              </div>
            )}
            {/* SIGNUP */}
            {mode === "signup" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Signup</h2>
                <input
                  placeholder="Name"
                  value={name}
                  autoComplete="off"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 mb-3 rounded"
                />
                <input
                  placeholder="Email"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border p-2 mb-3 rounded"
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-2 mb-3 rounded"
                />
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("http://localhost:5000/api/users/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, email, password }),
                      });
                      const data = await res.json();
                      if (res.status === 201) {
                        showNotification("✅ Signup successful");
                        setMode("login");
                      } else {
                        showNotification("❌ " + data.message);
                      }
                    } catch {
                      showNotification("❌ Signup failed");
                    }
                  }}
                  className="w-full bg-blue-700 text-white py-2 rounded"
                >
                  Signup
                </button>
                <p className="text-sm mt-3 text-center">
                  Already have an account?{" "}
                  <span
                    onClick={() => setMode("login")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </div>
            )}
            {/* LOGIN */}
            {mode === "login" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Login</h2>
                <input
                  placeholder="Email"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border p-2 mb-3 rounded"
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-2 mb-3 rounded"
                />
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("http://localhost:5000/api/users/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                      });
                      const data = await res.json();
                      if (res.status === 200) {
                        localStorage.setItem("token", data.token);
                        const userRes = await fetch("http://localhost:5000/api/users/me", {
                            headers: {
                            Authorization: `Bearer ${data.token}`
                            }
                        });
                        const userData = await userRes.json();
                        localStorage.setItem("username", userData.name);
                        showNotification("✅ Login successful");
                        setTimeout(() => {
                          window.location.href = "/userdashboard";
                        }, 1000);
                      } else {
                        showNotification("❌ " + data.message);
                      }
                    } catch {
                      showNotification("❌ Login failed");
                    }
                  }}
                  className="w-full bg-blue-700 text-white py-2 rounded"
                >
                  Login
                </button>
                <p className="text-sm mt-3 text-center">
                  New user?{" "}
                  <span
                    onClick={() => setMode("signup")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Signup
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* NOTIFICATION */}
      {notification && (
        <div className="fixed top-5 center bg-black text-white px-4 py-2 rounded shadow">
          {notification}
        </div>
      )}
    </div>
  );
};
export default PublicPage;