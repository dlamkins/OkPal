import { getSettingValue, setSettingValue } from '../util/settings'
import SplunkShortcut from './SplunkShortcut';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useRef, useEffect } from 'react';

const ShortcutsTab = () => {
    const [locale, setLocale] = useState('en-US');
    const [splunkShortcuts, setSplunkShortcuts] = useState({});

    useEffect(() => {
        // Load the saved locale setting when the component mounts
        getSettingValue('splunkLocale', (savedLocale) => {
            if (savedLocale) {
                setLocale(savedLocale);
            }
        });

        // Load the saved splunk shortcuts
        getSettingValue('splunkShortcuts', (savedSplunkShortcuts) => {
            if (savedSplunkShortcuts) {
                setSplunkShortcuts(savedSplunkShortcuts);
            }
        });
    }, []);

    const handleLocaleChange = (event) => {
        const newLocale = event.target.value;
        setLocale(newLocale);
        setSettingValue('splunkLocale', newLocale);
    };

    const updateSplunkShortcut = (shortcut, del = false) => {
        getSettingValue('splunkShortcuts', (shortcuts) => {
            shortcuts ??= {};

            if (del) {
                delete shortcuts[shortcut.Id];
            } else {
                shortcuts[shortcut.Id] = shortcut;
            }
            setSettingValue('splunkShortcuts', shortcuts);
            setSplunkShortcuts(shortcuts);
        });
    }

    const addSplunkShortcut = () => {
        updateSplunkShortcut({
            Id: `splunk_${Date.now()}`,
            Name: 'New Splunk Query',
            Visible: true,
            Mode: 'Fast',
            Query: ''
        });
    }

    return (
        <div className="py-6">
            <div>
                <h1 className="text-2xl font-semibold">Shortcuts</h1>
                <p className="text-slate-600">Manage your shortcuts.</p>
            </div>
            <hr className="mt-4 mb-8" />
            <p className="py-2 text-xl font-semibold">Splunk Shortcuts</p>

            <label for="locale" className="block mb-2 text-sm font-medium">Select your locale</label>
            <select id="locale" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                value={locale}
                onChange={handleLocaleChange}>
                <option value="en-US">en-US</option>
                <option value="en-GB">en-GB</option>
            </select>
            <hr className="mt-4 mb-8" />
            
            { Object.keys(splunkShortcuts).map((key) => (
                <SplunkShortcut key={key} shortcut={splunkShortcuts[key]} update={updateSplunkShortcut} />
            ))}

            <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white" onClick={addSplunkShortcut}>Add Splunk Shortcut</button>
        </div>
    );
};

export default ShortcutsTab;