import { useState } from "react";
import  logo  from "../assets/waz-here-logo.png"
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../lib/auth.api";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await loginUser(formData.email, formData.password);
      navigate(`/profile/${user.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-bold text-white tracking-widest mb-2">
        WAZ HERE
      </h1>
      <img src={logo} alt="Waz Here" className="w-55 h-40 mx-auto mr-8 my-2 " />
      <p className="text-primary text-xs tracking-[0.3em] uppercase my-6">
        Plant your flag
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-transparent border border-green-900 focus:border-primary text-white placeholder-gray-600 rounded-lg px-4 py-3 outline-none transition-colors"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-transparent border border-green-900 focus:border-primary text-white placeholder-gray-600 rounded-lg px-4 py-3 outline-none transition-colors"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3 rounded-full transition-all duration-300 mt-2"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-600 text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:text-green-400">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
