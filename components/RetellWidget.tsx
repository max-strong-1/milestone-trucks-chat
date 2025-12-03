'use client';

import React, { useEffect, useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

const agentId = 'agent_2034688a89f57be5fc28e263f1';

interface RetellWidgetProps { }

const RetellWidget: React.FC<RetellWidgetProps> = () => {
    const [isCalling, setIsCalling] = useState(false);
    const [retellWebClient, setRetellWebClient] = useState<RetellWebClient | null>(null);
    const [currentCallId, setCurrentCallId] = useState<string | null>(null);

    useEffect(() => {
        const client = new RetellWebClient();
        setRetellWebClient(client);

        client.on('call_started', () => {
            console.log('Call started');
            setIsCalling(true);
        });

        client.on('call_ended', () => {
            console.log('Call ended');
            setIsCalling(false);
            setCurrentCallId(null);
        });

        client.on('error', (error) => {
            console.error('Retell error:', error);
            setIsCalling(false);
            setCurrentCallId(null);
        });

        return () => {
            client.stopCall();
        };
    }, []);

    // Polling for commands
    useEffect(() => {
        if (!isCalling || !currentCallId) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/retell/commands?call_id=${currentCallId}`);
                const data = await response.json();

                if (data.commands && data.commands.length > 0) {
                    data.commands.forEach((cmd: any) => {
                        console.log('Executing command:', cmd);
                        switch (cmd.type) {
                            case 'NAVIGATE':
                                window.location.href = cmd.payload; // Simple navigation
                                break;
                            case 'PREFILL_FORM':
                                console.log('Pre-filling form with:', cmd.payload);
                                // In a real app, you'd dispatch this to a form context or store
                                alert(`[DEMO] Pre-filling form: ${JSON.stringify(cmd.payload)}`);
                                break;
                            case 'UPDATE_CART':
                                console.log('Updating cart:', cmd.payload);
                                // In a real app, you'd dispatch this to a cart context
                                alert(`[DEMO] Cart updated: ${JSON.stringify(cmd.payload)}`);
                                break;
                        }
                    });
                }
            } catch (error) {
                console.error('Error polling commands:', error);
            }
        }, 1000); // Poll every second

        return () => clearInterval(interval);
    }, [isCalling, currentCallId]);

    const startCall = async () => {
        console.log('Start Call clicked');
        if (!retellWebClient) {
            console.error('Retell client not initialized');
            return;
        }

        try {
            console.log('Fetching access token...');
            // 1. Get Access Token from your backend
            // Use absolute URL for the widget since it runs on a different domain
            const apiUrl = 'https://milestone-trucks-chat.vercel.app/api/retell/register-call';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ agent_id: agentId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to get access token:', response.status, errorText);
                throw new Error(`Failed to get access token: ${response.status}`);
            }

            const data = await response.json();
            console.log('Access token received:', data);

            if (data.call_id) {
                setCurrentCallId(data.call_id);
            }

            // 2. Start the call
            console.log('Starting call with Retell SDK...');
            await retellWebClient.startCall({
                accessToken: data.access_token,
            });
            console.log('Call started successfully');
        } catch (error) {
            console.error('Failed to start call:', error);
            alert('Failed to start call. Check console for details.');
        }
    };

    const stopCall = () => {
        if (retellWebClient) {
            retellWebClient.stopCall();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[9999]">
            {!isCalling ? (
                <button
                    onClick={startCall}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                    </svg>
                    Talk to Us
                </button>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-green-600 font-semibold animate-pulse">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        Live Call Active
                    </div>
                    <button
                        onClick={stopCall}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-colors w-full"
                    >
                        End Call
                    </button>
                </div>
            )}
        </div>
    );
};

export default RetellWidget;
