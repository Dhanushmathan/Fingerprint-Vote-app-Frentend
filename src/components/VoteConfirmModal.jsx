import React from 'react'
import { useState } from 'react';
import { colorMap, initials } from '../utils/helpers';
import { useEffect } from 'react';
import FingerprintScanner from './FingerprintScanner';

const VoteConfirmModal = ({ candidate, voterId, sessionToken, onConfirm, onClose, loading }) => {

  const [fpState, setFpState] = useState('scanning');//auto-start
  const col = colorMap[candidate?.partyColorTheme] || colorMap.sw1;

  useEffect(() => {
    if (fpState === 'scanning') {
      const t = setTimeout(() => { setFpState('success') }, 2800);
      return () => clearTimeout(t);
    }
    if (fpState === 'success') {
      const t = setTimeout(() => onConfirm('SCAN_DONE'), 800);
      return () => clearTimeout(t);
    }
  }, [fpState]);

  return (
    <div className='fixed inset-0 bg-indigo-950/55 z-50 flex items-center justify-center p-4' onClick={onClose}>
      <div className='bg-white rounded-3xl p-10 w-full max-w-sm text-center animate-pop-in' onClick={e => e.stopPropagation()}>
        <button className='absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200
                     flex items-center justify-center text-gray-400 text-sm transition-colors' onClick={onclose}>
          ✕</button>

        <FingerprintScanner state={fpState} size='md' />

        <h3 className="font-display text-xl font-black text-gray-900 mt-4 mb-2">
          {fpState === 'scanning' ? 'Scanning Fingerprint...' :
            fpState === 'success' ? '✓ Fingerprint Matched!' :
              'Confirm Your Vote'}
        </h3>
        <p className='text-xs text-gray-400 mb-5 leading-relaxed'>
          {fpState === 'scanning'
            ? 'Hold your finger steady on the scanner.'
            : fpState === 'success'
              ? 'Recording your vote on the blockchain...'
              : 'Place your finger to finalize this vote.'}
        </p>

        {
          candidate && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3.5 flex items-center gap-3 text-left mb-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-sm shrink-0"
                style={{ background: col.bg, color: col.tc }}>
                {initials(candidate.name)}
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">{candidate.name}</p>
                <p className="text-xs text-gray-400">{candidate.partySymbol} {candidate.partyName}</p>
              </div>
            </div>
          )
        }

        {
          fpState === 'idle' && (
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn-primary" onClick={() => setFpState('scanning')}>
                🫆 Scan Finger
              </button>
            </div>
          )
        }

        {
          (fpState === 'scanning' || fpState === 'success' || loading) && (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:.3s]" />
            </div>
          )}
      </div>
    </div>
  )
}

export default VoteConfirmModal;