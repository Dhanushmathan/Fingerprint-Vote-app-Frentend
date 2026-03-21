import React from 'react'

const CaseVote = () => {
  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-900'>Cast Your Vote</h2>
      <p className='text-sm text-gray-400 mt-1 mb-7'>One person · One vote · Ward 7 Municipal Council Election 2025</p>

      <div className='grid grid-cols-[1fr_300px] gap-6 items-start'>

        {/* Candidates List */}
        <div>
          <div className='card text-center py-14'>
            <p className="font-semibold text-gray-600 mb-1">No candidates registered</p>
            <p className="text-sm text-gray-400">Go to Party Registration and add candidates first.</p>
          </div>
        </div>

        {/* Voter verification sidebar */}
        <div className='flex flex-col gap-4'>

          {/* Step 1: Detdils + OTP */}
          <div className='card'>
            <p className='text-xl font-bold text-gray-900 mb-4'>🔐 Voter Verification</p>

            <div className='space-y-3'>
              <div>
                <label className="label">Voter ID</label>
                <input className="input" placeholder="VOT-001" />
              </div>
              <div>
                <label className="label">Mobile Number</label>
                <input className="input" placeholder="+91 XXXXX XXXXX" />
              </div>
              <button
                className="btn-primary w-full"
              >
                Send OTP →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseVote;