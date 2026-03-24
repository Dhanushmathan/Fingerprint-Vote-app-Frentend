import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { voterAPI } from '../services/api';
import toast from 'react-hot-toast';
import { UserPlus, Users } from 'lucide-react';
import { initials } from '../utils/helpers';
import FingerprintScanner from '../components/FingerprintScanner';

const VoterRegistration = () => {

    const emptyForm = {
        voterId: '',
        fullName: '',
        mobileNumber: '',
        email: '',
        fpHash: '',
        ward: 'Ward 7',
    };

    const qc = useQueryClient();
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [fpState, setFpState] = useState('idle');
    const [fpToken, setFpToken] = useState('');

    const { data: voters = [], isLoading } = useQuery({
        queryKey: ['voters'],
        queryFn: () => voterAPI.getAll().then(res => res.data),
    });

    const registerMut = useMutation({
        mutationFn: (data) => voterAPI.register(data),
        onSuccess: () => {
            toast.success('Voter registered successfully!');
            qc.invalidateQueries(['voters']);
            setForm(emptyForm);
            setErrors({});
            setFpState('idle');
            setFpToken('');
        },
        onError: (err) => {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(msg);
        },
    });

    const validate = () => {
        const e = {};
        if (!form.voterId.trim()) {
            e.voterId = "Voter ID is required";
        } else if (!/^VOT-\d{3,}$/i.test(form.voterId.trim()) && form.voterId.trim().length < 3) {
            e.voterId = 'e.g. VOT-001'
        }

        if (!form.fullName.trim()) {
            e.fullName = 'Full name is required';
        }

        if (!form.mobileNumber.trim()) {
            e.mobileNumber = 'Mobile number is required';
        } else if (!/^[+]?[0-9]{10,13}$/.test(form.mobileNumber.replace(/\s/g, ''))) {
            e.mobileNumber = 'Enter valid mobile number';
        }

        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            e.email = 'Enter valid email';
        }

        if (!fpToken) {
            e.fingerprint = 'Fingerprint scan is required';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    }

    const handleSubmit = () => {
        if (!validate()) return;

        registerMut.mutate({
            ...form,
            mobileNumber: form.mobileNumber.replace(/\s/g, ''),
            fingerprintToken: fpToken,
        });
    };

    const f = (field) => ({
        value: form[field],
        onChange: e => {
            setForm(v => ({ ...v, [field]: e.target.value }))
            if (errors[field]) {
                setErrors(v => ({ ...v, [field]: '' }))
            }
        }
    });

    //Stats
    const voted = voters.filter(v => v.hasVoted).length;
    const pending = voters.length - voted;

    return (
        <div>
            <h2 className='text-xl md:text-2xl font-black text-gray-900'>Voter Registration</h2>
            <p className="text-sm text-gray-400 mt-1 mb-7">
                Register eligible voters for the Municipal Council Election 2026.
            </p>

            {/* Stats row */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7'>
                {[
                    { label: 'Total Registered', value: voters.length, color: 'text-blue-500' },
                    { label: 'Already Voted', value: voted, color: 'text-green-500' },
                    { label: 'Yet to Vote', value: pending, color: 'text-amber-500' },
                ].map(s => (
                    <div className='card' key={s.label}>
                        <p className={`font-display text-3xl font-black ${s.color}`}>{s.value}</p>
                        <p className='text-xs text-gray-400 mt-1'>{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">

                {/* ── Left: Registered voters list ── */}
                <div>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className="font-display text-base font-black text-gray-900">Registered Voters</h3>
                        <span className='badge bg-blue-100 text-blue-600'>
                            <Users size={11} /> {voters.length} voters
                        </span>
                    </div>

                    {
                        isLoading ? (
                            <div className='card flex items-center justify-center h-40 text-gray-400 text-sm'>
                                Loading voters....
                            </div>
                        ) : voters.length === 0 ? (
                            <div className='card text-center py-14'>
                                <div className='text-4xl mb-3'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M5.85 17.1q1.275-.975 2.85-1.537T12 15t3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4T6.337 6.338T4 12q0 1.475.488 2.775T5.85 17.1M12 13q-1.475 0-2.488-1.012T8.5 9.5t1.013-2.488T12 6t2.488 1.013T15.5 9.5t-1.012 2.488T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" /></svg>
                                </div>
                                <p>No voters registered yet</p>
                                <p>Use the form to register eligible voters.</p>
                            </div>
                        ) : (
                            <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
                                <div className="grid grid-cols-[28px_1fr_80px] sm:grid-cols-[36px_1fr_130px_100px] px-3 sm:px-5 py-3
                              bg-blue-50 border-b border-purple-100
                              text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <div />
                                    <div>Voter Details</div>
                                    <div>Mobile</div>
                                    <div>Status</div>
                                </div>

                                {
                                    voters.map(v => (
                                        <div key={v.id} className='grid grid-cols-[28px_1fr_80px] sm:grid-cols-[36px_1fr_130px_100px] px-3 sm:px-5 py-3.5
                             border-b border-purple-50 last:border-0 items-center
                             hover:bg-blue-50/40 transition-colors'>
                                            <div className='w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center
                                  font-display font-black text-[10px] text-blue-600 shrink-0'>
                                                {initials(v.fullName || v.voterId)}
                                            </div>

                                            <div className="min-w-0 pr-3">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {v.fullName}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{v.voterId} · {v.ward}</p>
                                            </div>

                                            <div className='text-xs text-gray-500 truncate'>{v.mobileNumber}</div>

                                            <div>
                                                {v.hasVoted
                                                    ? <span className="badge bg-green-100 text-green-700 text-[10px]">
                                                        <CheckCircle2 size={10} /> Voted
                                                    </span>
                                                    : <span className="badge bg-amber-100 text-amber-700 text-[10px]">
                                                        Pending
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                </div>

                {/* ── Right: Registration form ── */}
                <div className='card'>
                    <div className='flex items-center gap-2 mb-1'>
                        <UserPlus size={16} className='text-blue-500' />
                        <h3 className='text-sm font-black text-gray-900'>Register New Voter</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                        Fill in the voter details. Voter ID and mobile number must be unique.
                    </p>

                    <div className='space-y-4'>
                        <div>
                            <label htmlFor="" className='label'>Voter ID <span className='text-red-500'>*</span></label>
                            <input
                                className={`input ${errors.voterId ? 'border-red-400 focus:border-red-500' : ''}`}
                                placeholder="e.g. VOT-001"
                                {...f('voterId')}
                            />
                            {errors.voterId && (
                                <p className='text-red-500 text-[11px] mt-1'>{errors.voterId}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">Full Name <span>*</span></label>
                            <input
                                className={`input ${errors.fullName ? 'border-red-400 focus:border-red-500' : ''}`}
                                placeholder="e.g. Ravi Kumar"
                                {...f('fullName')}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">Mobile Number <span>*</span></label>
                            <input
                                className={`input ${errors.mobileNumber ? 'border-red-400 focus:border-red-500' : ''}`}
                                placeholder="+91 98765 43210"
                                type="tel"
                                {...f('mobileNumber')}
                            />
                            {errors.mobileNumber && (
                                <p className="text-red-500 text-[11px] mt-1">{errors.mobileNumber}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">Email <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
                            <input
                                className={`input ${errors.email ? 'border-red-400 focus:border-red-500' : ''}`}
                                placeholder="voter@email.com"
                                type="email"
                                {...f('email')}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">Ward</label>
                            <select className="input bg-white" {...f('ward')}>
                                {['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5',
                                    'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10'].map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="" className='label'>Fingerprint Enrollment <span className='text-red-500'>*</span></label>
                            <div className={`border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-colors duration-200
                ${fpState === 'success' ? 'border-green-400 bg-green-50' :
                                    fpState === 'scanning' ? 'border-blue-400 bg-blue-50' :
                                        errors.fingerprint ? 'border-red-400 bg-red-50' :
                                            'border-purple-100 bg-blue-50'}`}>
                                <FingerprintScanner state={fpState} size='sm' disabled={fpState == 'success'}
                                    onScan={() => {
                                        setFpState('scanning')
                                        setErrors(e => ({ ...e, fingerprint: '' }))
                                        setTimeout(() => {
                                            // Simulate unique FP token per voter (in prod: real SDK token)
                                            const token = 'FP_ENROLLED_' + form.voterId.trim();
                                            setFpToken(token);
                                            setFpState('success');
                                        }, 2000)
                                    }}
                                />
                                <p className='text-xs text-center text-gray-400'>
                                    {fpState === 'idle' ? 'Click scanner to enroll fingerprint' :
                                        fpState === 'scanning' ? 'Scanning... hold still' :
                                            fpState === 'success' ? '✓ Fingerprint enrolled successfully!' :
                                                'Try again'}
                                </p>
                            </div>
                            {errors.fingerprint && (
                                <p className='text-red-500 text-[11px] mt-1'>{errors.fingerprint}</p>
                            )}
                        </div>

                        <button
                            className="btn-primary w-full mt-2"
                            onClick={handleSubmit}
                            disabled={registerMut.isPending}
                        >
                            {registerMut.isPending
                                ? <><span className="animate-spin">⏳</span> Registering...</>
                                : <><UserPlus size={14} /> Register Voter</>
                            }
                        </button>
                    </div>

                    <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-3.5">
                        <p className="text-[11px] text-blue-700 font-semibold mb-1">📋 Note</p>
                        <ul className="text-[11px] text-blue-600 space-y-1 leading-relaxed">
                            <li>• Voter ID must be unique (e.g. VOT-001)</li>
                            <li>• Mobile number used for OTP verification</li>
                            <li>• Each voter can cast only one vote</li>
                            <li>• Fingerprint scan required at time of voting</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VoterRegistration;