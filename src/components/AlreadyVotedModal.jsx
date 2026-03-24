import { formatDateTime } from "../utils/helpers";

const AlreadyVotedModal = ({ data, onClose }) => {

  if (!data) return null;
  
  return (
    <div className="fixed inset-0 bg-indigo-950/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-9 w-full max-w-md border-t-4 border-red-500 animate-pop-in" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-4 text-center">🚫</div>
        <h2 className="text-xl font-black text-red-600 text-center mb-2">Vote Already Cast!</h2>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-5"> You have already voted in this election. Each voter is allowed
          only <strong>one vote</strong>. Your fingerprint is permanently linked to your ballot.</p>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 space-y-2">
          {[
            ['Voter ID', data.voterId],
            ['Voted For', data.votedForCandidate],
            ['Party', data.votedForParty],
            ['Time', formatDateTime(data.votedAt)],
            ['Auth', '🫆 Fingerprint + OTP'],
            ['Status', '✓ Recorded on Blockchain'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs border-b border-red-100 pb-1.5 last:border-0 last:pb-0">
              <span className="text-gray-400">{k}</span>
              <span className={`font-bold ${k === 'Status' ? 'text-green-600' : 'text-gray-800'}`}>{v}</span>
            </div>
          ))
          }
        </div>

        <button className="btn-outline w-full" onClick={onClose}>I Understand</button>
      </div>
    </div>
  )
}

export default AlreadyVotedModal;