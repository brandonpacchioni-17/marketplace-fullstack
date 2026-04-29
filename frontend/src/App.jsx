import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [products, setProducts] = useState([]);

  const API_URL = "https://marketplace-fullstack-0xuz.onrender.com";

  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    password: ""
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: ""
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/token/`, loginData);

      localStorage.setItem("token", res.data.access);
      setToken(res.data.access);

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const register = async () => {
    try {
      await axios.post(`${API_URL}/api/register/`, registerData);
      alert("Usuario creado");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setProducts([]);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchProducts();

    const interval = setInterval(() => {
      fetchProducts();
    }, 3000);

    return () => clearInterval(interval);
  }, [token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/products/`,
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
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Marketplace</h1>

      {/* LOGIN */}
      {!token && (
        <>
          <h2>Login</h2>

          <input name="username" value={loginData.username} onChange={handleLoginChange} />
          <input name="password" type="password" value={loginData.password} onChange={handleLoginChange} />

          <button onClick={login}>Login</button>

          <hr />

          {/* REGISTER SOLO SI NO LOGEADO */}
          <h2>Register</h2>

          <input name="username" value={registerData.username} onChange={handleRegisterChange} />
          <input name="password" type="password" value={registerData.password} onChange={handleRegisterChange} />

          <button onClick={register}>Register</button>
        </>
      )}

      {/* LOGGED */}
      {token && (
        <>
          <button onClick={logout}>Logout</button>

          <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} />
            <input name="description" value={form.description} onChange={handleChange} />
            <input name="price" value={form.price} onChange={handleChange} />

            <button type="submit">Crear</button>
          </form>

          {products.map(p => (
            <div key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <strong>{p.price}</strong>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;