import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>

        {/* Form */}
        <form className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Entrez votre email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Entrez votre mot de passe"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Se connecter
            </button>
          </div>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <a
            href="/reset-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Mot de passe oublié ?
          </a>
          <div>
            <a
              href="/register"
              className="text-sm text-blue-600 hover:underline"
            >
              Créer un compte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
