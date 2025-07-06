import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "./button";

export const AuthModal = ({
  setShowAuth,
  setShowUserProfile
}: {

  setShowAuth: (show: boolean) => void;
  setShowUserProfile:(show: boolean) => void;

}) => {

  //Form states defined
  const [loginForm, setLoginForm] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<{
    username: string;
    email: string;
    password: string;
    password2: string;
  }>({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  
  const [registerView, setRegisterView] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);

    // Authentication functions
  const handleLogin = async () => {
    try {
      setLoggingIn(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/`, {
        email: loginForm.email,
        password: loginForm.password,
      });
      if (res.data.access) {  
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        setShowAuth(false);
        setLoginForm({ email: "", password: "" });
        window.location.reload()
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
     setLoggingIn(false);
    }
  };

  const handleRegister = async () => {
    if (registerForm.password !== registerForm.password2) {
      alert("Passwords don't match!");
      return;
    }

    try {
      setCreatingUser(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register/`, registerForm);
      console.log("Registration response:", res.data);
      if (res.status === 201) {
        alert("Registration successful, you can now log in!");
        setRegisterForm({
          username: "",
          email: "",
          password: "",
          password2: "",
        });
        setShowAuth(false);
        setShowUserProfile(true);
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    } finally{
     setCreatingUser(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50  backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">
          {registerView ? "Create Account" : "Login"}
        </h2>

        <div className="space-y-4">
          {registerView && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, username: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={registerView? registerForm.email : loginForm.email}
            onChange={(e) =>
             registerView
                ? setRegisterForm({ ...registerForm, email: e.target.value })
                : setLoginForm({ ...loginForm, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={registerView? registerForm.password : loginForm.password}
            onChange={(e) =>
             registerView
                ? setRegisterForm({ ...registerForm, password: e.target.value })
                : setLoginForm({ ...loginForm, password: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {registerView&& (
            <input
              type="password"
              placeholder="Confirm Password"
              value={registerForm.password2}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password2: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            onClick={registerView? handleRegister : handleLogin}
            className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            disabled ={!registerView&& (!loginForm.email || !loginForm.password) ||
                      registerView&& (!registerForm.email || !registerForm.password || !registerForm.username || registerForm.password !== registerForm.password2)|| creatingUser || loggingIn}
          >
            {registerView? "Register" : "Login"}
          </Button>
          <button
            onClick={() => setShowAuth(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setRegisterView(!registerView)}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            {registerView
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

