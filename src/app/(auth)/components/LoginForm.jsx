'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLogin, useGeneralLogin } from '@/hooks/query/useAuth';
import Button from '@/app/components/ui/Button';
import Loader from '@/app/components/ui/Loader';

export default function LoginForm() {
  const [userType, setUserType] = useState('student'); // 'student' or 'general'
  const [matricNo, setMatricNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const { login: studentLogin, isLoginLoading: isStudentLoginLoading } = useLogin();
  const { generalLogin, isGeneralLoginLoading } = useGeneralLogin();

  const isLoading = isStudentLoginLoading || isGeneralLoginLoading;

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (userType === 'student' && matricNo.length !== 11) {
      newErrors.matricNo = 'Invalid matric number';
    } else if (userType === 'general' && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (userType === 'student') {
        studentLogin({ matricNo, password });
      } else {
        generalLogin({ email, password });
      }
    }
  }

  return (
    <>
      <div className="flex bg-black/30 p-1 rounded-lg mb-6 border border-white/5">
        <button
          type="button"
          onClick={() => setUserType('student')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            userType === 'student'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          University Student
        </button>
        <button
          type="button"
          onClick={() => setUserType('general')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            userType === 'general'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          General User
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {userType === 'student' ? (
          <div>
            <label htmlFor="matricNumber" className="block text-sm font-medium leading-6 text-white">
              Matric No.
            </label>
            <div className="mt-2">
              <input
                id="matricNumber"
                type="text"
                placeholder="____/______"
                value={matricNo}
                onChange={(e) => {
                  setMatricNo(e.target.value);
                  setErrors((p) => ({ ...p, matricNo: '' }));
                }}
                required
                className="block w-full rounded-md border border-transparent bg-white/5 py-2 px-3 text-white shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none sm:text-md sm:leading-6"
              />
              {errors.matricNo && <p className="text-red-500 text-sm mt-1">{errors.matricNo}</p>}
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: '' }));
                }}
                required
                className="block w-full rounded-md border border-transparent bg-white/5 py-2 px-3 text-white shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none sm:text-md sm:leading-6"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-white"
            >
              Password
            </label>
            <div className="text-sm">
              <Link href="/forgot-password" className="font-semibold text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </Link>
            </div>
          </div>
          <div className="mt-2">
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: '' }));
              }}
              required
              className="block w-full rounded-md border border-transparent bg-white/5 py-2 px-3 text-white shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none sm:text-md sm:leading-6"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        </div>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? <Loader /> : 'Log in'}
        </Button>
      </form>
    </>
  );
}
