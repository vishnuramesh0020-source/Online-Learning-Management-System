import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthHeroIllustration from '../components/auth/AuthHeroIllustration';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-20 select-text">
      {/* Toast notification container */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        theme="light"
      />

      {/* Main Content: 2-Column Responsive Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center py-6">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Illustration */}
          <div className="hidden lg:flex lg:col-span-6 justify-center items-center">
            <AuthHeroIllustration />
          </div>

          {/* Right Column: Form Container */}
          <div className="col-span-1 lg:col-span-6 flex flex-col justify-center max-w-[420px] w-full mx-auto">
            <Outlet />
          </div>

        </div>
      </div>

      {/* Page Footer Matching Mockup Exactly */}
      <footer className="w-full max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#4b5563]">
        <p>
          &copy; 2022 All rights reserved{' '}
          <span className="text-[#fa5507] font-semibold">Education Pro</span>
        </p>

        {/* Outline Social Icons (Facebook, YouTube, TikTok) */}
        <div className="flex items-center gap-3">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-6 h-6 rounded-md border border-[#374151] text-[#374151] hover:text-[#fa5507] hover:border-[#fa5507] flex items-center justify-center transition-colors"
            aria-label="Facebook"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* YouTube / Play */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="w-6 h-6 rounded-md border border-[#374151] text-[#374151] hover:text-[#fa5507] hover:border-[#fa5507] flex items-center justify-center transition-colors"
            aria-label="YouTube"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="w-6 h-6 rounded-md border border-[#374151] text-[#374151] hover:text-[#fa5507] hover:border-[#fa5507] flex items-center justify-center transition-colors"
            aria-label="TikTok"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.69c0 2.21-.77 4.39-2.22 6.03-1.45 1.63-3.52 2.67-5.71 2.82-2.2.15-4.42-.51-6.14-1.91-1.72-1.4-2.82-3.41-3.04-5.61-.22-2.21.46-4.44 1.89-6.13 1.43-1.69 3.49-2.73 5.7-2.87.52-.03 1.05 0 1.57.08v4.14c-.66-.19-1.38-.2-2.04-.04-.67.16-1.28.53-1.72 1.05-.44.52-.69 1.19-.68 1.88.01.69.28 1.35.74 1.85.46.51 1.08.85 1.76.97.68.12 1.39.02 2.01-.27.62-.29 1.12-.79 1.42-1.41.29-.62.43-1.31.42-2.01V.02z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
