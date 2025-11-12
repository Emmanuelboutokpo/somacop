'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Informations société */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">SOMACOB</h3>
            <p className="text-sm text-gray-600">
              Route de Tori 2e rue après l'église Origigi
            </p>
            <p className="text-sm text-gray-600">
              0196734979 / 0197731665
            </p>
          </div>

          {/* Application */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Application</h3>
            <p className="text-sm text-gray-600">
              Gestion de Facturation
            </p>
            <p className="text-sm text-gray-600">
              Bordereaux de Déchargement
            </p>
          </div>

          {/* Copyright */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} SOMACOB
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Version 1.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}