import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [products, setProducts] = useState([]);

  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: ""
  });

  // Manejar inputs de login
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // Login
  const login = async () => {
    try {
      const res = await axios.post("https://marketplace-fullstack-0xuz.onrender.com", {
        username: loginData.username,
        password: loginData.password
      });

      localStorage.setItem("token", res.data.access);
      setToken(res.data.access);
    } catch (error) {
      console.log("ERROR LOGIN:", error.response?.data || error.message);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setProducts([]);
  };

  // Obtener productos
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/products/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Cargar productos cuando hay token
  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  // Manejar inputs de producto
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Crear producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/products/",
        {
          name: form.name,
          description: form.description,
          price: Number(form.price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProducts();

      setForm({
        name: "",
        description: "",
        price: ""
      });

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Marketplace</h1>

      {/* Login */}
      {!token && (
        <>
          <h2>Login</h2>

          <input
            name="username"
            placeholder="Username"
            value={loginData.username}
            onChange={handleLoginChange}
          />
          <br />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
          />
          <br />

          <button onClick={login}>Iniciar sesión</button>

          <hr />
        </>
      )}

      {/* Zona autenticada */}
      {token && (
        <>
          <button onClick={logout} style={{ marginBottom: "20px" }}>
            Logout
          </button>

          <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
            />
            <br />

            <input
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
            />
            <br />

            <input
              name="price"
              placeholder="Precio"
              value={form.price}
              onChange={handleChange}
            />
            <br />

            <button type="submit">Publicar producto</button>
          </form>
        </>
      )}

      {/* Lista de productos */}
      {token && products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px"
          }}
        >
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <strong>S/ {p.price}</strong>
        </div>
      ))}
    </div>
  );
}

export default App;