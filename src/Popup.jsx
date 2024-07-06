import React, { useState, useRef, useEffect } from 'react';

const normalizeDomain = (domain) => {
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
        domain = `https://${domain}`;
    }

    return `${domain}/.well-known/okta-organization`;
};

function* getActions(orgInfo) {
    /*
    yield ["Option A", `https://www.example.com/results?search_query=0`, '#007EC5'];
    yield ["Option B", `https://www.example.com/results?search_query=1`, '#66A636'];
    yield ["Option C", `https://www.example.com/results?search_query=2`, '#3B82F6'];
    yield ["Option D", `https://www.example.com/results?search_query=3`, '#3B82F6'];
    */
}

const autoCompleteDomain = (input) => {
    const possibleEndings = ['.okta.com', '.oktapreview.com', '.okta-emea.com'];

    if (input.length > 0) {
        if (!input.includes('.')) {
            return possibleEndings[0]; // default to hint *.okta.com
        } else {
            const lowerInput = input.toLowerCase();
            const userEnding = lowerInput.substring(lowerInput.indexOf('.'));

            for (const ending of possibleEndings) {
                if (ending.startsWith(userEnding)) {
                    return ending.substring(userEnding.length);
                }
            }
        }
    }

    return '';
};

const Popup = () => {
    const [domain, setDomainRaw] = useState(() => {
        const lastDomain = localStorage.getItem('lastDomain') || '';
        return lastDomain.includes('.') ? lastDomain : '';
    });

    const [orgInfo, setOrgInfo] = useState(null);
    const [error, setError] = useState(null);
    const [hint, setHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [showRaw, setShowRaw] = useState(false);
    const [actions, setActions] = useState([]);

    const submitButton = useRef();

    const setDomain = (val) => {
        setDomainRaw(val);
        localStorage.setItem('lastDomain', val);
    }

    const handleInputChange = (e) => {
        let cleanValue = e.target.value.replace(" ", "");
        setDomain(cleanValue);
        setHint(autoCompleteDomain(cleanValue));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitButton.current.click();
        } else if (e.key === 'Tab') {
            e.preventDefault();

            setDomain(domain + hint);
            setHint('')
        }
    };

    const fetchJSON = async () => {
        if (!domain) return;

        setLoading(true);

        // We force the hint when they submit.
        const normalizedDomain = normalizeDomain(domain + hint);
        setDomain(domain + hint);
        setHint('');

        try {
            const response = await fetch(normalizedDomain);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            const data = await response.json();
            setOrgInfo(data);
            setActions([...getActions(data)]);
            setError(null);
        } catch (err) {
            setError(`Error: ${err.message}`);
            setOrgInfo(null);
            setActions([]);
        }

        setLoading(false);
    };

    // Quickly load the domain if it's already populated.
    useEffect(() => {
        if (domain) {
            fetchJSON();
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <div className="mx-auto max-w-screen-xl">
                    <div className="py-2 bg-blue-400">
                        <p className="text-center text-white">
                            <span className="text-lg font-medium select-none">OkPal </span>
                            <span>v{chrome.runtime.getManifest().version}</span>
                        </p>
                    </div>
                    <div className="mx-auto max-w-lg px-4">
                        <div className="mb-0 space-y-4 pt-4">
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-gray-400 p-4 pe-12 text-sm"
                                        placeholder="Enter domain"
                                        tabIndex="0"
                                        autoFocus={true}
                                        value={domain}
                                        onFocus={(e) => e.target.select()}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                    />
                                    {hint && (
                                        <label className="absolute top-0 left-0 px-4 py-4 text-sm pointer-events-none whitespace-nowrap" style={{ top:"1px", left:"1px" }}>
                                            <span style={{ color: 'transparent' }}>{domain}</span>
                                            <span style={{ color: 'gray' }}>{hint}</span>
                                            <span style={{ opacity: '0.7', display: 'none' }} className="ml-12">Press <span className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700">TAB</span> to autocomplete</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="block w-full rounded-lg bg-blue-400 px-5 py-3 text-sm font-medium text-white"
                                onClick={fetchJSON}
                                ref={submitButton}
                                disabled={loading}
                            >
                                {loading ? ("Loading...") : ("Get Info")}
                            </button>
                        </div>

                        {error && (
                            <div className="mb-0 mt-6 space-y-4">
                                <p className="text-red-500">{error}</p>
                            </div>
                        )}

                        {orgInfo && (
                            <div>
                                <div className="mb-0 mt-6 space-y-4">
                                    <div class="grid grid-cols-2 gap-4">
                                        {actions && actions.map((action, index) => (
                                            <a key={index} href={action[1]} target="_blank" style={{ backgroundColor: action[2] }} className="text-center block w-full rounded-lg px-5 py-3 text-sm font-medium text-white">{action[0]}</a>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-0 mt-6 space-y-4">
                                    {!showRaw ?
                                        (<div className="flow-root">
                                            <dl className="-my-3 divide-y divide-gray-100 text-sm">
                                                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                    <dt className="font-medium text-gray-900">OrgID</dt>
                                                    <dd className="text-gray-700 sm:col-span-2">
                                                        <label>{orgInfo.id}</label>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(orgInfo.id)}
                                                            className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700 float-right">Copy</button>
                                                    </dd>
                                                </div>

                                                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                    <dt className="font-medium text-gray-900">OrgType</dt>
                                                    <dd className="text-gray-700 sm:col-span-2">
                                                        <label>{orgInfo.pipeline === 'idx' ? 'OIE' : 'Classic'}</label>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(orgInfo.pipeline === 'idx' ? 'OIE' : 'Classic')}
                                                            className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700 float-right">Copy</button>
                                                    </dd>
                                                </div>

                                                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                    <dt className="font-medium text-gray-900">OrgCell</dt>
                                                    <dd className="text-gray-700 sm:col-span-2">
                                                        <label>{orgInfo.cell.toUpperCase()}</label>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(orgInfo.cell.toUpperCase())}
                                                            className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700 float-right">Copy</button>
                                                    </dd>
                                                </div>

                                                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                    <dt className="font-medium text-gray-900">Okta URL</dt>
                                                    <dd className="text-gray-700 sm:col-span-2">
                                                        <a href={orgInfo._links.organization.href} rel="noreferrer" target="_blank">{orgInfo._links.organization.href}</a>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(orgInfo._links.organization.href)}
                                                            className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700 float-right">Copy</button>
                                                    </dd>
                                                </div>

                                                {orgInfo._links.alternate && (
                                                    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                        <dt className="font-medium text-gray-900">Custom URL</dt>
                                                        <dd className="text-gray-700 sm:col-span-2">
                                                            <a href={orgInfo._links.alternate.href} rel="noreferrer" target="_blank">{orgInfo._links.alternate.href}</a>
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(orgInfo._links.alternate.href)}
                                                                className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700 float-right">Copy</button>
                                                        </dd>
                                                    </div>
                                                )}

                                                {orgInfo.alternates && orgInfo.alternates.map((alternate, index) => (
                                                    <div key={index} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                                        <dt className="font-medium text-gray-900">Custom URL</dt>
                                                        <dd className="text-gray-700 sm:col-span-2">
                                                            <a href={alternate.href} rel="noreferrer" target="_blank">{alternate.href}</a>
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(alternate.href)}
                                                                className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700 float-right">Copy</button>
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </div>) :
                                        (<div>
                                            <pre style={{ overflowX: 'auto' }}>{JSON.stringify(orgInfo, null, 2)}</pre>
                                        </div>)}
                                </div>
                                <div className="inline-flex items-center mb-6">
                                    <label className="inline-flex items-center cursor-pointer mt-6">
                                        <input
                                            type="checkbox"
                                            value=""
                                            className="sr-only peer"
                                            onChange={(e) => { setShowRaw(e.target.checked) }}
                                            checked={showRaw}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ms-3 text-sm font-medium">Show Raw</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Popup;