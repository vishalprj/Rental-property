import { loginUser, registerUser } from "@/app/store/queries";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AuthModals = ({ onLoginSuccess, onClose }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await loginUser({ email, password });
      const username = res?.data?.data?.name;
      const userId = res?.data?.data?.id;
      if (username) {
        toast.success("User logged in successfully");
        localStorage.setItem("user", username);
        localStorage.setItem("userId", userId);
        onLoginSuccess(username);
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (
    email: string,
    password: string,
    name: string
  ) => {
    setIsLoading(true);
    try {
      const res = await registerUser({ email, password, name });
      if (res?.data) {
        toast.success("User registered successfully");
        setShowSignup(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 ${showSignup ? "hidden" : ""}`}
      >
        <div className="bg-white rounded-lg w-full max-w-md p-8 shadow-lg relative">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-600 mb-2">Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="button"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex justify-center items-center"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
          >
            &#10005;
          </button>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              New here?{" "}
              <button
                onClick={() => setShowSignup(true)}
                className="text-blue-500 hover:underline"
              >
                Sign up for an account
              </button>
            </p>
          </div>
        </div>
      </div>

      {showSignup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-8 shadow-lg relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignup(email, password, name);
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-600 mb-2">Username</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-600 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing up
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
            >
              &#10005;
            </button>
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-blue-500 hover:underline"
                >
                  Login instead
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModals;
