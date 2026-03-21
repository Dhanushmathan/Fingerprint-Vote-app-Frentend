import { PlusCircle } from 'lucide-react';
import React from 'react'

const PartyRegistration = () => {
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
              Parties
            </span>
          </div>
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
                <input className="input" placeholder="e.g. Progressive Alliance" />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className="label">Party Leader <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="Leader name" />
                </div>
                <div>
                  <label className="label">Founded Year</label>
                  <input className="input" type="number" placeholder="2024" min="1900" max="2025" />
                </div>
              </div>
              <div>
                <label className="label">Party Symbol (Emoji)</label>
                <input className="input text-center text-2xl" maxLength={2} placeholder="🌟" />
              </div>
              <div>
                <label className="label">Color Theme</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  Picker Emojii
                </div>
              </div>
              <div>
                <label className="label">Manifesto / Key Issues</label>
                <input className="input" placeholder="e.g. Infrastructure, Education" />
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
                <input className="input" placeholder="Candidate name" />
              </div>
              <div>
                <label className="label">Age</label>
                <input className="input" type="number" placeholder="35" min="25" max="80" />
              </div>
            </div>
            <div className="mb-4">
              <label className="label">Qualifications</label>
              <input className="input" placeholder="e.g. B.Tech, MBA" />
            </div>

            <button className="btn-outline w-full">
              <PlusCircle size={14} /> Add Candidate
            </button>
          </div>

          <button
            className="btn-success w-full"
          >
            Register Party
          </button>
        </div>
      </div>
    </div>
  )
}

export default PartyRegistration;