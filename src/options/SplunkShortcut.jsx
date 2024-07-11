import { getSettingValue, setSettingValue } from '../util/settings'
import React, { useState, useRef, useEffect } from 'react';

const SplunkShortcut = (args) => {
    const [shortcutName, setShortcutName] = useState(args.shortcut.Name);
    const [mode, setMode] = useState(args.shortcut.Mode);
    const [visible, setVisible] = useState(args.shortcut.Visible);
    const [query, setQuery] = useState(args.shortcut.Query);
    const [dirty, setDirty] = useState(false);

    const save = () => {
        args.shortcut.Name = shortcutName;
        args.shortcut.Mode = mode;
        args.shortcut.Visible = visible;
        args.shortcut.Query = query;
        args.update(args.shortcut);
        setDirty(false);
    }

    const handleShortcutNameChange = (event) => {
        setShortcutName(event.target.value);
        setDirty(true);
    }

    const handleModeChange = (event) => {
        setMode(event.target.value);
        setDirty(true);
    }

    const handleVisibleChange = (event) => {
        setVisible(event.target.checked);
        setDirty(true);
    }

    const handleQueryChange = (event) => {
        setQuery(event.target.value);
        setDirty(true);
    }

    return (
        <div className={`${visible ? "border-l-blue-700" : "border-l-gray-700"} border-l-4 pl-4 mt-4`}>
            <div className="flex items-center mb-2">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                    <label for={`shortcut-name-${args.shortcut.Id}`}>
                        <span className="text-sm text-gray-500">Shortcut Name</span>
                        <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                            <input type="text" id={`shortcut-name-${args.shortcut.Id}`}
                                className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                placeholder="New Shortcut"
                                value={shortcutName}
                                onChange={handleShortcutNameChange} />
                        </div>
                    </label>
                    <label for={`splunk-searchmode-${args.shortcut.Id}`}>
                        <span className="text-sm text-gray-500">Search Mode</span>
                        <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                            <select id={`splunk-searchmode-${args.shortcut.Id}`}
                                className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                value={mode}
                                onChange={handleModeChange}>
                                <option value="Verbose">Verbose</option>
                                <option value="Smart">Smart</option>
                                <option value="Fast">Fast</option>
                            </select>
                        </div>
                    </label>
                    <label for={`shortcut-visible-${args.shortcut.Id}`}>
                        <span className="text-sm text-gray-500">Visible</span>
                        <div className="relative flex">
                            <input id={`shortcut-visible-${args.shortcut.Id}`} type="checkbox" checked={visible} onChange={handleVisibleChange} className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"></input>
                        </div>
                    </label>
                </div>
                <div className="ml-auto flex space-x-3">
                    {dirty &&
                        <label className="text-sm text-orange-500 mt-5">Unsaved changes</label>
                    }
                    <button className={`mt-4 rounded-lg px-4 py-2 text-white ${dirty ? "bg-green-600" : "bg-green-200"}`}
                        onClick={save}>
                        Save Changes
                    </button>
                    <button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
                        onClick={(e) => {args.update(args.shortcut, true)}}>
                        Delete Shortcut
                    </button>
                </div>
            </div>
            <label for={`splunk-query-${args.shortcut.Id}`}>
                <span className="text-sm text-gray-500">Query</span>
                <div className="relative overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                    <textarea type="text" id={`splunk-query-${args.shortcut.Id}`} autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                        className="w-full appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                        placeholder="index=*"
                        value={query}
                        onChange={handleQueryChange} />
                </div>
                <p className="text-slate-600">Supports variables: %cell%, %orgid%</p>
            </label>
        </div>
    );
}

export default SplunkShortcut;