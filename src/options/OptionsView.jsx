
import React, { useState, useRef, useEffect } from 'react';
import ShortcutsTab from './ShortcutsTab';
import AboutView from './AboutView';
import { isChromeExtension } from '../util/common';

const OptionsView = () => {
    const tabs = {
        Shortcuts: {
            Name: "Shortcuts",
            Contents: <ShortcutsTab />
        },
        About: {
            Name: "About",
            Contents: <AboutView />
        }
    }

    const [currentTab, setCurrentTab] = useState('Shortcuts');

    return (
        <div className="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
            <h1 className="border-b py-6 text-4xl font-semibold">OkPal Options</h1>
            <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
                <div className="relative my-4 w-56 sm:hidden">
                    <input className="peer hidden" type="checkbox" name="select-1" id="select-1" />
                    <label for="select-1"
                        className="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-700 peer-checked:ring">Accounts
                    </label>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-slate-700 transition peer-checked:rotate-180"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    <ul
                        className="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-md transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
                        <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white">
                            Accounts</li>
                        <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white">Team
                        </li>
                        <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white">
                            Others</li>
                    </ul>
                </div>

                <div className="col-span-2 hidden sm:block">
                    <ul>
                        {Object.keys(tabs).map((key) => (
                            <li key={key}
                                className={`${currentTab == tabs[key].Name ? 'border-l-blue-700 text-blue-700' : 'border-transparent'} mt-5 cursor-pointer border-l-2 hover:text-blue-700 px-2 py-2 font-semibold transition hover:border-l-blue-700`}
                                onClick={(e) => setCurrentTab(key)}>
                                {tabs[key].Name}</li>
                        ))}

                        {!isChromeExtension() &&
                            <li className="border-transparent mt-5 cursor-pointer border-l-2 hover:text-blue-700 px-2 py-2 font-semibold transition hover:border-l-blue-700">
                                <a href="?options=0">Exit Options</a>
                            </li>
                        }
                    </ul>
                </div>

                <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
                    {currentTab in tabs && tabs[currentTab].Contents}
                </div>
            </div>
        </div>
    );
};

export default OptionsView;