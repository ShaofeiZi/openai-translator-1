import clsx from 'clsx';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CgArrowsExchange } from 'react-icons/cg';
import TextareaAutosize from 'react-textarea-autosize';

import { useGlobalStore } from '@/components/GlobalStore';
import { Language, LANGUAGES } from '@/constants';

function TranslatorPage() {
  const { t } = useTranslation();

  const {
    openaiApiKey,
    currentModel,
    translator: { translatedText, mutateTanslateText, isTranslating, isTranslateError },
  } = useGlobalStore();

  const handleTranslate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!openaiApiKey) {
      toast.error('Please enter your API Key in config page first!');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const { translateText } = Object.fromEntries(formData.entries());
    if (!translateText) {
      return;
    }
    mutateTanslateText({
      token: openaiApiKey,
      engine: currentModel,
      prompt: '翻译成简体白话文',
      queryText: translateText as string,
    });
  };

  useEffect(() => {
    if (!isTranslateError) {
      return;
    }
    toast.error('Something went wrong, please try again later.');
  }, [isTranslateError]);

  return (
    <>
      <div className="w-full max-w-full p-4 m-0 shadow-md top-16 bg-base-100">
        <form method="post" onSubmit={handleTranslate}>
          <div className="flex flex-row mb-2">
            <select className="w-5/12 select" defaultValue="Auto">
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGES[lang as Language]}
                </option>
              ))}
            </select>

            <div className="flex justify-center w-2/12">
              <button type="button" className="btn btn-circle btn-ghost">
                <CgArrowsExchange size={20} />
              </button>
            </div>

            <select className="w-5/12 select" defaultValue="Auto">
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGES[lang as Language]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <TextareaAutosize
              name="translateText"
              defaultValue={translatedText}
              className="w-full mb-2 break-all rounded-2xl textarea textarea-md textarea-primary"
              placeholder="Please enter the text you want to translate here."
              required
            ></TextareaAutosize>

            <button
              type="submit"
              className={clsx('btn btn-primary', isTranslating && 'loading')}
              disabled={isTranslating}
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </form>
      </div>
      <div className="grid w-full max-w-full grid-cols-1 gap-4 p-4 m-0 mb-12">
        <TextareaAutosize
          name="translatedText"
          value={isTranslating ? '' : translatedText}
          className="w-full mb-2 break-all rounded-2xl textarea textarea-md textarea-ghost"
          placeholder={isTranslating ? 'Please wait...' : 'Translated text will appear here.'}
          readOnly
          required
        ></TextareaAutosize>
      </div>
    </>
  );
}

export default TranslatorPage;
