import { useState } from "react";
import { AuthLogin } from "../../../types/Auth";
import { validateLoginForm } from "../../../validation/validationFormLogin";
import { toast } from "react-toastify";
import { login } from "../../../services/User/Login";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Partial<AuthLogin>>({});
  const [formData, setFormData] = useState<AuthLogin>({
    mail: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    const { tempErrors } = validateLoginForm({ ...formData, [name]: value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name as keyof AuthLogin]: tempErrors[name as keyof AuthLogin],
    }));
  };

  //---------------------------------------------------------------- POST LOGIN
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { tempErrors, isValid } = validateLoginForm(formData);
    setErrors(tempErrors);
    if (!isValid) return;

    setLoading(true);

    try {
      const response = await login({
        mail: formData.mail,
        password: formData.password,
      });

      if (response.success) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(response.data));

        toast.success(response.message);
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Opps, algo salió mal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-100 text-center" onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="email"
          name="mail"
          className={`form-control custom-input mb-1 ${
            errors.mail ? "is-invalid" : ""
          }`}
          placeholder="Correo electrónico"
          value={formData.mail}
          onChange={handleChange}
        />
        {errors.mail && (
          <div className="invalid-feedback d-block text-start">
            {errors.mail}
          </div>
        )}
      </div>

      <div className="mb-3 position-relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          className={`form-control custom-input mb-1 ${
            errors.password ? "is-invalid" : ""
          }`}
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          type="button"
          className="btn-show position-absolute end-0 top-50 translate-middle-y me-2"
          onClick={togglePasswordVisibility}
          style={{ background: "none", border: "none" }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors.password && (
          <div className="invalid-feedback d-block text-start">
            {errors.password}
          </div>
        )}
      </div>

      <button
        className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
        style={{ height: "3rem", borderRadius: "10px" }}
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Iniciando sesión...
          </>
        ) : (
          "Ingresar"
        )}
      </button>

      <div className="d-flex align-items-center my-3">
        <hr className="flex-grow-1 border-light" />
        <span className="mx-2 text-white">o</span>
        <hr className="flex-grow-1 border-light" />
      </div>
      <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center">
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          style={{
            width: "20px",
            height: "20px",
            marginRight: "8px",
          }}
        />
        Ingresar con Google
      </button>
    </form>
  );
};

export default LoginForm;
