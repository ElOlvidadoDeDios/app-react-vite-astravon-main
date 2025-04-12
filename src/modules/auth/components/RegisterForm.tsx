import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  enviarVerificacionEmail,
  verificarCodigo,
  createUser,
} from "../../../services/User";
import {
  validateEmailOnly,
  validateRegisterForm,
} from "../../../validation/validationFormRegister";
import { User } from "../../../types/User";
import { login } from "../../../services/User/Login";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code" | "register">("email");
  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [errors, setErrors] = useState<Partial<User>>({});
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    password: "",
    mail: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    const { tempErrors } = validateRegisterForm({ ...formData, [name]: value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: tempErrors[name as keyof User],
    }));

    if (name === "mail") {
      const { errors } = validateEmailOnly(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        mail: errors.mail,
      }));
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !verificationCode[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!/^\d$/.test(value) && value !== "") return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  //---------------------------------------------------------------- POST MAIL
  const handleSendVerification = async () => {
    const { errors, isValid } = validateEmailOnly(formData.mail);
    setErrors(errors);

    if (!isValid) return;
    setLoading(true);
    try {
      const response = await enviarVerificacionEmail(formData.mail);
      if (response.success) {
        toast.success(response.message);
        setStep("code");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Oppss, algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------------------------------------- GET VERIFICATION CODE
  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const codeString = verificationCode.join("");
      const response = await verificarCodigo(formData.mail, codeString);
      if (response.success) {
        toast.success(response.message);
        setStep("register");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Oppss, algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------------------------------------- POST USER
  const handleRegister = async () => {
    const { tempErrors, isValid } = validateRegisterForm(formData);
    setErrors(tempErrors);

    if (!isValid) return;
    setLoading(true);
    try {
      const response = await createUser(formData);
      if (response.success) {
        toast.success(response.message);
        const responseLogin = await login({
          mail: formData.mail,
          password: formData.password,
        });

        if (responseLogin.success) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(responseLogin.data));

          setTimeout(() => {
            location.reload();
          }, 1500);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Oppss, algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100">
      {step === "email" && (
        <>
          <div className="mb-3">
            <input
              type="email"
              name="mail"
              className={`form-control custom-input ${
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

          <button
            className="btn btn-primary w-100"
            style={{ height: "3rem", borderRadius: "10px" }}
            onClick={handleSendVerification}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Enviando código...
              </>
            ) : (
              " Continuar →"
            )}
          </button>
        </>
      )}
      {step === "code" && (
        <div className="w-100">
          <div className="d-flex justify-content-between px-4">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="text"
                className="form-control text-center "
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "24px",
                  borderRadius: "10px",
                }}
                value={verificationCode[index] || ""}
                onChange={(e) => handleCodeChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <button
            className="btn btn-primary w-100 mt-3"
            style={{ height: "3rem", borderRadius: "10px" }}
            onClick={handleVerifyCode}
            disabled={verificationCode.some((code) => code === "") || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Verificando código...
              </>
            ) : (
              " Verificar código"
            )}
          </button>
        </div>
      )}

      {step === "register" && (
        <>
          <div className="mb-3">
            <input
              type="text"
              name="firstName"
              className={`form-control custom-input  ${
                errors.firstName ? "is-invalid" : ""
              }`}
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <div className="invalid-feedback d-block text-start">
                {errors.firstName}
              </div>
            )}
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="lastName"
              className={`form-control custom-input ${
                errors.lastName ? "is-invalid" : ""
              }`}
              placeholder="Apellidos"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <div className="invalid-feedback d-block text-start">
                {errors.lastName}
              </div>
            )}
          </div>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`form-control custom-input mb-1`}
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
          </div>{" "}
          {errors.password && (
            <div className="invalid-feedback d-block text-start">
              {errors.password}
            </div>
          )}
          <button
            className="btn btn-primary w-100 mt-3"
            style={{ height: "3rem", borderRadius: "10px" }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </button>
        </>
      )}
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
    </div>
  );
};

export default RegisterForm;
