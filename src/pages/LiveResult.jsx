import { useQuery } from '@tanstack/react-query';
import React, { lazy } from 'react'
import { voteAPI } from '../services/api';
import { Clock, Icon, Shield, TrendingUp, Users } from 'lucide-react';
import { colorMap, initials } from '../utils/helpers';
import AnimatedBar from '../components/AnimatedBar';

const LiveResult = () => {

  const rankIcon = ['🥇', '🥈', '🥉'];
  const rankBg = [
    'bg-amber-50 border-amber-200 text-amber-700',
    'bg-gray-100 border-gray-200 text-gray-600',
    'bg-orange-50 border-orange-200 text-orange-700',
  ];

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['results'],
    queryFn: () => voteAPI.getResults().then(r => r.data),
    refetchInterval: 10_000,
  });

  const result = data || {};
  const rankings = result.rankings || [];
  const total = result.totalVotes || 0;

  return (
    <div>
      <div className='flex items-center justify-between mb-7'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>Live Results</h2>
          <p className='text-sm text-gray-400 mt-1'>Real-time vote count · Auto-refreshes every 10s</p>
        </div>
        <div className='flex items-center gap-2 badge bg-red-100 text-red-600 px-3 py-1.5'>
          <span className='w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-slow' /> Live
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4 mb-7'>
        {[
          { icon: TrendingUp, label: 'Total Votes', value: total, color: 'text-blue-500' },
          { icon: Users, label: 'Voter Turnout', value: `${result.turnoutPercentage || 0}%`, color: 'text-blue-500' },
          { icon: Users, label: 'Parties', value: result.totalParties || 0, color: 'text-blue-500' },
          { icon: Shield, label: 'Blocked', value: result.blockedAttempts || 0, color: 'text-red-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div className='card' key={label}>
            <p className={`font-display text-2xl font-black ${color}`}>{value}</p>
            <p className='text-xs text-gray-400 mt-1'>{label}</p>
          </div>
        ))}
      </div>

      {
        isLoading ? (
          <div className='card flex items-center justify-center h-48 text-gray-400'>
            Loading results...
          </div>
        ) : rankings.length === 0 ? (
          <div className='card text-center py-14'>
            <div className='text-4xl mb-3'>
              📊
            </div>
            <p className='font-semibold text-gray-600 mb-1'>No votes yet</p>
            <p className='text-sm text-gray-400'>Results will appear here once votes are cast.</p>
          </div>
        ) : (
          <div className='grid grid-cols-[2fr_1fr] gap-6'>
            <div className='flex flex-col gap-3'>
              {rankings.map((c, i) => {
                const col = colorMap[c.partyColorTheme] || colorMap.sw1;
                // const pct = total > 0 ? parseFloat(((c.voteCount / total) * 100).toFixed(1)) : 0;
                const rawPct = c.votePercentage != null ? c.votePercentage : total > 0 ? parseFloat(((c.voteCount / total) * 100).toFixed(1)) : 0;
                const pct = Math.min(rawPct, 100);

                return (
                  <div key={c.id} className='card hover:shadow-sm transition-shadow'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className={`w-8 h-8 rounded-xl border text-[13px] font-black flex items-center justify-center shrink-0 ${rankBg[i] || 'bg-primary-50 border-primary-200 text-primary-600'}`}>
                        {rankIcon[i] || i + 1}
                      </div>
                      <div className='w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0' style={{ background: col.bg, color: col.tc }}>
                        {initials(c.name)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <span className='font-semibold text-[15px] text-gray-900'>{c.name}</span>
                          {i === 0 && total > 0 && (
                            <span className='badge bg-green-100 text-green-700 text-[10px]'>Leading</span>
                          )}
                        </div>
                        <p className='text-xs text-gray-400'>
                          {c.partySymbol} {c.partyName} · {c.voteCount} vote{c.voteCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className='text-xl font-extrabold text-gray-900 shrink-0'>{pct}%</span>
                    </div>
                    <AnimatedBar pct={pct} gold={i === 0} />
                  </div>
                )
              })}
            </div>

            <div className='flex flex-col gap-4'>
              <div className='card'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2 badge bg-red-100 text-red-600'>
                    <span className='w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-slow' /> Live
                  </div>
                  <span className='text-xs font-extrabold text-gray-800'>Quick View</span>
                </div>
                <div className='flex flex-col gap-2.5'>
                  {
                    rankings.map(c => {
                      const rawPct = c.votePercentage != null ? c.votePercentage : total > 0 ? parseFloat(((c.voteCount / total) * 100).toFixed(1)) : 0;
                      const pct = Math.min(rawPct, 100);
                      return (
                        <div key={c.id} className='flex items-center gap-2'>
                          <span className='text-xs font-semibold text-gray-500 w-14 shrink-0 truncate'>
                            {c.name.split(' ')[0]}
                          </span>
                          <div className='flex-1 h-1.5 bg-blue-100 rounded-full overflow-hidden'>
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                              style={{ width: pct + '%' }} />
                          </div>
                          <span className='text-xs font-bold text-gray-800 w-9 text-right shrink-0'>{pct} %</span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>

              <div className='card'>
                <p className='text-sm font-extrabold text-gray-800 mb-4'>Biometric Security</p>
                <div className='grid grid-cols-2 gap-2.5'>
                  {[
                    { label: 'FP Verified', value: total, bg: 'bg-blue-50', tc: 'text-blue-500' },
                    { label: 'Duplicates', value: result.blockedAttempts || 0, bg: 'bg-green-50', tc: 'text-green-600' },
                    { label: 'Blocked', value: result.blockedAttempts || 0, bg: 'bg-red-50', tc: 'text-red-500' },
                  ].map(({ label, value, bg, tc }) => (
                    <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                      <p className={`font-display text-lg font-black ${tc}`}>{value}</p>
                      <p className='text-[10px] text-gray-400 mt-0.5'>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='card flex items-center gap-3'>
                <Clock size={20} className='text-amber-500 shrink-0' />
                <div className=''>
                  <p className='text-sm font-extrabold text-gray-900'>4h 28m remaining</p>
                  <p className='text-xs text-gray-400'>Closes at 18:00 · Apr 19</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default LiveResult;