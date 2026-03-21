import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react'
import { partyAPI } from '../services/api';
import toast from 'react-hot-toast';
import { colorMap, swatchColor } from '../utils/helpers';

const PartyRegistration = () => {

  const emptyForm = {
    name: '', name: '', leaderName: '', symbol: '🏛️',
    colorTheme: 'sw1', manifesto: '', foundedYear: '',
  }
  const emptyCand = { name: '', age: '', qualifications: '' }

  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [cand, setCand] = useState(emptyCand);
  const [pendingCands, setPendingCands] = useState([]);

  const { data: partiesRes, isLoading } = useQuery({
    queryKey: ['parties'],
    queryFn: () => partyAPI.getAll().then(r => r.data),
  });
  const parties = partiesRes || [];

  const registerMutation = useMutation({
    mutationFn: (data) => partyAPI.register(data),
    onSuccess: () => {
      toast.success("Party registered successfully!");
      qc.invalidateQueries(['parties']);
      setForm(emptyForm);
      setPendingCands([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => partyAPI.delete(id),
    onSuccess: () => {
      toast.success("Party removed.");
      qc.invalidateQueries(['parties']);
    },
  });

  const addCand = () => {
    if (!cand.name.trim()) { toast.error('Enter candidate name'); return }
    setPendingCands(p => [...p, { ...cand, id: Date.now() }]);
    setCand(emptyCand);
  };

  const handleRegister = () => {
    if (!form.name.trim() || !form.leaderName.trim()) {
      toast.error('Party name and leader are required');
      return
    }

    // Check if there's an unflushed candidate in the cand form
    const allCands = cand.name.trim() ? [...pendingCands, { ...cand }] : pendingCands;

    if (!allCands.length) { toast.error('Add at least one candidate'); return }

    registerMutation.mutate({
      ...form,
      foundedYear: form.foundedYear ? parseInt(form.foundedYear) : null,
      candidates: allCands.map(c => ({
        name: c.name,
        age: c.age ? parseInt(c.age) : null,
        qualifications: c.qualifications || null,
        ward: 'Ward 7',
      })),
    })
  };

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-900'>Party &amp; Candidate Registration</h2>
      <p className='text-sm text-gray-400 mt-1 mb-7'>Register new political parties and their candidates.</p>

      <div className='grid grid-cols-[1fr_380px] gap-6 items-start'>

        {/* Left: Registered parties */}
        <div>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-base font-semibold text-gray-900'>Registered Parties</h3>
            <span className='badge bg-green-100 text-green-700'>
              {parties.length} {parties.length === 1 ? 'Party' : 'Parties'}
            </span>
          </div>

          {
            isLoading ? (
              <div className='card flex items-center justify-center h-40 text-gray-400'>Loading...</div>
            ) : parties.length === 0 ? (
              <div className="card text-center py-14">
                <div className="text-4xl mb-3">🏛️</div>
                <p className="font-semibold text-gray-600 mb-1">No parties registered yet</p>
                <p className="text-sm text-gray-400">Use the form on the right to register.</p>
              </div>
            ) : (
              <div className='flex flex-col gap-3'>
                {
                  Array.isArray(parties) && parties.map(party => {
                    const col = colorMap[party.colorTheme] || colorMap.sw1;
                    return (
                      <div key={party.id} className='bg-white border-[1.5px] border-purple-100 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden hover:shadow-sm transition-shadow'>
                        <div className='absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-blue-500' />
                        <div className='w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0' style={{ background: col.bg }}>{party.symbol}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='font-bold text-[15px] text-gray-900'>{party.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Leader: {party.leaderName} · Est. {party.foundedYear || '—'}</p>
                          <div className='flex gap-2 mt-2 flex-wrap'>
                            <span className="badge bg-green-100 text-green-700">
                              {party.candidates?.length || 0} candidate{party.candidates?.length !== 1 ? 's' : ''}
                            </span>
                            <span className="badge bg-purple-100 text-purple-700">
                              {party.totalVotes || 0} votes
                            </span>
                            {
                              <span className='tag'>{party.manifesto}</span>
                            }
                          </div>
                          <p className='text-xs text-gray-400 mt-1.5'>{party.candidates?.map(c => c.name).join(", ")}</p>
                        </div>
                        <button className='btn-danger shrink-0' onClick={() => { if (window.confirm("Remove this party?")) deleteMutation.mutate(party.id) }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )
                  })}
              </div>
            )}
        </div>

        {/* Right: Registration form */}
        <div>
          <div className='card mb-4'>
            <h3 className='text-xl font-bold text-gray-900 mb-1'>
              Register New Party
            </h3>
            <p className='text-xs text-gray-400 mb-5 leading-relaxed'>Fill party details and add candidates.</p>

            <div className='space-y-3'>
              <div>
                <label className="label">Party Name <span className="text-red-500">*</span></label>
                <input className="input" placeholder="e.g. Progressive Alliance" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className="label">Party Leader <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="Leader name" value={form.leaderName} onChange={e => setForm(f => ({ ...f, leaderName: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Founded Year</label>
                  <input className="input" type="number" placeholder="2024" min="1900" max="2025" value={form.foundedYear} onChange={e => setForm(f => ({ ...f, foundedYear: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Party Symbol (Emoji)</label>
                <input className="input text-center text-2xl" maxLength={2} placeholder="🌟" value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))} />
              </div>
              <div>
                <label className="label">Color Theme</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {
                    swatchColor.map(sw => (
                      <div key={sw} onClick={() => setForm(f => ({ ...f, colorTheme: sw }))}
                        className={`w-7 h-7 rounded-lg cursor-pointer transition-all duration-200 border-2
                        ${form.colorTheme === sw ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'}`}
                        style={{ background: colorMap[sw].bg }} />
                    ))
                  }
                </div>
              </div>
              <div>
                <label className="label">Manifesto / Key Issues</label>
                <input className="input" placeholder="e.g. Infrastructure, Education" value={form.manifesto} onChange={e => setForm(f => ({ ...f, manifesto: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* Candidate Form */}
          <div className='card mb-4'>
            <h3 className='text-sm font-black text-gray-900 mb-1'>Add Candidate</h3>
            <p className='text-xs text-gray-400 mb-5 leading-relaxed'>Add the candidate for this party in Ward 7.</p>

            <div className='grid grid-cols-2 gap-3 mb-3'>
              <div>
                <label className="label">Full Name <span className='text-red-500'>*</span></label>
                <input className="input" placeholder="Candidate name" value={cand.name} onChange={e => setCand(c => ({ ...c, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addCand()} />
              </div>
              <div>
                <label className="label">Age</label>
                <input className="input" type="number" placeholder="35" min="25" max="80" value={cand.age} onChange={e => setCand(c => ({ ...c, age: e.target.value }))} />
              </div>
            </div>
            <div className="mb-4">
              <label className="label">Qualifications</label>
              <input className="input" placeholder="e.g. B.Tech, MBA" value={cand.qualifications} onChange={e => setCand(c => ({ ...c, qualifications: e.target.value }))} />
            </div>

            {
              pendingCands.length > 0 && (
                <div className='space-y-2 mb-4'>
                  <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Pending</p>
                  {pendingCands.map((pc, i) => (
                    <div key={pc.id} className='flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2'>
                      <CheckCircle2 size={14} className='text-blue-500 shrink-0' />
                      <span className='text-xs font-semibold text-gray-700 flex-1'>{pc.name}</span>
                      <span className='text-xs text-gray-400'>Age {pc.age || '—'} · {pc.qualifications || '—'}</span>
                      <button onClick={() => setPendingCands(p => p.filter((_, idx) => idx !== i))} className='text-red-400 hover:text-red-600 text-xs font-bold ml-1'>✕</button>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
          <div className='flex '>
            <button className="btn-outline w-full mr-2" onClick={addCand}>
              <PlusCircle size={14} /> Add Candidate
            </button>

            <button
              className="btn-success w-full"
              onClick={handleRegister}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Registering...' : '✓ Register Party'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartyRegistration;