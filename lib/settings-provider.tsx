"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type SettingsProps = {
    backgroundAnimation: "particles" | "starfield" | "none",
    outputQuality: "27" | "7" | "6" | "5",
    outputCodec: "FLAC" | "WAV" | "ALAC" | "MP3" | "AAC" | "OPUS",
    bitrate: number | undefined,
    applyMetadata: boolean,
    fixMD5: boolean,
    explicitContent: boolean,
    albumArtSize: number,
    albumArtQuality: number
}

const isValidSettings = (obj: any): obj is SettingsProps => {
    return (
        ['particles', 'starfield', 'none'].includes(obj.backgroundAnimation) &&
        ['27', '7', '6', '5'].includes(obj.outputQuality) &&
        ['FLAC', 'WAV', 'ALAC', 'MP3', 'AAC', 'OPUS'].includes(obj.outputCodec) &&
        ((typeof obj.bitrate === 'number' && obj.bitrate >= 24 && obj.bitrate <= 320) || obj.bitrate === undefined) &&
        typeof obj.applyMetadata === 'boolean' &&
        typeof obj.explicitContent === 'boolean' && 
        typeof obj.fixMD5 === 'boolean' &&
        typeof obj.albumArtSize === 'number' && 
        obj.albumArtSize >= 100 && obj.albumArtSize <= 3600 &&
        typeof obj.albumArtQuality === 'number' && 
        obj.albumArtQuality >= 0.1 && obj.albumArtQuality <= 1
    );
};

const SettingsContext = createContext<{
    settings: SettingsProps;
    setSettings: React.Dispatch<React.SetStateAction<SettingsProps>>;
} | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SettingsProps>( {
        backgroundAnimation: "particles",
        outputQuality: "27",
        outputCodec: "FLAC",
        bitrate: 320,
        applyMetadata: true,
        fixMD5: false,
        explicitContent: true,
        albumArtSize: 3600,
        albumArtQuality: 1
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings && isValidSettings(JSON.parse(savedSettings))) {
            setSettings(JSON.parse(savedSettings));
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify(settings));
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    
    return context;
};