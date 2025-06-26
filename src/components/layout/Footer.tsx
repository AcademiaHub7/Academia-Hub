import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <GraduationCap className="relative w-8 h-8 text-blue-400" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Academia Hub
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed">
              La plateforme de gestion scolaire intelligente qui révolutionne l'éducation avec l'IA. 
              Simplifiez la gestion de votre établissement avec nos solutions innovantes.
            </p>
            <div className="flex space-x-4">
              {[
                { 
                  icon: Facebook, 
                  name: 'Facebook',
                  href: "https://web.facebook.com/profile.php?id=61577143661930" 
                },
                { 
                  icon: Twitter, 
                  name: 'Twitter',
                  href: "https://twitter.com" 
                },
                { 
                  icon: Linkedin, 
                  name: 'LinkedIn',
                  href: "https://linkedin.com" 
                },
                { 
                  icon: Instagram, 
                  name: 'Instagram',
                  href: "https://instagram.com" 
                },
                { 
                  icon: Youtube, 
                  name: 'YouTube',
                  href: "https://youtube.com" 
                },
              ].map(({ icon: Icon, name, href }, index) => (
                <a 
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white hover:bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full transition-all duration-300 hover:-translate-y-1"
                  aria-label={`Suivez-nous sur ${name}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Liens rapides
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Accueil", href: "/" },
                { name: "Fonctionnalités", href: "/features" },
                { name: "Tarifs", href: "/pricing" },
                { name: "Témoignages", href: "/testimonials" },
                { name: "Blog", href: "/blog" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Support
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Centre d'aide", href: "/help-center" },
                { name: "Documentation", href: "/documentation" },
                { name: "Tutoriels", href: "/tutorials" },
                { name: "FAQ", href: "/faq" },
                { name: "Statut des services", href: "/status" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Contactez-nous
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-300">Email</p>
                  <a href="mailto:contact@yehiortech.com" className="text-white hover:text-blue-300 transition-colors">
                    contact@yehiortech.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-300">Téléphone</p>
                  <a href="tel:+2290195722234" className="text-white hover:text-blue-300 transition-colors">
                    +229 01 95 72 22 34
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-300">Adresse</p>
                  <p className="text-white">Parakou, Bénin</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Academia Hub. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 md:mt-0">
              <Link to="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">
                FAQ
              </Link>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">
                Conditions d'utilisation
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Préférences des cookies
              </Link>
            </div>
          </div>
          <div className="mt-2 text-center md:text-left">
            <p className="text-xs text-gray-500">
              Conçu avec ❤️ par l'équipe YEHI OR Tech
            </p>
          </div>

          <div className="mt-6 md:mt-0 text-center md:text-right">
            <p className="text-sm text-gray-400 mb-3">Méthodes de paiement acceptées :</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <div className="bg-white p-2 rounded-md shadow-sm">
                <img 
                  src="/images/mtn-money.png" 
                  alt="MTN Mobile Money" 
                  className="h-6 w-auto object-contain"
                  title="MTN Mobile Money"
                />
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm">
                <img 
                  src="/images/moov-money.png" 
                  alt="Moov Money" 
                  className="h-6 w-auto object-contain"
                  title="Moov Money"
                />
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm">
                <img 
                  src="/images/celtiis-cash.png" 
                  alt="Celtiis Cash" 
                  className="h-6 w-auto object-contain"
                  title="Celtiis Cash"
                />
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm">
                <img 
                  src="/images/visa.png" 
                  alt="Visa" 
                  className="h-5 w-auto object-contain"
                  title="Visa"
                />
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm">
                <img 
                  src="/images/mastercard.png" 
                  alt="MasterCard" 
                  className="h-5 w-auto object-contain"
                  title="MasterCard"
                />
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end space-x-2 mt-3">
              <p className="text-xs text-gray-500">Paiement sécurisé avec FedaPay</p>
              <img 
                src="/images/logoFedaPay.png" 
                alt="FedaPay" 
                className="h-4 w-auto object-contain"
                title="FedaPay"
              />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;