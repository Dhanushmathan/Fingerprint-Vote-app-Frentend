import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { otpAPI, partyAPI, voteAPI, voterAPI } from "../services/api";
import toast from "react-hot-toast";
import SuccessOverlay from "../components/SuccessOverlay";
import CandidateCard from "../components/CandidateCard";
import OtpInput from "../components/OtpInput";
import FingerprintScanner from "../components/FingerprintScanner";
import { ShieldCheck } from "lucide-react";
import VoteConfirmModal from "../components/VoteConfirmModal";
import AlreadyVotedModal from "../components/AlreadyVotedModal";
import RegisterAccordion from "../components/RegisterAccordion";

const StepBadge = ({ num, label, active, done }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 transition-all duration-300
        ${done ? 'bg-green-500 text-white' :
          active ? 'bg-blue-500 text-white' :
            'bg-gray-100 text-gray-400'}`}>
        {done ? '✓' : num}
      </div>
      <span className={`text-xs font-semibold transition-colors duration-300
        ${done ? 'text-green-600' : active ? 'text-blue-600' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  )
}

const CaseVote = () => {

  // Voter verification steps
  const STEP = { IDLE: 0, OTP_SENT: 1, OTP_VERIFIED: 2, FP_VERIFIED: 3 }

  const navigate = useNavigate();

  //Vefification state
  const [step, setStep] = useState(STEP.IDLE);
  const [voterId, setVoterId] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [fpState, setFpState] = useState('idle');
  const [verifiedVoter, setVerifiedVoter] = useState(null);
  // Voting state
  const [selectedCand, setSelectedCand] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alreadyData, setAlreadyData] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const { data: partiesData } = useQuery({
    queryKey: ['parties'],
    queryFn: () => partyAPI.getAll().then(res => res.data),
  });

  const allCandidates = (partiesData || []).flatMap(p =>
    (p.candidates || []).map(c => ({
      ...c,
      partyName: p.name,
      partySymbol: p.symbol,
      partyColorTheme: p.colorTheme,
    })));

  const sendOtpMut = useMutation({
    mutationFn: () => otpAPI.send({ voterId, mobileNumber: mobile }),
    onSuccess: (res) => {
      toast.success(res.data.message)
      setStep(STEP.OTP_SENT);
      // Dev mode: backend message-la "dev: 123456" format-la OTP varuthu → auto-fill
      const match = res.data.message?.match(/dev:\s*(\d{6})/i);
      if (match) {
        setOtp(match[1]); // Auto-fill OTP in dev mode
        toast('Auto-filled OTP for dev mode', { icon: '🤖', duration: 2000 });
      }
    }
  });

  const verifyOtpMut = useMutation({
    mutationFn: () => otpAPI.verify({ voterId, mobileNumber: mobile, otpCode: otp }),
    onSuccess: async (res) => {
      setSessionToken(res.data.sessionToken);
      toast.success(res.data.message);
      setStep(STEP.OTP_VERIFIED);

      // Fetch voter details to check if already voted
      try {
        const vRes = await voterAPI.getByVoterId(voterId);
        setVerifiedVoter(vRes.data);
        // if (vRes.data.hasVoted) {
        //   setAlreadyData({
        //     voterId: vRes.data.voterId,
        //     votedForCandidate: vRes.data.votedForCandidate,
        //     votedForParty: vRes.data.votedForPartyName,
        //     votedAt: vRes.data.votedAt,
        //   })
        // }
      } catch (_) {
        toast.error("Failed to fetch voter details. Please try again.")
      }
    }
  });

  const castVoteMut = useMutation({
    mutationFn: (fpToken) => voteAPI.cast({
      voterId,
      candidateId: selectedCand.id,
      fingerprintToken: fpToken,
      otpSessionToken: sessionToken,
    }),
    onSuccess: (res) => {
      setShowConfirm(false);
      setSuccessData({ ...res.data, voterId })
    },
    onError: (err) => {
      setShowConfirm(false);
      if (err.response?.data?.error === 'ALREADY_VOTED') {
        setAlreadyData(err.response.data);
      }
    }
  });

  // ── FP scan (simulated) ───────────────────────────
  const doFpScan = () => {
    if (step < STEP.OTP_VERIFIED) { toast.error("Please complete OTP verification first."); return }
    setFpState('scanning');
    setTimeout(async () => {
      setFpState('verified');
      setFpState('Success');
      setStep(STEP.FP_VERIFIED);

      try {
        const vRes = await voterAPI.getByVoterId(voterId);
        const freshVoter = vRes.data;
        setVerifiedVoter(freshVoter);
        if (freshVoter.hasVoted) {
          toast.error("You have already voted!");
          setAlreadyData({
            voterId: freshVoter.voterId,
            votedForCandidate: freshVoter.votedForCandidateName,
            votedForParty: freshVoter.votedForPartyName,
            votedAt: freshVoter.votedAt,
          })
        }else{
          toast.success("Boimetric verified! Select your candidate");
        }
      } catch (error) {

      }
      toast.success("Biometric verified! You can now cast your vote.")

    }, 2500);
  };

  const handleSelectCand = (cand) => {
    if (step < STEP.FP_VERIFIED) {
      toast.error("Please complete voter verification first.", {}); return
    }
    if (verifiedVoter?.hasVoted) {
      setAlreadyData({
        voterId: verifiedVoter.voterId,
        votedForCandidate: verifiedVoter.votedForCandidateName,
        votedForParty: verifiedVoter.votedForPartyName,
        votedAt: verifiedVoter.votedAt,
      });
      return;
    }
    setSelectedCand(cand);
  }

  // Called after inline registration — auto-fill fields
  const handleRegistered = (vid, mob) => {
    setVoterId(vid);
    setMobile(mob);
    setStep(STEP.IDLE);
  };

  if (successData) {
    return <SuccessOverlay data={successData} onGoResults={() => navigate('/results')} />
  }

  return (
    <div>
      <h2 className='text-xl md:text-2xl font-bold text-gray-900'>Cast Your Vote</h2>
      <p className='text-sm text-gray-400 mt-1 mb-7'>One person · One vote · Ward 7 Municipal Council Election 2025</p>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start'>

        {/* Candidates List */}
        <div>
          {
            allCandidates.length === 0 ? (
              <div className='card text-center py-14'>
                <p className="font-semibold text-gray-600 mb-1">No candidates registered</p>
                <p className="text-sm text-gray-400">Go to Party Registration and add candidates first.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {allCandidates.map(cand => {
                  const isMyVote = verifiedVoter?.hasVoted && verifiedVoter.votedForCandidateName === cand.name;
                  const isLocked = verifiedVoter?.hasVoted && !isMyVote;
                  return (
                    <CandidateCard key={cand.id}
                      candidate={cand}
                      selected={selectedCand?.id === cand.id}
                      voted={isMyVote}
                      locked={isLocked}
                      onSelect={handleSelectCand} />
                  )
                })}
              </div>
            )
          }

          <div className="mt-4 bg-white border border-purple-100 rounded-2xl px-4 md:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {verifiedVoter?.hasVoted
                  ? `✓ Voted for ${verifiedVoter.votedForCandidateName}`
                  : selectedCand
                    ? `Selected: ${selectedCand.name}`
                    : 'No candidate selected'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {step < STEP.FP_VERIFIED
                  ? 'Verify your identity first'
                  : verifiedVoter?.hasVoted
                    ? 'Your vote is permanently recorded'
                    : 'Select a candidate and confirm with fingerprint'}
              </p>
            </div>
            <button
              className="btn-primary whitespace-nowrap w-full sm:w-auto"
              disabled={!selectedCand || step < STEP.FP_VERIFIED || verifiedVoter?.hasVoted || castVoteMut.isPending}
              onClick={() => setShowConfirm(true)}
            >
              🫆 Cast Vote
            </button>
          </div>

        </div>

        {/* Voter verification sidebar */}
        <div className='flex flex-col gap-4'>

          {/* Progress Step */}
          <div className="card py-4">
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Verification Steps</p>
            <div className="flex flex-col gap-3">
              <StepBadge num='1' label="Enter Voter ID + Mobile" active={step === STEP.IDLE} done={step > STEP.IDLE} />
              <StepBadge num='2' label='Verify OTP' active={step === STEP.OTP_SENT} done={step > STEP.OTP_SENT} />
              <StepBadge num='3' label='Fingerprint Scan' active={step === STEP.OTP_VERIFIED} done={step > STEP.OTP_VERIFIED} />
              <StepBadge num='4' label='Select & Cast Vote' active={step === STEP.FP_VERIFIED} done={verifiedVoter?.hasVoted} />
            </div>
          </div>

          {/* Step 1: Detdils + OTP */}
          <div className='card'>
            <p className='text-xl font-bold text-gray-900 mb-4'>🔐 Voter Verification</p>

            <div className='space-y-3'>
              <div>
                <label className="label">Voter ID</label>
                <input className="input" placeholder="VOT-001" value={voterId} onChange={e => setVoterId(e.target.value)} disabled={step >= STEP.OTP_SENT} />
              </div>
              <div>
                <label className="label">Mobile Number</label>
                <input className="input" placeholder="+91 XXXXX XXXXX" value={mobile} onChange={e => setMobile(e.target.value)} disabled={step >= STEP.OTP_SENT} />
              </div>
              <button
                className="btn-primary w-full"
                onClick={() => sendOtpMut.mutate()}
                disabled={sendOtpMut.isPending || step >= STEP.OTP_SENT}
              >
                {step >= STEP.OTP_SENT ? '✓ OTP Sent' : sendOtpMut.isPending ? 'Sending...' : 'Send OTP →'}
              </button>
            </div>

            {/* Step 2: OTP input */}
            {
              step >= STEP.OTP_SENT && (
                <div className="mt-5 pt-4 border-t border-purple-100">
                  <label htmlFor="" className="label mb-3">Enter OTP</label>
                  <OtpInput length={6} value={otp} onChange={setOtp} />
                  <div className="flex gap-2 mt-3">
                    <button className="btn-primary flex-1" onClick={() => verifyOtpMut.mutate()} disabled={otp.length < 6 || verifyOtpMut.isPending || step >= STEP.OTP_VERIFIED}>
                      {step >= STEP.OTP_VERIFIED ? '✓ Verified' : verifyOtpMut.isPending ? '...' : 'Verify OTP'}
                    </button>
                    <button className="btn-outline px-3" onClick={() => { setOtp(''); sendOtpMut.mutate() }}>Resend</button>
                  </div>
                </div>
              )
            }
          </div>

          {/* ── New voter? Register accordion ── */}
          {
            step < STEP.OTP_SENT && (
              <RegisterAccordion onRegistered={handleRegistered} />
            )
          }

          {/* Step 3: Fingerprint verification */}
          <div className={`card flex flex-col items-center gap-3 transition-opacity duration-300
            ${step < STEP.OTP_VERIFIED ? 'opacity-60 pointer-events-none' : ''}`}>
            <p className="text-sm font-bold text-gray-900 self-start flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round"><path strokeWidth="1.5" d="M5 9c0-3.3 0-4.95 1.025-5.975S8.7 2 12 2s4.95 0 5.975 1.025S19 5.7 19 9v6c0 3.3 0 4.95-1.025 5.975S15.3 22 12 22s-4.95 0-5.975-1.025S5 18.3 5 15z"></path><path strokeLinejoin="round" strokeWidth="1.5" d="M16 13v-2.5a4 4 0 0 0-8 0V13"></path><path strokeLinejoin="round" strokeWidth="1.5" d="M13.5 11v-.5a1.5 1.5 0 0 0-3 0V14m3-.5V15"></path><path strokeLinejoin="round" strokeWidth="2" d="M12 19v.01"></path></g></svg>
              <span>Biometric Scan</span>
            </p>
            <FingerprintScanner state={fpState} onScan={doFpScan} disabled={step < STEP.OTP_VERIFIED} size="md" />
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              {step < STEP.OTP_VERIFIED
                ? 'Verify OTP first to enable scanner'
                : fpState === 'idle'
                  ? 'Click scanner to authenticate'
                  : fpState === 'scanning'
                    ? 'Hold still...'
                    : 'Identity confirmed! Select your candidate.'}
            </p>
          </div>

          {/* Verified voter info */}
          {
            verifiedVoter && step >= STEP.FP_VERIFIED && (
              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center
                                font-display font-black text-sm text-blue-600 shrink-0">
                    {verifiedVoter.voterId?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{verifiedVoter.fullName || verifiedVoter.voterId}</p>
                    <p className="text-xs text-gray-400">{verifiedVoter.voterId}</p>
                  </div>
                  <ShieldCheck size={16} className="text-green-500 shrink-0" />
                </div>
                {
                  verifiedVoter.hasVoted && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-700">⚠️ Already Voted</p>
                      <p className="text-[11px] text-amber-600 mt-1 leading-relaxed">
                        You voted for <strong>{verifiedVoter.votedForCandidateName}</strong>.
                        Each voter can only vote once.
                      </p>
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </div>

      {/* Modals */}
      {showConfirm && selectedCand && (
        <VoteConfirmModal candidate={selectedCand}
          voterId={voterId}
          sessionToken={sessionToken}
          onConfirm={() => castVoteMut.mutate('FP_ENROLLED_' + voterId.trim().toUpperCase())}
          onClose={() => setShowConfirm(false)}
          loading={castVoteMut.isPending} />
      )}

      {alreadyData && (
        <AlreadyVotedModal data={alreadyData} onClose={() => setAlreadyData(null)} />
      )}
    </div>
  )
}

export default CaseVote;