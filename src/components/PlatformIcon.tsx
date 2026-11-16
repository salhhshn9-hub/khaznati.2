import React from 'react';
import {
  Building2,
  CreditCard,
  Gamepad2,
  Globe,
  Mail,
  Music,
  Play,
  Shield,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { getPresetByKey } from '../utils/vaultHelpers';
import { RecordType } from '../types/vault';

interface PlatformIconProps {
  platformKey: string;
  recordType: RecordType;
  size?: 'sm' | 'md' | 'lg';
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  platformKey,
  recordType,
  size = 'md',
}) => {
  const preset = getPresetByKey(platformKey);

  const dims =
    size === 'sm'
      ? 'w-8 h-8 text-xs'
      : size === 'lg'
        ? 'w-12 h-12 text-sm'
        : 'w-10 h-10 text-xs';

  const renderGlyph = () => {
    switch (platformKey) {
      case 'gmail':
      case 'outlook':
      case 'icloud':
      case 'yahoo':
      case 'proton':
        return <Mail className="w-4 h-4" />;
      case 'youtube':
      case 'netflix':
        return <Play className="w-4 h-4" />;
      case 'spotify':
        return <Music className="w-4 h-4" />;
      case 'steam':
      case 'playstation':
      case 'discord':
        return <Gamepad2 className="w-4 h-4" />;
      case 'amazon':
        return <ShoppingBag className="w-4 h-4" />;
      case 'bank':
        return <CreditCard className="w-4 h-4" />;
      case 'absher':
        return <Building2 className="w-4 h-4" />;
      case 'apple':
      case 'github':
        return <Shield className="w-4 h-4" />;
      case 'custom':
        return recordType === 'email' ? (
          <Mail className="w-4 h-4" />
        ) : (
          <Globe className="w-4 h-4" />
        );
      default:
        return (
          <span className="font-mono font-semibold tracking-tight">
            {preset.shortCode}
          </span>
        );
    }
  };

  // Use clean subtle tinted surface + crisp border without flashy gradients
  return (
    <div
      className={`${dims} rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0 font-medium`}
      style={{ color: preset.accentHex }}
      aria-hidden="true"
    >
      {platformKey === 'instagram' ||
      platformKey === 'facebook' ||
      platformKey === 'x' ||
      platformKey === 'tiktok' ||
      platformKey === 'snapchat' ||
      platformKey === 'linkedin' ? (
        <span className="font-mono font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {preset.shortCode}
        </span>
      ) : (
        renderGlyph()
      )}
    </div>
  );
};

// Keep Sparkles unused import warning away if not needed
void Sparkles;
