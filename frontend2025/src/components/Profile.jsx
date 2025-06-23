import { useUser } from '../context/UserContext';
import { useScore } from '../context/ScoreContext';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { correct, wrong } = useScore();
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 py-8 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 relative text-center">
        
        <div className="absolute top-4 right-4 flex space-x-3">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className="text-sm text-white underline hover:text-blue-400 cursor-pointer"
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage('tr')}
            className="text-sm text-white underline hover:text-blue-400 cursor-pointer"
          >
            TR
          </button>
        </div>

        <div className="mb-6 flex justify-center">
          <img
            src="/background_Homepage/logo.png"
            alt="Logo"
            className="w-16 h-auto"
          />
        </div>
        <h1 className="text-3xl font-bold mb-6 border-b border-blue-500 pb-2">
          {t('profile_page_title')}
        </h1>

        <p className="text-lg mb-4">
          {t('welcome')}, <span className="font-semibold">{user?.username || 'misafir'}</span>!
        </p>

        <div className="flex justify-around mt-6 text-lg font-medium">
          <div className="bg-gray-700 rounded-lg p-4 w-1/2 mx-2">
            <p className="text-blue-400">{t('correct_count')}</p>
            <p className="mt-2 text-2xl">{correct}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 w-1/2 mx-2">
            <p className="text-red-400">{t('wrong_count')}</p>
            <p className="mt-2 text-2xl">{wrong}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
