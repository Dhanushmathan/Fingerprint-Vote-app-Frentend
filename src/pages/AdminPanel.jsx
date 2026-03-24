import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { voteAPI, voterAPI } from '../services/api';
import Toogle from '../components/Toggle';
import Toggle from '../components/Toggle';

const AdminPanel = () => {

  const { data: voters = [] } = useQuery({
    queryKey: ['voters'],
    queryFn: () => voterAPI.getAll().then(r => r.data),
    refetchInterval: 8_000,
  });

  const { data: results } = useQuery({
    queryKey: ['results'],
    queryFn: () => voteAPI.getResults().then(r => r.data),
    refetchInterval: 8_000,
  });

  const voted = voters.filter(v => v.hasVoted).length;
  const pending = voters.length - voted;
  const blocked = results?.blockedAttempts || 0;

  const stats = [
    { label: 'Registered Voters', value: voters.length, color: 'text-blue-500' },
    { label: 'Votes Cast', value: voted, color: 'text-green-500' },
    { label: 'Pending', value: pending, color: 'text-amber-500' },
    { label: 'Flagged Attempts', value: blocked, color: 'text-red-500' },
  ];

  useEffect(() => {
    voters;
    results;
  }, [voters, results]);

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-900'>Admin Panel</h2>
      <p className='text-sm text-gray-400 mt-1 mb-7'>Election management and voter activity log</p>

      <div className='flex flex-col gap-1.5'>
        {
          stats.map(s => (
            <div key={s.label} className='card'>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className='text-xs text-gray-400 mt-1'>{s.label}</p>
            </div>
          ))
        }
      </div>

      <div className='grid grid-cols-[1fr_300px] gap-6'>
        <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
          <div className='grid grid-cols-[28px_1fr_140px_100px_100px] px-5 py-3
                          bg-blue-50 border-b border-purple-100
                          text-[12px] font-extrabold text-gray-500 uppercase tracking-widest'>
            <div />
            <div>Voter ID</div>
            <div>Auth Method</div>
            <div>Time</div>
            <div>Status</div>
          </div>

          {
            voters.length === 0 ? (<div className='text-center py-12 text-sm text-gray-400'>No voter activity yet</div>)
              : (
                voters
                  .slice()
                  .sort((a, b) => (b.votedAt || '').localeCompare(a.votedAt || ''))
                  .map(v => (
                    <div key={v.id} className='grid grid-cols-[28px_1fr_140px_100px_100px] px-5 py-3.5
                             border-b border-purple-50 last:border-0 items-center
                             hover:bg-blue-50/40 transition-colors'>
                      <div className={`w-2 h-2 rounded-full ${v.hasVoted ? 'bg-green-500' : 'bg-amber-400'
                        }`} />
                      <div>
                        <p className='text-sm font-medium text-gray-900'>{v.voterId}</p>
                        <p className='text-xs text-gray-400'>
                          {v.hasVoted ? `Voted for ${v.votedForCandidateName}` : 'Not yet voted'}
                        </p>
                      </div>
                      <div>
                        <span className={`badge text-[10px] ${v.fingerprintEnrolled
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-red-100 text-red-600'}`}>{v.fingerprintEnrolled ? '🫆 Enrolled' : '⚠️ No FP'}</span>
                      </div>
                      <div className='text-xs text-gray-400'>
                        {v.votedAt ? new Date(v.votedAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit', minute: '2-digit', second: '2-digit'
                        }) : '—'}
                      </div>
                      <div>
                        {
                          v.hasVoted ?
                            <span className='badge bg-green-100 text-green-700 text-[10px]'>Voted</span> :
                            <span className='badge bg-amber-100 text-amber-700 text-[10px]'>Pending</span>
                        }
                      </div>
                    </div>
                  ))
              )
          }
        </div>

        {/* Controlers */}
        <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
          <div className='px-5 py-3 bg-blue-50 border-b border-purple-100'>
            <p className='text-[12px] font-extrabold text-gray-500 uppercase tracking-widest'>Election Controls</p>
          </div>
          <Toggle label="Voting Open" sub="Allow voters to cast votes" defaultOn={true} />
          <Toggle label="Fingerprint Auth" sub="Require biometric scan" defaultOn={true} />
          <Toggle label="OTP Verification" sub="Require mobile OTP" defaultOn={true} />
          <Toggle label="Public Results" sub="Show live results publicly" defaultOn={true} />
          <Toggle label="Duplicate Detection" sub="Block repeat fingerprints" defaultOn={true} />
        </div>
      </div>
    </div>
  )
}

export default AdminPanel;