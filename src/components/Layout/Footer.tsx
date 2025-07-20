import { Twitter, Github, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 text-gray-600 dark:text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="text-lg font-semibold text-gray-800 dark:text-white">
          JeyCrypto
        </div>

        {/* Links */}
        <div className="flex space-x-6 text-sm">
          <a href="/" className="hover:text-indigo-500">
            Home
          </a>
          <a href="/market" className="hover:text-indigo-500">
            Market
          </a>
          <a href="/portfolio" className="hover:text-indigo-500">
            Portfolio
          </a>
        </div>

        {/* Socials */}
        <div className="flex space-x-4">
          <a
            href="https://x.com/JeyceeJ68804"
            className="hover:text-indigo-500"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/Jeyceejeyka"
            className="hover:text-indigo-500"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="mailto:jeyceejeyka635@gmail.com"
            className="hover:text-indigo-500"
            aria-label="Send Email"
          >
            <Send className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} JeyCrypto. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
