import React from 'react'
import { formatDateTime } from '../utils/helpers';

const SuccessOverlay = ({ data, onGoResults }) => {

  return (
    <div className='fixed inset-0 bg-white z-200 flex items-center justify-center p-6 animate-pop-in'>
      <div className='text-center max-w-md w-full'>
        <div className='w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center
                        text-5xl mx-auto mb-6 animate-pop-in'>
          ✅
        </div>
        <h1 className='text-3xl font-black text-gray-900 mb-3'>Vote Successfully Cast!</h1>
        <p className='text-sm text-gray-500 leading-relaxed mb-7'>
          Your vote has been cryptographically signed with your biometric data and
          permanently recorded on the secure blockchain ledger.
          Thank you for participating in democracy!
        </p>

        <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl p-5 mb-7 text-left space-y-2.5">
          {[
            ['Voter ID', data.voterId || '—'],
            ['Voted For', data.candidateName || '—'],
            ['Party', data.partyName || '—'],
            ['Auth Method', '🫆 Fingerprint + OTP'],
            ['Timestamp', formatDateTime(data.castedAt)],
            ['Tx Hash', data.txHash || '—'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs border-b border-purple-100 pb-2 last:border-0 last:pb-0">
              <span className="text-gray-400">{k}</span>
              <span className={`font-bold max-w-[60%] text-right break-all
                        ${k === 'Tx Hash' ? 'text-blue-500 text-[10px]' : 'text-gray-900'}`}>{v}</span>
            </div>
          ))}
        </div>

        <button className="btn-success w-full" onClick={onGoResults}>
          View Live Results →
        </button>
      </div>
    </div>
  )
}

export default SuccessOverlay;