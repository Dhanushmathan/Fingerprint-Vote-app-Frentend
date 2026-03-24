import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'
import { voterAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FingerprintScanner from './FingerprintScanner';

const RegisterAccordion = ({ onRegistered }) => {

    const emptyForm = {
        voterId: '', fullName: '', mobileNumber: '', email: '', ward: 'Ward 7',
    };

    const qc = useQueryClient();
    const [open, setOpen] = useState(false);
    const [fpState, setFpState] = useState('idle');
    const [fpToken, setFpToken] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const registerMut = useMutation({
        mutationFn: (data) => voterAPI.register(data),
        onSuccess: (res) => {
            toast.success("Registered! Now verify with OTP to vote 🎉");
            qc.invalidateQueries(['voters']);
            onRegistered(res.data.voterId, form.mobileNumber);
            setOpen(false);
            setFpState('idle');
            setFpToken('');
            setForm(emptyForm);
        },
    });

    const validate = () => {
        const e = {};
        if (!form.voterId.trim()) e.voterId = 'Voter ID is required';
        if (!form.fullName.trim()) e.fullName = 'Full name is required';
        if (!form.mobileNumber.trim()) e.mobileNumber = 'Mobile number is required';
        else if (!/^[+]?[0-9]{10,13}$/.test(form.mobileNumber.replace(/\s/g, '')))
            e.mobileNumber = 'Enter valid mobile number';
        if (!fpToken) {
            e.fingerprint = 'Fingerprint scan required';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const f = (field) => ({
        value: form[field],
        onChange: e => {
            setForm(v => ({ ...v, [field]: e.target.value }))
            if (errors[field]) setErrors(v => ({ ...v, [field]: '' }))
        },
    });

    return (
        <div className='border border-dashed border-blue-300 rounded-2xl overflow-hidden transition-all duration-300'>
            <button onClick={() => setOpen(o => !o)} className='w-full flex items-center justify-between px-4 py-3.5
                   bg-blue-50 hover:bg-blue-100 transition-colors duration-200'>
                <div className='flex items-center gap-2.5'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className='text-blue-500 shrink-0'><path fill="currentColor" d="M18 14v-3h-3V9h3V6h2v3h3v2h-3v3zm-9-2q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12m-8 8v-2.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20z" /></svg>
                    <span className='text-sm font-semibold text-blue-700'>New voter? Register here first</span>
                </div>
                {
                    open ? <ChevronUp size={15} className='text-blue-400' />
                        : <ChevronDown size={15} className='text-blue-400' />
                }
            </button>

            {
                open && (
                    <div className='px-4 py-4 bg-white border-t border-blue-100 space-y-3'>
                        <div>
                            <label htmlFor="" className='label'>Voter ID <span className='text-red-500'>*</span></label>
                            <input type="text" className={`input ${errors.voterId ? 'border-red-400' : ''}`}
                                placeholder="e.g. VOT-001" {...f('voterId')} />
                            {errors.voterId && <p className="text-red-500 text-[11px] mt-1">{errors.voterId}</p>}
                        </div>
                        <div>
                            <label className='label'>Full Name <span className='text-red-500'>*</span></label>
                            <input type="text" className={`input ${errors.fullName ? 'border-red-400' : ''}`} placeholder='e.g Peter Parker' {...f('fullName')} />
                            {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>}
                        </div>
                        <div>
                            <label className="label">Mobile Number <span className='text-red-500'>*</span></label>
                            <input className={`input ${errors.mobileNumber ? 'border-red-400' : ''}`}
                                placeholder="+91 98765 43210" type="tel" {...f('mobileNumber')} />
                            {errors.mobileNumber && <p className="text-red-500 text-[11px] mt-1">{errors.mobileNumber}</p>}
                        </div>
                        <div>
                            <label className="label">Email <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
                            <input className="input" placeholder="voter@email.com" type="email" {...f('email')} />
                        </div>
                        <div>
                            <label className="label">Ward</label>
                            <select className="input bg-white" {...f('ward')}>
                                {Array.from({ length: 10 }, (_, i) => `Ward ${i + 1}`).map(w => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="" className='label'>Fingerprint Enrollment <span className='text-red-500'>*</span></label>
                            <div className={`border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-colors duration-200
              ${fpState === 'success' ? 'border-green-400 bg-green-50' :
                                    fpState === 'scanning' ? 'border-blue-400 bg-blue-50' :
                                        errors.fingerprint ? 'border-red-400 bg-red-50' :
                                            'border-purple-100 bg-blue-50'}`}>
                                <FingerprintScanner state={fpState} size='sm' disabled={fpState === 'success'} onScan={() => {
                                    setFpState('scanning')
                                    setErrors(e => ({ ...e, fingerprint: '' }))
                                    setTimeout(() => {
                                        const token = 'FP_ENROLLED_' + form.voterId.trim().toUpperCase();
                                        setFpToken(token);
                                        setFpState('success');
                                    }, 2000)
                                }} />
                                <p className="text-[11px] text-center text-gray-400">
                                    {fpState === 'idle' ? 'Click to scan fingerprint' :
                                        fpState === 'scanning' ? 'Scanning... hold still' :
                                            '✓ Fingerprint enrolled!'}
                                </p>
                            </div>
                            {
                                errors.fingerprint && (
                                    <p className='text-red-500 text-[11px] mt-1'>{errors.fingerprint}</p>
                                )
                            }
                        </div>

                        <button
                            className='btn-primary w-full'
                            onClick={() => validate() && registerMut.mutate({
                                ...form,
                                mobileNumber: form.mobileNumber.replace(/\s/g, ''),
                                fingerprintToken: fpToken
                            })}
                            disabled={registerMut.isPending}
                        >
                            {registerMut.isPending ? '⏳ Registering...' :
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" className='shrink-0'><path fill="currentColor" d="M18 14v-3h-3V9h3V6h2v3h3v2h-3v3zm-9-2q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12m-8 8v-2.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20z" /></svg>
                                    <span>Register & Proceed to Vote</span>
                                </>}
                        </button>
                    </div>
                )
            }
        </div>
    )
}

export default RegisterAccordion;